package nl.rug.mvittersum.bproj.backend.entities.git;

import lombok.*;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;

import javax.persistence.*;
import java.util.Date;
import java.util.Set;

@Entity
@Table(indexes = {@Index(columnList = "hash", unique = true)})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitCommit {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String hash;

	@Temporal(TemporalType.TIMESTAMP)
	private Date commitDate;

	@Column(columnDefinition = "text")
	private String shortMessage;

	@Column(columnDefinition = "text")
	private String fullMessage;

	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	@ManyToOne(fetch = FetchType.LAZY)
	private GitCommit parent;

	@OneToMany(mappedBy = "parent")
	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	private Set<GitCommit> children;

	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	@ManyToOne(fetch = FetchType.LAZY, cascade = {CascadeType.ALL})
	private GitSnapshot snapshot;

	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	@ManyToMany(mappedBy = "commits")
	private Set<GitBranch> branches;

	@Transient
	private GitCommentStatistics statistics;
}
