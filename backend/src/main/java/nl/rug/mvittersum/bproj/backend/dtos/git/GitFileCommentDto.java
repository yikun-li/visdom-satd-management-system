package nl.rug.mvittersum.bproj.backend.dtos.git;

import lombok.Value;
import nl.rug.mvittersum.bproj.backend.data.KeywordsMap;
import nl.rug.mvittersum.bproj.commentparser.Comment;
import nl.rug.mvittersum.bproj.satd.DebtType;

@Value
public class GitFileCommentDto {
	Long id;
	String content;
	DebtType debtType;
	Double debtProbability;
	Comment.CommentType type;
	Integer line;
	KeywordsMap keywords;
}
