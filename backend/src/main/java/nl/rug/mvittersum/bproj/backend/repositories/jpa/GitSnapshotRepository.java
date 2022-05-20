package nl.rug.mvittersum.bproj.backend.repositories.jpa;

import nl.rug.mvittersum.bproj.backend.entities.git.GitSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GitSnapshotRepository extends JpaRepository<GitSnapshot, Long> {
}
