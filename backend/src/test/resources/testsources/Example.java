/**
 * <p>This class is an example</p>
 *
 * @deprecated
 */
class Example {
	// Don't use this variable
	public static final String CONSTANT = "Hello";

	public void sayHello() {
		/*
		This comment explains something
		that takes multiple lines
		 */
		System.out.println("Hello world");
	}

	// Hello
	// This is a multiline comment with just '//' characters
	// Tedsfa
	public void largeMethod() {
		String a = "// This should not be a comment!";

		for(int i = 0; i < 1000; i++) {
			// Find a better solution!
			a += "test";
		}
	}
}
