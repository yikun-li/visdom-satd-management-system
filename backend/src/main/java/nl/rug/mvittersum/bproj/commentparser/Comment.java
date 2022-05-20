package nl.rug.mvittersum.bproj.commentparser;

import lombok.Value;
import org.antlr.v4.runtime.tree.TerminalNode;

import java.util.function.Function;

@Value
public class Comment {
	String content;
	CommentType type;
	int line;

	public static Comment fromNode(TerminalNode node, CommentType type) {
		return new Comment(node.getText(), type, node.getSymbol().getLine());
	}

	public static Function<TerminalNode, Comment> nodeFn(CommentType type) {
		return (node) -> fromNode(node, type);
	}

	public enum CommentType {
		INLINE,
		INLINE_MULTI,
		BLOCK,
		DOC_BLOCK
	}
}
