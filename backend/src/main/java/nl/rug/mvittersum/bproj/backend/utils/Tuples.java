package nl.rug.mvittersum.bproj.backend.utils;

import lombok.Value;
import lombok.experimental.UtilityClass;

@UtilityClass
public class Tuples {
	@Value
	public static class Double<T1, T2> {
		T1 first;
		T2 second;
	}

	@Value
	public static class Triple<T1, T2, T3> {
		T1 first;
		T2 second;
		T3 third;
	}
}
