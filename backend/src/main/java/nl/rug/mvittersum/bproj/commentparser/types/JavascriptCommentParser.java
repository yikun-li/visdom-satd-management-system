package nl.rug.mvittersum.bproj.commentparser.types;

import nl.rug.mvittersum.bproj.commentparser.CombinedParser;
import nl.rug.mvittersum.bproj.commentparser.parsers.SlashSlashCommentParser;
import nl.rug.mvittersum.bproj.commentparser.parsers.SlashStarCommentParser;

public class JavascriptCommentParser extends CombinedParser {
	public JavascriptCommentParser() {
		super(new SlashSlashCommentParser(), new SlashStarCommentParser());
	}
}
