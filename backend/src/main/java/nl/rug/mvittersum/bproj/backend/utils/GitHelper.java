package nl.rug.mvittersum.bproj.backend.utils;

import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.jgit.api.CreateBranchCommand;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.eclipse.jgit.lib.Constants;
import org.eclipse.jgit.lib.Repository;
import org.eclipse.jgit.revwalk.RevCommit;
import org.eclipse.jgit.revwalk.RevSort;
import org.eclipse.jgit.revwalk.RevWalk;
import org.eclipse.jgit.revwalk.filter.RevFilter;
import org.eclipse.jgit.storage.file.FileRepositoryBuilder;

import java.io.File;
import java.io.IOException;

@UtilityClass
@Slf4j
public class GitHelper {
	/**
	 * <p>Checks if the repository is stored locally.</p>
	 *
	 * @param location The repository entity.
	 * @return True if the repository is stored locally.
	 */
	public static boolean isGitDirectory(File location) {
		File gitDir = new File(location, ".git");
		return location.exists() && location.isDirectory() && gitDir.exists() && gitDir.isDirectory();
	}

	/**
	 * @param uri
	 * @param location
	 * @return
	 * @throws GitAPIException
	 */
	public static Git clone(String uri, File location) throws GitAPIException {
		return Git.cloneRepository().setURI(uri).setDirectory(location).call();
	}

	/**
	 * @param location
	 * @return
	 * @throws IOException
	 */
	public static Git open(File location) throws IOException {
		Repository repo = new FileRepositoryBuilder()
				.setGitDir(new File(location, ".git"))
				.readEnvironment()
				.findGitDir()
				.setMustExist(true)
				.build();
		return new Git(repo);
	}

	public static RevCommit getLastCommit(Git git) throws GitAPIException {
		Iterable<RevCommit> commits = git.log().setMaxCount(1).call();
		return commits.iterator().next();
	}

	public static void checkoutBranch(Git git, String branchName) throws GitAPIException {
		try {
			git.checkout()
					.setCreateBranch(true)
					.setName(branchName)
					.setUpstreamMode(CreateBranchCommand.SetupUpstreamMode.TRACK)
					.setStartPoint("origin/" + branchName)
					.call();
		} catch (GitAPIException e) {
			git.checkout().setName(branchName).call();
		}
	}

	public static RevWalk getCommitsFromStart(Git git) throws IOException {
		var rw = new RevWalk(git.getRepository());
		rw.sort(RevSort.REVERSE);
		rw.setRevFilter(RevFilter.NO_MERGES);
		rw.markStart(rw.parseCommit(git.getRepository().resolve(Constants.HEAD)));
		return rw;
	}
}
