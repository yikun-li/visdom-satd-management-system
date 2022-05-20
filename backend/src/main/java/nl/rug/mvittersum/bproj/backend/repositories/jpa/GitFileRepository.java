package nl.rug.mvittersum.bproj.backend.repositories.jpa;

import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface GitFileRepository extends JpaRepository<GitFile, Long> {
	@Query("SELECT DISTINCT gf FROM GitFile gf LEFT JOIN FETCH gf.comments gfc LEFT JOIN FETCH gfc.comment WHERE gf.id = :fileId")
	Optional<GitFile> findByIdWithComments(Long fileId);

	List<GitFile> findByIdIn(Collection<Long> ids);

	@EntityGraph(attributePaths = "comments")
	List<GitFile> findAllByIdIn(Collection<Long> ids);
}
