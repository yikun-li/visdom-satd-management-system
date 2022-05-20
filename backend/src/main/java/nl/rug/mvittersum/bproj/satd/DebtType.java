package nl.rug.mvittersum.bproj.satd;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum DebtType {
	NOT_ANALYSED(false),
	NOT_DEBT(false),
	CODE_DESIGN(true),
	DOCUMENTATION(true),
	TEST(true),
	REQUIREMENT(true),
	DEBT(true);

	/**
	 * Whether the type is considered debt.
	 */
	private final boolean debt;
}
