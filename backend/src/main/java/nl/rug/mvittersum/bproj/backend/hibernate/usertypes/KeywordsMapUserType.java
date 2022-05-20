package nl.rug.mvittersum.bproj.backend.hibernate.usertypes;

import com.fasterxml.jackson.databind.ObjectMapper;
import nl.rug.mvittersum.bproj.backend.data.KeywordsMap;
import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.usertype.UserType;

import java.io.Serializable;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Types;

public class KeywordsMapUserType implements UserType {
	private final int[] sqlTypesSupported = new int[]{Types.JAVA_OBJECT};
	private final ObjectMapper mapper = new ObjectMapper();

	@Override
	public int[] sqlTypes() {
		return sqlTypesSupported;
	}

	@Override
	public Class<KeywordsMap> returnedClass() {
		return KeywordsMap.class;
	}

	@Override
	public boolean equals(Object x, Object y) throws HibernateException {
		return x != null && x.equals(y);
	}

	@Override
	public int hashCode(Object x) throws HibernateException {
		return x == null ? 0 : x.hashCode();
	}

	@Override
	public Object nullSafeGet(ResultSet rs, String[] names, SharedSessionContractImplementor session, Object owner) throws HibernateException, SQLException {
		final String cellContent = rs.getString(names[0]);
		if (cellContent == null) {
			return null;
		}

		try {
			return new KeywordsMap(cellContent, mapper);
		} catch (Exception ex) {
			throw new RuntimeException("Failed to convert String to Invoice: " + ex.getMessage(), ex);
		}
	}

	@Override
	public void nullSafeSet(PreparedStatement st, Object value, int index, SharedSessionContractImplementor session) throws HibernateException, SQLException {
		if (!(value instanceof KeywordsMap)) {
			st.setNull(index, Types.OTHER);
			return;
		}
		try {
			var jsonString = ((KeywordsMap) value).toJsonString(mapper);
			st.setObject(index, jsonString, Types.OTHER);
		} catch (final Exception ex) {
			throw new RuntimeException("Failed to convert Invoice to String: " + ex.getMessage(), ex);
		}
	}

	@Override
	public Object deepCopy(Object value) throws HibernateException {
		return value instanceof KeywordsMap ? new KeywordsMap((KeywordsMap) value) : null;
	}

	@Override
	public boolean isMutable() {
		return false;
	}

	@Override
	public Serializable disassemble(Object value) throws HibernateException {
		return value instanceof KeywordsMap ? (KeywordsMap) value : null;
	}

	@Override
	public Object assemble(Serializable cached, Object owner) throws HibernateException {
		return deepCopy(cached);
	}

	@Override
	public Object replace(Object original, Object target, Object owner) throws HibernateException {
		return original;
	}
}
