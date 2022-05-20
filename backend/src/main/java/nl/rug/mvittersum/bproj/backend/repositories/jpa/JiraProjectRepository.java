package nl.rug.mvittersum.bproj.backend.repositories.jpa;

import nl.rug.mvittersum.bproj.backend.entities.jira.JiraProject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JiraProjectRepository extends JpaRepository<JiraProject, Long> {
	List<JiraProject> findAllByProjectId(Long projectId);
}
