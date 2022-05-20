package nl.rug.mvittersum.bproj.backend.entities.git;

import lombok.*;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitSnapshot {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	@ManyToOne(fetch = FetchType.LAZY)
	private GitRepository repository;

	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	@ManyToOne(fetch = FetchType.LAZY)
	private GitSnapshot parent;

	@ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
	private Set<GitFile> removedFiles;

	@ManyToMany(cascade = {CascadeType.MERGE, CascadeType.PERSIST})
	private Set<GitFile> addedFiles;

	@OneToMany(mappedBy = "snapshot")
	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	private List<GitCommit> commits;

	private Integer depth;

	@Transient
	private GitCommentStatistics statistics;

	@Transient
	private List<GitFile> fileCache = null;

	public List<GitFile> getFiles() {
		if (fileCache != null) {
			return fileCache;
		}

		if (parent == null) {
			fileCache = new ArrayList<>(addedFiles);
		} else {
			fileCache = new ArrayList<>(parent.getFiles());
			fileCache.removeAll(removedFiles);
			fileCache.addAll(addedFiles);
		}
		return fileCache;
	}
}
