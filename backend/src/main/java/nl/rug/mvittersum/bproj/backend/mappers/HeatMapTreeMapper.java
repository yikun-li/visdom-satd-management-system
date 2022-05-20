package nl.rug.mvittersum.bproj.backend.mappers;

import nl.rug.mvittersum.bproj.backend.dtos.HeatMapTreeDto;
import nl.rug.mvittersum.bproj.backend.entities.git.GitFile;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Mapper(componentModel = "spring")
public interface HeatMapTreeMapper {
	@Mappings({
			@Mapping(target = "name", source = "file.filename"),
			@Mapping(target = "value", expression = "java(getValue.apply(file))"),
			@Mapping(target = "children", ignore = true)
	})
	HeatMapTreeDto.Node toFileNode(GitFile file, Function<GitFile, Integer> getValue);

	@Mappings({
			@Mapping(target = "name", source = "dirName"),
			@Mapping(target = "children", source = "children"),
			@Mapping(target = "value", ignore = true)
	})
	HeatMapTreeDto.Node toDirNode(String dirName, List<HeatMapTreeDto.Node> children);

	default HeatMapTreeDto toDto(Map<String, Collection<GitFile>> fileMap, Function<GitFile, Integer> getValue) {
		return new HeatMapTreeDto(toDirNode("/", toDtoRec(fileMap, getDirSet(fileMap), getValue, "/")));
	}

	private Stream<HeatMapTreeDto.Node> dirNodeStream(Map<String, Collection<GitFile>> fileMap, Set<String> dirs, Function<GitFile, Integer> getValue, String dir) {
		var childDirs = dirs.stream()
				.filter(dirPath -> dirPath.startsWith(dir) && dirPath.substring(dir.length()).split("/").length == 1)
				.collect(Collectors.toList());
		childDirs.forEach(dirs::remove);
		return childDirs.stream()
				.map(dirPath -> toDirNode(dirPath.substring(dir.length()), toDtoRec(fileMap, dirs, getValue, dirPath)));
	}

	private List<HeatMapTreeDto.Node> toDtoRec(Map<String, Collection<GitFile>> fileMap, Set<String> dirs, Function<GitFile, Integer> getValue, String dir) {
		return Stream.concat(
				fileMap.containsKey(dir) ? fileMap.get(dir).stream().map(file -> toFileNode(file, getValue)) : Stream.empty(),
				dirNodeStream(fileMap, dirs, getValue, dir)
		).collect(Collectors.toList());
	}

	private Set<String> getDirSet(Map<String, Collection<GitFile>> fileMap) {
		var dirs = new HashSet<String>();
		fileMap.keySet().forEach(dir -> {
			var splitPath = dir.split("/");
			if (splitPath.length > 2) {
				var full = new StringBuilder("/");
				for (int i = 1; i < splitPath.length; i++) {
					full.append(splitPath[i]).append("/");
					dirs.add(full.toString());
				}
			}
		});
		return dirs;
	}
}
