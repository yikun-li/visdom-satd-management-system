package nl.rug.mvittersum.bproj.backend.utils;

import lombok.experimental.UtilityClass;

import java.util.Optional;

@UtilityClass
public class FileUtil {

	public static Optional<String> fileExtension(String filename) {
		if (!filename.contains(".") || (filename.startsWith(".") && !filename.substring(1).contains("."))) {
			return Optional.empty();
		}

		return Optional.of(filename.substring(filename.lastIndexOf(".") + 1));
	}
}
