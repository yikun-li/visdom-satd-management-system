package nl.rug.mvittersum.bproj.commentparser;

import nl.rug.mvittersum.bproj.commentparser.types.*;

import java.util.Arrays;
import java.util.Optional;
import java.util.function.Supplier;

public enum CommentLanguage {
	JAVA(JavaCommentParser::new, "java"),
	JAVASCRIPT(JavascriptCommentParser::new, "js", "ts", "jsx", "tsx"),
	C(CCommentParser::new, "c", "h"),
	CPP(CCommentParser::new, "cpp"),
	PYTHON(PythonCommentParser::new, "py", "python"),
	HTML(HtmlCommentParser::new, "html", "htm");

	private final Supplier<CommentParser> parser;
	private final String[] extensions;

	CommentLanguage(Supplier<CommentParser> parser, String... extensions) {
		this.parser = parser;
		this.extensions = extensions;
	}

	public static Optional<CommentLanguage> fromExtension(String extension) {
		return Arrays.stream(CommentLanguage.values()).filter(language -> language.matchExtension(extension)).findAny();
	}

	public CommentParser getParser() {
		return parser.get();
	}

	public boolean matchExtension(String ext) {
		return Arrays.asList(extensions).contains(ext);
	}
}
