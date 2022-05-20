package nl.rug.mvittersum.bproj.commentparser.parsers;

import nl.rug.mvittersum.bproj.commentparser.AbstractCommentParser;
import nl.rug.mvittersum.bproj.commentparser.Comment;
import nl.rug.mvittersum.bproj.commentparser.grammar.HashCommentGrammarLexer;
import nl.rug.mvittersum.bproj.commentparser.grammar.SlashSlashCommentGrammarParser;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CommonTokenStream;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

public class HashCommentParser extends AbstractCommentParser<HashCommentGrammarLexer> {
	@Override
	protected HashCommentGrammarLexer getLexer(CharStream stream) {
		return new HashCommentGrammarLexer(stream);
	}

	@Override
	protected List<Comment> getComments(CommonTokenStream tokens) {
		var parsed = new SlashSlashCommentGrammarParser(tokens).parse();

		return Stream.concat(
				toComments(parsed, HashCommentGrammarLexer.MULTILINE_COMMENT, Comment.CommentType.INLINE_MULTI),
				toComments(parsed, HashCommentGrammarLexer.SINGLELINE_COMMENT, Comment.CommentType.INLINE)
		).collect(Collectors.toList());
	}
}
