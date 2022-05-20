package nl.rug.mvittersum.bproj.commentparser;

import java.util.List;

public class CombinedParser implements CommentParser {
	private final CommentParser[] parsers;

	protected CombinedParser(CommentParser... parsers) {
		this.parsers = parsers;
	}

	@Override
	public List<Comment> parse(String content) {
		if (parsers.length == 0) {
			throw new IllegalStateException("No parsers available");
		}

		List<Comment> comments = null;
		for (CommentParser parser : parsers) {
			if (comments == null) {
				comments = parser.parse(content);
			} else {
				comments.addAll(parser.parse(content));
			}
		}

		return comments;
	}
}
