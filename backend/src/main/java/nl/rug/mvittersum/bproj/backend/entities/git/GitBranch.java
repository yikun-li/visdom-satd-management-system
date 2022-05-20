package nl.rug.mvittersum.bproj.backend.entities.git;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitBranch {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	@ManyToOne(fetch = FetchType.LAZY)
	private GitRepository repository;

	private String name;

	@ManyToMany(cascade = CascadeType.MERGE)
	@JoinTable(
			name = "git_branch_commits",
			joinColumns = @JoinColumn(name = "git_branch_id"),
			inverseJoinColumns = @JoinColumn(name = "git_commit_id")
	)
	private Set<GitCommit> commits;

	@Transient
	private Boolean stored;

	@Transient
	private Integer totalCommits;

	@Transient
	private Integer totalSnapped;
}
