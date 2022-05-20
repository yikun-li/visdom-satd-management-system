package nl.rug.mvittersum.bproj.backend.services.git.snap;

import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;

public abstract class GitCommitSnapshotIntervalCreator extends GitCommitSnapshotCreator {
	private final int every;
	private final int keyEvery;
	private int i = 0;

	public GitCommitSnapshotIntervalCreator(int maxFileBatch, int every, int keyEvery) {
		super(maxFileBatch);
		this.every = every;
		this.keyEvery = keyEvery;
	}

	@Override
	public CommitAction decide(GitCommit commit) {
		i++;
		if (i % keyEvery == 0) return CommitAction.MAKE_KEY;
		if (i % every == 0) return CommitAction.MAKE_PARTIAL;
		return CommitAction.SKIP;
	}
}
