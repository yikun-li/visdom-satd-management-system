package nl.rug.mvittersum.bproj.backend.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class GitDirectory {
	private String name;
	private String path;
	private List<GitFile> files;
	private GitCommentStatistics statistics;

	public GitDirectory(String name, String path) {
		this(name, path, new ArrayList<>(), null);
	}
}
