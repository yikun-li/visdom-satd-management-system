package nl.rug.mvittersum.bproj.backend.controllers.advice;

import lombok.extern.slf4j.Slf4j;
import nl.rug.mvittersum.bproj.backend.dtos.ErrorDto;
import nl.rug.mvittersum.bproj.backend.exceptions.InternalServerException;
import nl.rug.mvittersum.bproj.backend.exceptions.NotFoundException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

@ControllerAdvice
@Slf4j
public class ControllerExceptionHandler {

	@ExceptionHandler(NotFoundException.class)
	public HttpEntity<ErrorDto> handleNotFoundException(NotFoundException e) {
		log.warn("Not found exception", e);
		return ResponseEntity.status(404).body(new ErrorDto("Not found"));
	}

	@ExceptionHandler(NoHandlerFoundException.class)
	public HttpEntity<ErrorDto> handleNotFoundException(NoHandlerFoundException e) {
		log.warn("Not found exception", e);
		return ResponseEntity.status(404).body(new ErrorDto("Not found"));
	}

	@ExceptionHandler(UnsupportedOperationException.class)
	public HttpEntity<ErrorDto> handleNotImplemented(UnsupportedOperationException e) {
		return ResponseEntity.status(501).body(new ErrorDto("Not implemented"));
	}

	@ExceptionHandler(Exception.class)
	public HttpEntity<ErrorDto> handleServerError(Exception e) {
		log.error("Unhandled exception", e);
		return ResponseEntity.status(500).body(new ErrorDto("Internal server error"));
	}

	@ExceptionHandler(HttpRequestMethodNotSupportedException.class)
	public HttpEntity<ErrorDto> handleMethodNotSupported() {
		return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(new ErrorDto("Method not allowed"));
	}

	@ExceptionHandler(InternalServerException.class)
	public HttpEntity<ErrorDto> handleInternalServerError(InternalServerException e) {
		log.error("Internal server error caused by", e.getCause());
		return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ErrorDto("Internal server error"));
	}

	@ExceptionHandler(MissingServletRequestParameterException.class)
	public HttpEntity<ErrorDto> handleMissingServletRequestParameterException(MissingServletRequestParameterException e) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new ErrorDto("Invalid request, missing '" + e.getParameterName() + "'"));
	}
}
