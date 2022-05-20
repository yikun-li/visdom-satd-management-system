package nl.rug.mvittersum.bproj.backend.mappers;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring", uses = {UtilMappers.class}, injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface JiraIssueStatusUpdateMapper {

}
