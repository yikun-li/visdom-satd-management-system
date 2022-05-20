package nl.rug.mvittersum.bproj.backend.data;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.io.Serializable;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

public class KeywordsMap extends HashMap<String, Double> implements Serializable {
	private static final TypeReference<HashMap<String, String>> STRING_HASHMAP_TYPEREF = new TypeReference<>() {
	};

	public KeywordsMap(Map<String, ?> map) {
		super(map.size());
		map.forEach((key, value) -> put(String.valueOf(key), Double.valueOf(value.toString())));
	}

	public KeywordsMap(String json, ObjectMapper mapper) throws IOException {
		this(mapper.readValue(json.getBytes(StandardCharsets.UTF_8), STRING_HASHMAP_TYPEREF));
	}

	public String toJsonString(ObjectMapper mapper) throws JsonProcessingException {
		return mapper.writeValueAsString(
				entrySet().stream().collect(Collectors.toMap(
						Entry::getKey,
						(entry) -> entry.getValue().toString()
				))
		);
	}
}
