package nl.rug.mvittersum.bproj.backend.entities.git;

import lombok.*;
import nl.rug.mvittersum.bproj.backend.data.KeywordsMap;
import nl.rug.mvittersum.bproj.commentparser.Comment;
import nl.rug.mvittersum.bproj.satd.DebtType;
import org.hibernate.annotations.Type;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GitCodeComment {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@EqualsAndHashCode.Exclude
	@ToString.Exclude
	@OneToMany(mappedBy = "comment")
	private Set<GitFileComment> files;

	@Column(columnDefinition = "text")
	private String content;

	@Enumerated(EnumType.STRING)
	private Comment.CommentType type;

	private Integer contentHash;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, columnDefinition = "varchar(255) default 'NOT_ANALYSED'")
	@Builder.Default
	private DebtType debtType = DebtType.NOT_ANALYSED;

	private Double debtProbability;

	@Type(type = "KeywordsMapType")
	private KeywordsMap keywords;
}
