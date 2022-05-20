package nl.rug.mvittersum.bproj.backend.utils;

import lombok.experimental.UtilityClass;

import java.time.Duration;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.function.Function;
import java.util.function.Predicate;

@UtilityClass
public class StatisticsDataUtil {

	public static <T> Predicate<T> filterBefore(Date date, Function<T, Date> getDate) {
		return (item) -> !getDate.apply(item).before(date);
	}

	public static <T> Predicate<T> filterAfter(Date date, Function<T, Date> getDate) {
		return (item) -> !getDate.apply(item).after(date);
	}

	public static <T> List<T> orderedSkipInterval(Collection<T> items, Function<T, Date> getDate, Duration skipInterval) {
		var list = new ArrayList<>(items);
		var left = new Date(getDate.apply(items.iterator().next()).getTime() - 1).toInstant();

		for (var item : items) {
			var itemDate = getDate.apply(item);

			if (itemDate.toInstant().isAfter(left)) {
				left = left.plus(skipInterval);
			} else {
				list.remove(item);
			}
		}

		return list;
	}
}
