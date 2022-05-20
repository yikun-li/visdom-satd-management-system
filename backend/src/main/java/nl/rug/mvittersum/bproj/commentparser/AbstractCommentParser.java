package nl.rug.mvittersum.bproj.commentparser;

import org.antlr.v4.runtime.*;

import java.util.List;
import java.util.stream.Stream;

public abstract class AbstractCommentParser<L extends Lexer> implements CommentParser {
	protected static Stream<Comment> toComments(ParserRuleContext context, int tokenType, Comment.CommentType commentType) {
		return context.getTokens(tokenType).stream().map(Comment.nodeFn(commentType));
	}

	protected abstract L getLexer(CharStream stream);

	protected abstract List<Comment> getComments(CommonTokenStream tokens);

	@Override
	public List<Comment> parse(String content) {
		L lexer = getLexer(CharStreams.fromString(content));
		CommonTokenStream tokens = new CommonTokenStream(lexer);
		return getComments(tokens);
	}
}
