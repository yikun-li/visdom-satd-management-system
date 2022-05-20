package nl.rug.mvittersum.bproj.backend.hibernate;

import org.hibernate.dialect.PostgreSQL10Dialect;

import java.sql.Types;

public class ExtendedPostgreSQL10Dialect extends PostgreSQL10Dialect {
	public ExtendedPostgreSQL10Dialect() {
		super();
		this.registerColumnType(Types.JAVA_OBJECT, "jsonb");
	}
}
