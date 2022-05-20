package nl.rug.mvittersum.bproj.backend.dtos.enums;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;
import nl.rug.mvittersum.bproj.satd.DebtType;

import java.util.function.Function;

@RequiredArgsConstructor
public enum GitHeatMapMode {
	ALL_COMMENTS(
			type -> file -> file.getComments().size()
	),
	ALL_DEBT(
			type -> file -> (int) file.getComments().stream().filter(comment -> comment.getComment().getDebtType().isDebt()).count()
	),
	DEBT_TYPE(
			type -> file -> (int) file.getComments().stream().filter(comment -> comment.getComment().getDebtType().equals(type)).count()
	);

	private final Function<DebtType, Function<GitFile, Integer>> valueFn;

	public Function<GitFile, Integer> getValueFn(DebtType type) {
		return valueFn.apply(type);
	}
}
