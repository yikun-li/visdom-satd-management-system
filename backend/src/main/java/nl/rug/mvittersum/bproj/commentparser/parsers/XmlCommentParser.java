package nl.rug.mvittersum.bproj.commentparser.parsers;

import nl.rug.mvittersum.bproj.commentparser.AbstractCommentParser;
import nl.rug.mvittersum.bproj.commentparser.Comment;
import nl.rug.mvittersum.bproj.commentparser.grammar.XmlCommentGrammarLexer;
import nl.rug.mvittersum.bproj.commentparser.grammar.XmlCommentGrammarParser;
import org.antlr.v4.runtime.CharStream;
import org.antlr.v4.runtime.CommonTokenStream;

import java.util.List;
import java.util.stream.Collectors;

public class XmlCommentParser extends AbstractCommentParser<XmlCommentGrammarLexer> {
	@Override
	protected XmlCommentGrammarLexer getLexer(CharStream stream) {
		return new XmlCommentGrammarLexer(stream);
	}

	@Override
	protected List<Comment> getComments(CommonTokenStream tokens) {
		var parsed = new XmlCommentGrammarParser(tokens).parse();

		return toComments(parsed, XmlCommentGrammarLexer.XML_COMMENT, Comment.CommentType.BLOCK).collect(Collectors.toList());
	}
}
