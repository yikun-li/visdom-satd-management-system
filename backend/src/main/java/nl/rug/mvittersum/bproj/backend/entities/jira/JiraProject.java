package nl.rug.mvittersum.bproj.backend.entities.jira;

import com.atlassian.jira.rest.client.api.AuthenticationHandler;
import com.atlassian.jira.rest.client.auth.AnonymousAuthenticationHandler;
import com.atlassian.jira.rest.client.auth.BasicHttpAuthenticationHandler;
import lombok.*;
import nl.rug.mvittersum.bproj.backend.entities.Project;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraProject {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@ToString.Exclude
	@EqualsAndHashCode.Exclude
	private Project project;

	private String name;
	private String url;
	private String username;
	private String password;

	private String projectKey;
	private String projectName;

	@Temporal(TemporalType.TIMESTAMP)
	private Date lastScanned;

	@OneToMany(mappedBy = "project", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REMOVE})
	private Set<JiraIssue> issues;

	public AuthenticationHandler getAuthenticationHandler() {
		return (username != null && password != null)
				? new BasicHttpAuthenticationHandler(username, password)
				: new AnonymousAuthenticationHandler();
	}
}
