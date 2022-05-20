package nl.rug.mvittersum.bproj.backend.data;

import lombok.Data;
import nl.rug.mvittersum.bproj.satd.DebtType;

import java.util.Collection;
import java.util.EnumMap;
import java.util.Map;

@Data
public class DebtStatistics {
	private int amount = 0;
	private int debt = 0;
	private Map<DebtType, Integer> perType = new EnumMap<>(DebtType.class);

	public static DebtStatistics combine(Collection<DebtStatistics> list) {
		var combined = new DebtStatistics();
		for (var item : list) {
			combined.setAmount(combined.getAmount() + item.getAmount());
			combined.setDebt(combined.getDebt() + item.getDebt());
			item.getPerType().forEach((key, value) -> combined.getPerType().put(key, combined.getPerType().computeIfAbsent(key, (k) -> 0) + value));
		}
		return combined;
	}

	public DebtStatistics negative() {
		var stat = new DebtStatistics();
		stat.setAmount(amount * -1);
		stat.setDebt(debt * -1);
		perType.forEach((key, value) -> stat.getPerType().put(key, value * -1));
		return stat;
	}
}
