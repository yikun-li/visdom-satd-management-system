package nl.rug.mvittersum.bproj.backend.dtos;

import lombok.Value;

@Value
public class ErrorDto {
	String status = "error";
	String message;
}
