package nl.rug.mvittersum.bproj.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jdbc.repository.config.EnableJdbcRepositories;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@EnableJpaRepositories(basePackages = "nl.rug.mvittersum.bproj.backend.repositories.jpa")
@EnableJdbcRepositories(basePackages = "nl.rug.mvittersum.bproj.backend.repositories.jdbc")
public class TechDebtBackendApplication {

	public static void main(String[] args) {
		// This is set to true to allow the "%2F" encoded character ("/") in the URL query.
		System.setProperty("org.apache.tomcat.util.buf.UDecoder.ALLOW_ENCODED_SLASH", "true");
		SpringApplication.run(TechDebtBackendApplication.class, args);
	}

}
