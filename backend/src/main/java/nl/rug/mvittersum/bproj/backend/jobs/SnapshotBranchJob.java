package nl.rug.mvittersum.bproj.backend.jobs;

import lombok.EqualsAndHashCode;
import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.dtos.requests.CreateGitSnapshotDto;
import nl.rug.mvittersum.bproj.backend.services.git.GitSnapshotCreationService;

import java.time.Instant;
import java.util.function.Consumer;

@RequiredArgsConstructor
@EqualsAndHashCode
public class SnapshotBranchJob implements Job.Task {
	private final GitSnapshotCreationService gitSnapshotService;
	private final Long repositoryId;
	private final CreateGitSnapshotDto createGitSnapshotDto;

	@Override
	public void run(Consumer<Job.Task> next) throws Throwable {
		var commits = gitSnapshotService.getCommits(
				repositoryId,
				createGitSnapshotDto.getBranch(),
				createGitSnapshotDto.getFrom() == null ? null : Instant.parse(createGitSnapshotDto.getFrom()),
				createGitSnapshotDto.getTo() == null ? null : Instant.parse(createGitSnapshotDto.getTo())
		);

		gitSnapshotService.createSnapshotsAtIndexInterval(
				commits,
				createGitSnapshotDto.getCreateSnapshotEvery(),
				createGitSnapshotDto.getCreateKeySnapshotEvery()
		);
	}

	@Override
	public JobType getType() {
		return null;
	}
}
