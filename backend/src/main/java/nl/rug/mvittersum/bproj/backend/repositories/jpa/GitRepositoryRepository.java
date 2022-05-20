package nl.rug.mvittersum.bproj.backend.repositories.jpa;

import nl.rug.mvittersum.bproj.backend.entities.git.GitRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GitRepositoryRepository extends JpaRepository<GitRepository, Long> {
	Optional<GitRepository> findGitRepositoryByIdAndProjectId(Long repositoryId, Long projectId);

	List<GitRepository> findAllByProjectId(Long projectId);

	@Query("SELECT gr " +
			"FROM GitRepository gr " +
			"LEFT JOIN FETCH GitBranch gb ON (gb.repository = gr AND ((:branch IS NULL AND gb.name = gr.defaultBranch) OR gb.name = :branch)) " +
			"WHERE gr.id = :repositoryId")
	Optional<GitRepository> findWithBranch(Long repositoryId, String branch);

	@Query("SELECT DISTINCT gr FROM GitRepository gr WHERE gr.id = :id")
	Optional<GitRepository> findWithCommits(Long id);
}
