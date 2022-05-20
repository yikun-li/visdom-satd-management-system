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
public class JiraIssueStatusUpdate {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private JiraIssue issue;

	@Temporal(TemporalType.TIMESTAMP)
	private Date date;

	private String status;
}
