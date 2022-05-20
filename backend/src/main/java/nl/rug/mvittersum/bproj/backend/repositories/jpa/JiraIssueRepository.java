package nl.rug.mvittersum.bproj.backend.repositories.jpa;

import nl.rug.mvittersum.bproj.backend.entities.jira.JiraIssue;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface JiraIssueRepository extends JpaRepository<JiraIssue, Long> {
	List<JiraIssue> findAllByProjectIdAndKeyIn(Long projectId, Collection<String> keys);

	Page<JiraIssue> findAllByProjectId(Long projectId, Pageable pageable);
}
