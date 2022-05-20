package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import nl.rug.mvittersum.bproj.backend.entities.git.GitSnapshot;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitCommitRepository;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitSnapshotRepository;
import nl.rug.mvittersum.bproj.backend.services.git.snap.GitCommitSnapshotIntervalCreator;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.Clock;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class GitSnapshotCreationService {
	private final GitSnapshotFileService gitSnapshotFileService;
	private final GitCommitRepository gitCommitRepository;
	private final GitSnapshotRepository gitSnapshotRepository;
	private final Clock clock;

	@Value("${app.git.max-file-snap-batch}")
	private Integer maxFileBatch;

	/**
	 * <p>Finds commits in a branch from a certain moment to a certain moment.</p>
	 *
	 * @param repositoryId Git repository ID.
	 * @param branch       The name of the branch.
	 * @param from         From moment.
	 * @param to           To moment.
	 * @return A collection of commits.
	 */
	public List<GitCommit> getCommits(Long repositoryId, String branch, Instant from, Instant to) {
		from = from == null ? Instant.ofEpochSecond(0) : from;
		to = to == null ? Instant.now(clock) : to;
		return gitCommitRepository.findCommitsFromToWithoutSnapshot(repositoryId, branch, Date.from(from), Date.from(to));
	}

	/**
	 * <p>Creates for a list of commits snapshots based on their index.</p>
	 *
	 * @param commits A list of commits.
	 * @param every Create a snapshot every x commits.
	 * @param keyEvery Create a key snapshot every x commits.
	 * @throws IOException Something somewhere went wrong.
	 */
	public void createSnapshotsAtIndexInterval(List<GitCommit> commits, Integer every, Integer keyEvery) throws IOException {
		log.info("For {} commits, create every {} a snapshot and every {} a key snapshot", commits.size(), every, keyEvery);

		new GitCommitSnapshotIntervalCreator(maxFileBatch, every, keyEvery) {
			@Override
			public GitSnapshot createKey(GitCommit commit) throws IOException {
				return createKeySnapshot(commit);
			}

			@Override
			public GitSnapshot createPartial(GitCommit commit, GitCommit parent) throws IOException {
				return createPartialSnapshot(commit, parent);
			}

			@Override
			public void store(List<GitSnapshot> snapshots) {
				gitSnapshotRepository.saveAll(snapshots);
			}
		}.process(commits);

		log.info("Finished creating snapshots");
	}

	private GitSnapshot createKeySnapshot(GitCommit commit) throws IOException {
		var snapshot = new GitSnapshot();
		snapshot.setCommits(List.of(commit));
		snapshot.setParent(null);
		snapshot.setRepository(commit.getBranches().iterator().next().getRepository());
		snapshot.setAddedFiles(gitSnapshotFileService.findAllSnapshotFiles(snapshot.getRepository(), commit.getHash()));
		snapshot.setDepth(0);
		return snapshot;
	}

	private GitSnapshot createPartialSnapshot(GitCommit commit, GitCommit parent) throws IOException {
		var snapshot = new GitSnapshot();
		snapshot.setCommits(List.of(commit));
		snapshot.setParent(parent.getSnapshot());
		snapshot.setRepository(commit.getBranches().iterator().next().getRepository());
		var diff = gitSnapshotFileService
				.findDiffFiles(snapshot.getRepository(), parent.getSnapshot(), parent.getHash(), commit.getHash());
		snapshot.setAddedFiles(diff.getFirst());
		snapshot.setRemovedFiles(diff.getSecond());
		snapshot.setDepth(parent.getSnapshot().getDepth() + 1);
		return snapshot;
	}
}
