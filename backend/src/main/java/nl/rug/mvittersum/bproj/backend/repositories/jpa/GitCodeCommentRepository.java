package nl.rug.mvittersum.bproj.backend.repositories.jpa;

import nl.rug.mvittersum.bproj.backend.entities.git.GitCodeComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GitCodeCommentRepository extends JpaRepository<GitCodeComment, Long> {
	Optional<GitCodeComment> findByContentHash(int contentHash);
}
