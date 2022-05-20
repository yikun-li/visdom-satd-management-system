package nl.rug.mvittersum.bproj.commentparser.types;

import nl.rug.mvittersum.bproj.commentparser.CombinedParser;
import nl.rug.mvittersum.bproj.commentparser.parsers.SlashSlashCommentParser;
import nl.rug.mvittersum.bproj.commentparser.parsers.SlashStarCommentParser;

public class CCommentParser extends CombinedParser {
	public CCommentParser() {
		super(new SlashSlashCommentParser(), new SlashStarCommentParser());
	}
}
