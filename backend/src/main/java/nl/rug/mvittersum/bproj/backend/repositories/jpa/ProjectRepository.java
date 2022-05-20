package nl.rug.mvittersum.bproj.backend.repositories.jpa;

import nl.rug.mvittersum.bproj.backend.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
}
