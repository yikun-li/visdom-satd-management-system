package nl.rug.mvittersum.bproj.backend.entities;

import lombok.Data;
import nl.rug.mvittersum.bproj.backend.entities.git.GitRepository;
import nl.rug.mvittersum.bproj.backend.entities.jira.JiraProject;
import nl.rug.mvittersum.bproj.backend.utils.Tuples;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table
@Data
public class Project {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String name;

	@OneToMany(mappedBy = "project")
	private List<GitRepository> gitRepositories;

	@OneToMany(mappedBy = "project")
	private List<JiraProject> jiraProjects;

	@Temporal(TemporalType.TIMESTAMP)
	private Date created;

	@Temporal(TemporalType.TIMESTAMP)
	private Date lastUpdated;

	@Transient
	private Tuples.Double<Integer, Integer> amountOfSources;
}
