package nl.rug.mvittersum.bproj.backend.entities.git;

import lombok.*;

import javax.persistence.*;

@Entity
@Table
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GitFileComment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	private GitFile file;

	@ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private GitCodeComment comment;

	private Integer line;
}
