package nl.rug.mvittersum.bproj.commentparser.types;

import nl.rug.mvittersum.bproj.commentparser.Comment;
import org.junit.jupiter.api.Test;
import org.springframework.util.ResourceUtils;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class JavaCommentParserTest {
	private final JavaCommentParser parser = new JavaCommentParser();

	@Test
	public void testParse() throws IOException {
		File file = ResourceUtils.getFile("classpath:testsources/Example.java");
		String content = Files.readString(file.toPath(), StandardCharsets.UTF_8);

		List<Comment> comments = parser.parse(content);

		assertEquals(5, comments.size());
	}
}
