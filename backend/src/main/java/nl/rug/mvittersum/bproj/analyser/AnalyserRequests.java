package nl.rug.mvittersum.bproj.analyser;

import lombok.RequiredArgsConstructor;

import java.net.URI;
import java.net.http.HttpRequest;

@RequiredArgsConstructor
public class AnalyserRequests {
	private static final String COMMENTS_SCANNER_PATH = "/comments/scanner";
	private static final String ISSUES_SCANNER_PATH = "/issues/scanner";

	private final String analyserHost;

	public HttpRequest getCommentStatus() {
		return HttpRequest.newBuilder()
				.GET()
				.uri(URI.create(analyserHost + COMMENTS_SCANNER_PATH))
				.build();
	}

	public HttpRequest getIssueStatus() {
		return HttpRequest.newBuilder()
				.GET()
				.uri(URI.create(analyserHost + ISSUES_SCANNER_PATH))
				.build();
	}

	public HttpRequest startCommentScanner() {
		return HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.noBody())
				.uri(URI.create(analyserHost + COMMENTS_SCANNER_PATH))
				.build();
	}

	public HttpRequest startIssueScanner() {
		return HttpRequest.newBuilder()
				.POST(HttpRequest.BodyPublishers.noBody())
				.uri(URI.create(analyserHost + ISSUES_SCANNER_PATH))
				.build();
	}
}
