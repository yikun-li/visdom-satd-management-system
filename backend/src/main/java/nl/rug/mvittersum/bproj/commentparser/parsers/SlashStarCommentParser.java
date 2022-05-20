package nl.rug.mvittersum.bproj.commentparser.parsers;

import nl.rug.mvittersum.bproj.commentparser.AbstractCommentParser;
import nl.rug.mvittersum.bproj.commentparser.Comment;
import nl.rug.mvittersum.bproj.commentparser.grammar.SlashStarCommentGrammarLexer;
import nl.rug.mvittersum.bproj.commentparser.grammar.SlashStarCommentGrammarParser;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CommonTokenStream;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class SlashStarCommentParser extends AbstractCommentParser<SlashStarCommentGrammarLexer> {
	@Override
	protected SlashStarCommentGrammarLexer getLexer(CharStream stream) {
		return new SlashStarCommentGrammarLexer(stream);
	}

	@Override
	protected List<Comment> getComments(CommonTokenStream tokens) {
		var parsed = new SlashStarCommentGrammarParser(tokens).parse();

		return Stream.concat(
				toComments(parsed, SlashStarCommentGrammarLexer.BLOCK_COMMENT, Comment.CommentType.BLOCK),
				toComments(parsed, SlashStarCommentGrammarLexer.DOC_COMMENT, Comment.CommentType.DOC_BLOCK)
		).collect(Collectors.toList());
	}
}
