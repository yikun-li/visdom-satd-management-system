package nl.rug.mvittersum.bproj.backend.mappers;

import org.joda.time.DateTime;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Component
public class UtilMappers {
	public String mapDate(Date date) {
		return date == null ? null : date.toInstant().toString();
	}

	public Date mapEpoch(int epoch) {
		return Date.from(Instant.ofEpochSecond(epoch));
	}

	public String mapUuid(UUID id) {
		return id == null ? null : id.toString();
	}

	public String mapInstant(Instant instant) {
		return instant == null ? null : instant.toString();
	}

	public Date mapDateTime(DateTime dateTime) {
		return dateTime == null ? null : dateTime.toDate();
	}
}
