package nl.rug.mvittersum.bproj.backend.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.analyser.AnalyserRequests;
import nl.rug.mvittersum.bproj.analyser.dtos.AnalyserStatusDto;
import nl.rug.mvittersum.bproj.backend.repositories.jdbc.AnalyserJdbcRepository;
import nl.rug.mvittersum.bproj.backend.utils.Tuples;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
@RequiredArgsConstructor
@Slf4j
public class AnalyserService {
	private final HttpClient httpClient;
	private final ObjectMapper objectMapper;
	private final AnalyserRequests analyserRequests;
	private final AnalyserJdbcRepository analyserJdbcRepository;

	private <T> T sendRequest(HttpRequest request, Class<T> dto) throws IOException, InterruptedException {
		HttpResponse<byte[]> response = httpClient.send(request, HttpResponse.BodyHandlers.ofByteArray());
		return objectMapper.readValue(response.body(), dto);
	}

	private AnalyserStatusDto getStatus(HttpRequest request) {
		try {
			return sendRequest(request, AnalyserStatusDto.class);
		} catch (Exception e) {
			log.error("Failed getting status of analyser", e);
			throw new RuntimeException("Failed getting status of analyser", e);
		}
	}

	private void start(HttpRequest request) {
		try {
			var res = sendRequest(request, AnalyserStatusDto.class);
			log.info("Started analyser {}", res.getStatus());
		} catch (Exception e) {
			log.error("Failed starting analyser", e);
			throw new RuntimeException("Failed starting analyser", e);
		}
	}

	public AnalyserStatusDto getCommentStatus() {
		return getStatus(analyserRequests.getCommentStatus());
	}

	public AnalyserStatusDto getIssueStatus() {
		return getStatus(analyserRequests.getIssueStatus());
	}

	public void startCommentAnalyser() {
		start(analyserRequests.startCommentScanner());
	}

	public void startIssueAnalyser() {
		start(analyserRequests.startIssueScanner());
	}

	@Transactional(readOnly = true)
	public Tuples.Double<Integer, Integer> getWorkLeft() {
		return analyserJdbcRepository.getWorkLeft();
	}
}
