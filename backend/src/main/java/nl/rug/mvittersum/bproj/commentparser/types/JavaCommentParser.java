package nl.rug.mvittersum.bproj.commentparser.types;

import nl.rug.mvittersum.bproj.commentparser.CombinedParser;
import nl.rug.mvittersum.bproj.commentparser.parsers.SlashSlashCommentParser;
import nl.rug.mvittersum.bproj.commentparser.parsers.SlashStarCommentParser;

public class JavaCommentParser extends CombinedParser {
	public JavaCommentParser() {
		super(new SlashSlashCommentParser(), new SlashStarCommentParser());
	}
}
