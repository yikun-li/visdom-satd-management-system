package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.entities.git.GitRepository;
import nl.rug.mvittersum.bproj.backend.services.JobService;
import nl.rug.mvittersum.bproj.backend.utils.GitHelper;
import org.eclipse.jgit.api.Git;
import org.eclipse.jgit.api.ListBranchCommand;
import org.eclipse.jgit.api.errors.GitAPIException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GitClientService {
	private final JobService jobService;
	@Value("${app.git.location}")
	private String repoLocation;

	/**
	 * <p>Returns the {@link Git} instance belonging to the repository.</p>
	 *
	 * @param repository Repository entity object, the ID is used.
	 * @return The Git client.
	 * @throws IOException Opening the location can fail into an IOException.
	 */
	public Git getClient(Long repositoryId) throws IOException {
		return GitHelper.open(getRepositoryLocation(repositoryId));
	}

	/**
	 * <p>Returns the {@link Git} instance belonging to the repository.</p>
	 *
	 * @param repository Repository entity object, the ID is used.
	 * @return The Git client.
	 * @throws IOException Opening the location can fail into an IOException.
	 */
	public Git getClient(GitRepository repository) throws IOException {
		return GitHelper.open(getRepositoryLocation(repository));
	}

	/**
	 * <p>Returns the location where the repository should be stored locally.</p>
	 *
	 * @param repository Repository entity object, the ID is used.
	 * @return A File object as the location.
	 */
	public File getRepositoryLocation(Long repositoryId) {
		return new File(repoLocation, repositoryId.toString());
	}

	/**
	 * <p>Returns the location where the repository should be stored locally.</p>
	 *
	 * @param repository Repository entity object, the ID is used.
	 * @return A File object as the location.
	 */
	public File getRepositoryLocation(GitRepository repository) {
		return getRepositoryLocation(repository.getId());
	}

	public List<String> getRemoteBranches(GitRepository repository) throws IOException, GitAPIException {
		return getClient(repository)
				.branchList()
				.setListMode(ListBranchCommand.ListMode.REMOTE)
				.call()
				.stream()
				.map(ref -> ref.getName().substring("refs/remotes/origin/".length()))
				.collect(Collectors.toList());
	}
}
