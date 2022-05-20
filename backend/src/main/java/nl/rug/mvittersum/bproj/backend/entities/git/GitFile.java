package nl.rug.mvittersum.bproj.backend.entities.git;

import lombok.Data;
import nl.rug.mvittersum.bproj.backend.data.GitCommentStatistics;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table
@Data
public class GitFile {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@OneToMany(mappedBy = "file", cascade = CascadeType.ALL)
	private Set<GitFileComment> comments;

	private String filename;
	private String path;

	@Column(columnDefinition = "text")
	private String content;

	private Boolean directory;
	private Boolean scannedForComments = false;

	@Transient
	private GitCommentStatistics statistics;
}
