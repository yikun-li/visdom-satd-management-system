package nl.rug.mvittersum.bproj.backend.beans;

import nl.rug.mvittersum.bproj.analyser.AnalyserRequests;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.net.http.HttpClient;
import java.time.Clock;
import java.util.UUID;
import java.util.function.Supplier;

@Configuration
public class UtilBeans {
	@Value("${app.analyser.host}")
	private String analyserHost;

	@Bean
	public Supplier<UUID> uuidGenerator() {
		return UUID::randomUUID;
	}

	@Bean
	public Clock clock() {
		return Clock.systemDefaultZone();
	}

	@Bean
	public HttpClient httpClient() {
		return HttpClient.newBuilder().build();
	}

	@Bean
	public AnalyserRequests analyserRequests() {
		return new AnalyserRequests(analyserHost);
	}
}
