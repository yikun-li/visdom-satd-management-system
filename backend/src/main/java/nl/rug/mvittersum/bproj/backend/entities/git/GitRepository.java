package nl.rug.mvittersum.bproj.backend.entities.git;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import nl.rug.mvittersum.bproj.backend.entities.Project;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table
@Data
public class GitRepository {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	private Project project;

	@OneToMany(mappedBy = "repository")
	private List<GitSnapshot> snapshots;

	@OneToMany(mappedBy = "repository")
	private List<GitBranch> branches;

	private String url;
	private String name;
	private String defaultBranch;
	private Integer updateInterval;

	@Temporal(TemporalType.TIMESTAMP)
	private Date lastFetched;
}
