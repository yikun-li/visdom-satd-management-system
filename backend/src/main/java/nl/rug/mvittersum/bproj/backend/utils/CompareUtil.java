package nl.rug.mvittersum.bproj.backend.utils;

import lombok.experimental.UtilityClass;

import java.util.Comparator;
import java.util.Date;
import java.util.function.Function;

@UtilityClass
public class CompareUtil {
	public static <T> Comparator<T> compareDates(Function<T, Date> getDate) {
		return Comparator.comparingLong(value -> getDate.apply(value).getTime());
	}
}
