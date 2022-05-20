package nl.rug.mvittersum.bproj.backend.dtos;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Value;

import java.util.List;

@Value
public class HeatMapTreeDto {
	Node root;

	@Value
	@JsonInclude(JsonInclude.Include.NON_NULL)
	public static class Node {
		String name;
		Integer value;
		List<Node> children;
	}
}
