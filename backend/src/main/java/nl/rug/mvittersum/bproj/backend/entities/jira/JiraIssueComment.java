package nl.rug.mvittersum.bproj.backend.entities.jira;

import lombok.*;

import javax.persistence.*;
import java.util.Date;

@Table
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraIssueComment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private JiraIssue issue;

	@Temporal(TemporalType.TIMESTAMP)
	private Date creationDate;

	private String author;

	@OneToOne(cascade = {CascadeType.ALL}, fetch = FetchType.EAGER)
	private JiraClassifiable content;
}
