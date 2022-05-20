package nl.rug.mvittersum.bproj.backend.entities.jira;

import lombok.*;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Table
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraIssue {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private JiraProject project;

	private String key;
	private String type;
	private String resolution;
	private String status;

	@OneToOne(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
	private JiraClassifiable summary;

	@OneToOne(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
	private JiraClassifiable description;

	@Temporal(TemporalType.TIMESTAMP)
	private Date creationDate;

	@Temporal(TemporalType.TIMESTAMP)
	private Date updateDate;

	@OneToMany(mappedBy = "issue", cascade = {CascadeType.ALL})
	private Set<JiraIssueComment> comments;

	@OneToMany(mappedBy = "issue", cascade = {CascadeType.ALL})
	private Set<JiraIssueStatusUpdate> updates;
}
