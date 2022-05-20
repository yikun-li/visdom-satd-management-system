package nl.rug.mvittersum.bproj.backend.data;

import lombok.Data;
import nl.rug.mvittersum.bproj.commentparser.Comment;

import java.util.Collection;
import java.util.EnumMap;
import java.util.Map;
import java.util.stream.Collectors;

@Data
public class GitCommentStatistics {
	private DebtStatistics total = new DebtStatistics();
	private Map<Comment.CommentType, DebtStatistics> perType = new EnumMap<>(Comment.CommentType.class);

	public GitCommentStatistics negative() {
		var stat = new GitCommentStatistics();
		stat.setTotal(total.negative());
		perType.forEach((key, value) -> stat.getPerType().put(key, value.negative()));
		return stat;
	}

	public static GitCommentStatistics combine(Collection<GitCommentStatistics> list) {
		var combined = new GitCommentStatistics();
		combined.setTotal(DebtStatistics.combine(list.stream().map(GitCommentStatistics::getTotal).collect(Collectors.toList())));
		list.stream()
				.flatMap(item -> item.getPerType().keySet().stream())
				.forEach(key -> combined.getPerType()
						.put(key, DebtStatistics.combine(
								list.stream()
										.filter(item -> item.getPerType().containsKey(key))
										.map(item -> item.getPerType().get(key))
										.collect(Collectors.toList())
						))
				);
		return combined;
	}

	@Data
	public static class Delta {
		private Long commitId;
		private Long snapshotId;
		private Long parentId;

		private GitCommentStatistics added = new GitCommentStatistics();
		private GitCommentStatistics removed = new GitCommentStatistics();
	}
}
