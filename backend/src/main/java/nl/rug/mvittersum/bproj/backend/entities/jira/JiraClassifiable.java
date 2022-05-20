package nl.rug.mvittersum.bproj.backend.entities.jira;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import nl.rug.mvittersum.bproj.backend.data.KeywordsMap;
import nl.rug.mvittersum.bproj.satd.DebtType;
import org.hibernate.annotations.Type;

import javax.persistence.*;

@Table
@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JiraClassifiable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(columnDefinition = "text")
	private String content;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, columnDefinition = "varchar(255) default 'NOT_ANALYSED'")
	@Builder.Default
	private DebtType debtType = DebtType.NOT_ANALYSED;

	@Builder.Default
	private Double debtProbability = null;

	@Type(type = "KeywordsMapType")
	@Builder.Default
	private KeywordsMap keywords = null;
}
