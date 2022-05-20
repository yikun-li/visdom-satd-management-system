package nl.rug.mvittersum.bproj.commentparser;

import java.util.List;

public interface CommentParser {
	List<Comment> parse(String content);
}
