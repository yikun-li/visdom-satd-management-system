package nl.rug.mvittersum.bproj.commentparser.types;

import nl.rug.mvittersum.bproj.commentparser.CombinedParser;
import nl.rug.mvittersum.bproj.commentparser.parsers.HashCommentParser;

public class PythonCommentParser extends CombinedParser {
	public PythonCommentParser() {
		super(new HashCommentParser());
	}
}
