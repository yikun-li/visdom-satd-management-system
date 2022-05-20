package nl.rug.mvittersum.bproj.backend.repositories.jpa;

import nl.rug.mvittersum.bproj.backend.entities.git.GitBranch;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface GitBranchRepository extends JpaRepository<GitBranch, Long> {
	@EntityGraph(attributePaths = {"repository", "commits"})
	@Query("SELECT gb " +
			"FROM GitBranch gb " +
			"WHERE gb.name = gb.repository.defaultBranch AND gb.repository.id = :repositoryId")
	Optional<GitBranch> findByRepositoryIdAsDefaultBranch(Long repositoryId);

	@EntityGraph(attributePaths = {"repository", "commits"})
	@Query("SELECT gb " +
			"FROM GitBranch gb " +
			"WHERE gb.name = :name AND gb.repository.id = :repositoryId")
	Optional<GitBranch> findByRepositoryIdAndName(Long repositoryId, String name);
}
