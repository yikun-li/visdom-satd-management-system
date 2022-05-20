package nl.rug.mvittersum.bproj.backend.repositories.jpa;

import nl.rug.mvittersum.bproj.backend.entities.git.GitCommit;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface GitCommitRepository extends JpaRepository<GitCommit, Long> {
	@EntityGraph(attributePaths = {"snapshot"})
	@Query("SELECT gc FROM GitCommit gc WHERE gc.id = :id")
	Optional<GitCommit> findByIdWithSnapshot(Long id);

	@EntityGraph(attributePaths = {"snapshot"})
	@Query("SELECT gc FROM GitCommit gc INNER JOIN gc.branches gb WHERE gb.id = :branchId ORDER BY gc.commitDate DESC")
	Page<GitCommit> findAllInBranch(Long branchId, Pageable pageable);

	@EntityGraph(attributePaths = {"snapshot"})
	@Query("SELECT gc FROM GitCommit gc " +
			"LEFT JOIN gc.branches gb " +
			"LEFT JOIN gb.repository " +
			"WHERE gb.repository.id = :repositoryId AND gb.name = :branch " +
			"AND gc.commitDate BETWEEN :from AND :to " +
			"ORDER BY gc.commitDate ASC")
	List<GitCommit> findCommitsFromToWithoutSnapshot(Long repositoryId, String branch, Date from, Date to);

	@Query("SELECT gc FROM GitCommit gc JOIN gc.branches gb WHERE gb.name = :branch AND gb.repository.id = :repositoryId ORDER BY gc.commitDate DESC ")
	List<GitCommit> findLastCommitInBranch(Long repositoryId, String branch, Pageable pageable);

	@EntityGraph(attributePaths = {"snapshot"})
	@Query("SELECT gc FROM GitCommit gc JOIN gc.branches gb WHERE gb.name = :branch AND gb.repository.id = :repositoryId AND gc.snapshot IS NOT NULL ORDER BY gc.commitDate DESC ")
	List<GitCommit> findLastCommitInBranchWithSnapshot(Long repositoryId, String branch, Pageable pageable);
}
