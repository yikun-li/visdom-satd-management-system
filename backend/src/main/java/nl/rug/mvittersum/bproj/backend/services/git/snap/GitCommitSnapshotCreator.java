package nl.rug.mvittersum.bproj.backend.services.git.snap;

import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import nl.rug.mvittersum.bproj.backend.entities.git.GitSnapshot;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Slf4j
public abstract class GitCommitSnapshotCreator {
	private final int maxFileBatch;
	private final List<GitCommit> tail = new ArrayList<>();
	private List<GitSnapshot> storeSnaps = new ArrayList<>();
	private GitCommit head;
	private int fileBatchSize = 0;

	public GitCommitSnapshotCreator(int maxFileBatch, GitCommit head) {
		this.maxFileBatch = maxFileBatch;
		this.head = head;
	}

	public GitCommitSnapshotCreator(int maxFileBatch) {
		this(maxFileBatch, null);
	}

	public void process(Collection<GitCommit> commits) throws IOException {
		log.info("Processing {} commits", commits.size());
		for (var commit : commits) {
			var decision = commit.getSnapshot() != null || head == null ? CommitAction.MAKE_KEY : decide(commit);
			process(commit, decision);
		}
		createSnapshots();
		saveSnaps();
	}

	private void process(GitCommit commit, CommitAction action) throws IOException {
		switch (action) {
			case SKIP:
				break;
			case MAKE_KEY:
				createSnapshots();
				head = commit;
				break;
			case MAKE_PARTIAL:
				tail.add(commit);
				break;
		}
	}

	private void createSnapshots() throws IOException {
		if (head == null) return;

		if (head.getSnapshot() == null) {
			log.info("Creating key snapshot, followed by tail of {}", tail.size());
			addSnapshot(head, createKey(head));
		}

		for(var commit : tail) {
			addSnapshot(commit, createPartial(commit, head));
			head = commit;
		}

		tail.clear();
		head = null;
	}

	private void addSnapshot(GitCommit commit, GitSnapshot snapshot) {
		storeSnaps.add(snapshot);
		commit.setSnapshot(snapshot);
		fileBatchSize += snapshot.getAddedFiles().size();
		if (fileBatchSize >= maxFileBatch) {
			saveSnaps();
		}
	}

	private void saveSnaps() {
		log.info("Storing {} snapshots", storeSnaps.size());
		store(storeSnaps);
		fileBatchSize = 0;
		storeSnaps = new ArrayList<>();
	}

	public abstract GitSnapshot createKey(GitCommit commit) throws IOException;

	public abstract GitSnapshot createPartial(GitCommit commit, GitCommit parent) throws IOException;

	public abstract void store(List<GitSnapshot> snapshots);

	public abstract CommitAction decide(GitCommit commit);

	public enum CommitAction {
		SKIP,
		MAKE_KEY,
		MAKE_PARTIAL
	}
}
