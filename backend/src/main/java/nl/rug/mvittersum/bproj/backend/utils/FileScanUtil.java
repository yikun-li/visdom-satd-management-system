package nl.rug.mvittersum.bproj.backend.utils;

import lombok.experimental.UtilityClass;

import java.io.File;
import java.io.FilenameFilter;
import java.util.LinkedList;
import java.util.List;

@UtilityClass
public class FileScanUtil {

	public static List<File> scanDirectory(File directory, FilenameFilter filter) {
		List<File> files = new LinkedList<>();
		scan(files, directory, filter);
		return files;
	}

	private static void scan(List<File> files, File directory, FilenameFilter filter) {
		var content = directory.listFiles(filter);

		if (content == null) return;

		for (File file : content) {
			if (file.isDirectory()) {
				files.add(file);
				scan(files, file, filter);
			} else {
				files.add(file);
			}
		}
	}
}
