package nl.rug.mvittersum.bproj.backend.exceptions;

public class InternalServerException extends RuntimeException {
	public InternalServerException(Throwable cause) {
		super("Internal Server Error", cause);
	}
}
