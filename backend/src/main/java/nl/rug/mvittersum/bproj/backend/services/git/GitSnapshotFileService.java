package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.data.GitDirectory;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;
import nl.rug.mvittersum.bproj.backend.entities.git.GitRepository;
import nl.rug.mvittersum.bproj.backend.entities.git.GitSnapshot;
import nl.rug.mvittersum.bproj.backend.utils.Tuples;
import org.eclipse.jgit.diff.DiffEntry;
import org.eclipse.jgit.diff.DiffFormatter;
import org.eclipse.jgit.lib.Constants;
import org.eclipse.jgit.lib.ObjectId;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.treewalk.TreeWalk;
import org.eclipse.jgit.treewalk.filter.PathFilter;
import org.eclipse.jgit.util.io.NullOutputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitSnapshotFileService {
	private final GitClientService gitClientService;
	private final GitFileService gitFileService;

	@Value("${app.git.max-file-size}")
	private Integer maxFileSize;

	private static GitFile createFile(String path, String content) {
		var file = new File("/" + path);
		var gitFile = new GitFile();
		gitFile.setFilename(file.getName());
		gitFile.setPath(file.getPath().substring(0, file.getPath().length() - file.getName().length()));
		gitFile.setContent(content);
		return gitFile;
	}

	private static Map<String, GitDirectory> createDirectoryMap(List<GitFile> files, String directory) {
		var dirMap = new HashMap<String, GitDirectory>();
		files.forEach(file -> {
			var dirName = getDirectoryName(file.getPath(), directory);
			dirMap.computeIfAbsent(dirName, (key) -> new GitDirectory(key, directory)).getFiles().add(file);
		});
		return dirMap;
	}

	private static String getDirectoryName(String path, String parentDirectory) {
		return path.substring(parentDirectory.length()).split("/")[0];
	}

	private Set<GitFile> getFilesFromTree(Repository repository, RevCommit commit) throws IOException {
		var treeWalk = new TreeWalk(repository);
		var files = new HashSet<GitFile>();
		treeWalk.addTree(commit.getTree());
		treeWalk.setRecursive(false);

		while (treeWalk.next()) {
			if (treeWalk.isSubtree()) {
				treeWalk.enterSubtree();
			} else {
				files.add(createFile(treeWalk.getPathString(), getFileContent(treeWalk)));
			}
		}

		return files;
	}

	private void scanDiffEntry(Tuples.Double<Set<GitFile>, Set<GitFile>> diffLists, Repository repository,
	                           Map<String, GitFile> parentFileMap, RevCommit dest, DiffEntry entry) throws IOException {
		switch (entry.getChangeType()) {
			case DELETE:
				diffLists.getSecond().add(parentFileMap.get("/" + entry.getOldPath()));
				break;
			case MODIFY:
				diffLists.getSecond().add(parentFileMap.get("/" + entry.getOldPath()));
			case ADD:
			case COPY:
				diffLists.getFirst().add(
						createFile(entry.getNewPath(), getFileContent(repository, dest, entry.getNewPath()))
				);
		}
	}

	private String getFileContent(TreeWalk treeWalk) throws IOException {
		var content = treeWalk.getObjectReader().open(treeWalk.getObjectId(0), Constants.OBJ_BLOB);
		return content.getSize() < maxFileSize
				? new String(content.getBytes(), StandardCharsets.UTF_8).replaceAll("\u0000", "")
				: null;
	}

	private String getFileContent(Repository repository, RevCommit commit, String path) throws IOException {
		var treeWalk = new TreeWalk(repository);
		treeWalk.addTree(commit.getTree());
		treeWalk.setFilter(PathFilter.create(path));
		treeWalk.setRecursive(false);

		var found = treeWalk.next();
		while (treeWalk.isSubtree()) {
			treeWalk.enterSubtree();
			found = treeWalk.next();
		}

		return found ? getFileContent(treeWalk) : null;
	}

	private Map<String, GitFile> getFileMap(GitSnapshot snapshot) {
		var map = new HashMap<String, GitFile>();
		for (var file : snapshot.getFiles()) {
			map.put(file.getPath() + file.getFilename(), file);
		}
		return map;
	}

	/**
	 * <p>Finds all files for creating a key snapshot, using the hash of the commit it should create the snapshot for.</p>
	 *
	 * @param repository The Git repository to search in.
	 * @param hash       The hash of the commit.
	 * @return A set of non-persisted files.
	 * @throws IOException Thrown when a problem occurs on either opening the commit or a file in the commit.
	 */
	public Set<GitFile> findAllSnapshotFiles(GitRepository repository, String hash) throws IOException {
		var gitRepo = gitClientService.getClient(repository).getRepository();
		var commit = new RevWalk(gitRepo).parseCommit(ObjectId.fromString(hash));
		return getFilesFromTree(gitRepo, commit);
	}

	/**
	 * <p>Finds all that have changed, starting after the commit with hash <code>srcHash</code>, up and until the
	 * commit with hash <code>destHash</code>. All files that existed in their exact state in the starting commit and
	 * no longer do so in the destination commit will be inserted in the <em>removed</em> set (second position). All
	 * files that are new or updated will be added in the <em>added set</em> (first position).</p>
	 *
	 * @param repository     The Git repository to search in.
	 * @param parentSnapshot The parental snapshot, containing the files that exist in the commit of <code>srcHash</code>.
	 * @param srcHash        The hash of the commit starting the diff.
	 * @param destHash       The hash of the commit at the end of the s
	 * @return A {@link Tuples.Double} with in the first position the added files and in the second position the removed files.
	 * @throws IOException Thrown when a problem occurs on either opening the commit or a file in the commit.
	 */
	public Tuples.Double<Set<GitFile>, Set<GitFile>> findDiffFiles(GitRepository repository, GitSnapshot parentSnapshot, String srcHash, String destHash) throws IOException {
		var gitRepo = gitClientService.getClient(repository).getRepository();
		var revWalk = new RevWalk(gitRepo);
		var srcCommit = revWalk.parseCommit(ObjectId.fromString(srcHash));
		var destCommit = revWalk.parseCommit(ObjectId.fromString(destHash));
		var parentFileMap = getFileMap(parentSnapshot);

		DiffFormatter df = new DiffFormatter(NullOutputStream.INSTANCE);
		df.setRepository(gitRepo);
		List<DiffEntry> entries = df.scan(srcCommit.getTree(), destCommit.getTree());

		var diffLists = new Tuples.Double<Set<GitFile>, Set<GitFile>>(new HashSet<>(), new HashSet<>());
		for (DiffEntry entry : entries) {
			scanDiffEntry(diffLists, gitRepo, parentFileMap, destCommit, entry);
		}

		return diffLists;
	}

	/**
	 * <p>Finds all files in a snapshot and creates a directory map out of it. Directory filtering is used, use
	 * <code>"/"</code> to disable.</p>
	 *
	 * @param snapshot  The snapshot containing the files.
	 * @param directory The
	 * @return A Map with as key the directory name and as value a {@link GitDirectory}. Uses an empty string if the
	 * files are in the root directory.
	 */
	public Map<String, GitDirectory> getFilesInDirectory(GitSnapshot snapshot, String directory) {
		var files = gitFileService.getSnapshotFiles(snapshot.getId()).stream()
				.filter(file -> file.getPath().startsWith(directory))
				.collect(Collectors.toList());

		return createDirectoryMap(files, directory);
	}
}
