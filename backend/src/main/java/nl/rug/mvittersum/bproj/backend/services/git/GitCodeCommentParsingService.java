package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCodeComment;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFileComment;
import nl.rug.mvittersum.bproj.backend.mappers.GitCodeCommentMapper;
import nl.rug.mvittersum.bproj.backend.repositories.jdbc.GitCodeCommentJdbcRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jdbc.GitFileJdbcRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitCodeCommentRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitFileRepository;
import nl.rug.mvittersum.bproj.backend.utils.FileUtil;
import nl.rug.mvittersum.bproj.commentparser.Comment;
import nl.rug.mvittersum.bproj.commentparser.CommentLanguage;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitCodeCommentParsingService {
	private static final int SCAN_BATCH_SIZE = 100;

	private final GitCodeCommentRepository gitCodeCommentRepository;
	private final GitFileJdbcRepository gitFileJdbcRepository;
	private final GitFileRepository gitFileRepository;
	private final GitCodeCommentMapper gitCodeCommentMapper;
	private final GitCodeCommentJdbcRepository gitCodeCommentJdbcRepository;

	/**
	 * <p>Searches the entire branch for files that have to be scanned and executes the scan on these.</p>
	 *
	 * @param branchId The ID of the branch to be scanned.
	 */
	public void scanBranch(Long branchId) {
		scan(gitFileJdbcRepository.getFilesToScan(branchId), gitCodeCommentJdbcRepository.getCommentMap(branchId));
	}

	/**
	 * <p>Scans the given files for comments and stores them appropriately in the database.</p>
	 *
	 * @param fileIds                 A list of IDs to files that are to be scanned for comments.
	 * @param initialStoredCommentMap A map with the hashcode of the content of the comment as the key and the ID of
	 *                                the comment as the value.
	 */
	public void scan(List<Long> fileIds, Map<Integer, Long> initialStoredCommentMap) {
		log.info("Scanning {} files", fileIds.size());
		var commentCache = new CommentCache(gitCodeCommentMapper::fromNewComment, gitCodeCommentRepository::getOne, initialStoredCommentMap);

		while (!fileIds.isEmpty()) {
			log.info("Scanning batch of {} files", SCAN_BATCH_SIZE);
			var batch = fileIds.stream().limit(SCAN_BATCH_SIZE).collect(Collectors.toList());
			var files = gitFileRepository.findAllById(batch);
			for (var file : files) {
				file.setComments(parse(file, commentCache));
				file.setScannedForComments(true);
			}
			var savedComments = gitFileRepository.saveAll(files);
			commentCache.store(gitCodeCommentJdbcRepository.getCommentMap(savedComments.stream().map(GitFile::getId).collect(Collectors.toList())));
			fileIds.removeAll(batch);
		}
	}

	/**
	 * <p>Parses the content of the {@link GitFile} and returns a set of {@link GitCodeComment}s that were
	 * found in the file.</p>
	 *
	 * @param file         The file to parse.
	 * @param commentCache An object containing references to existing comments, so duplicates can be found.
	 * @return A set of comments. This set is empty if the file could not have been parsed, or if there were no comments.
	 */
	private Set<GitFileComment> parse(GitFile file, CommentCache commentCache) {
		var extension = FileUtil.fileExtension(file.getFilename());
		if (extension.isEmpty()) return Collections.emptySet();

		var lang = CommentLanguage.fromExtension(extension.get());
		if (lang.isEmpty()) return Collections.emptySet();

		return lang.get().getParser()
				.parse(file.getContent())
				.stream()
				.map(comment -> GitFileComment.builder()
						.comment(commentCache.get(comment))
						.file(file)
						.line(comment.getLine())
						.build()
				)
				.collect(Collectors.toSet());
	}

	@RequiredArgsConstructor
	private static class CommentCache {
		private final Function<Comment, GitCodeComment> commentMapper;
		private final Function<Long, GitCodeComment> getCommentReference;
		private final Map<Integer, Long> storedCache;
		private final Map<Integer, GitCodeComment> newCache = new HashMap<>();

		public GitCodeComment get(Comment comment) {
			var hash = comment.getContent().hashCode();
			if (storedCache.containsKey(hash)) {
				return getCommentReference.apply(storedCache.get(hash));
			}
			if (newCache.containsKey(hash)) {
				return newCache.get(hash);
			}
			var codeComment = commentMapper.apply(comment);
			newCache.put(hash, codeComment);
			return codeComment;
		}

		public void store(Map<Integer, Long> newStoreCache) {
			newCache.clear();
			storedCache.putAll(newStoreCache);
		}
	}
}
