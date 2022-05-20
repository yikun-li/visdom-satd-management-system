package nl.rug.mvittersum.bproj.backend.services.git;

import lombok.RequiredArgsConstructor;
import nl.rug.mvittersum.bproj.backend.entities.git.GitBranch;
import nl.rug.mvittersum.bproj.backend.entities.git.GitSnapshot;
import nl.rug.mvittersum.bproj.backend.repositories.jpa.GitSnapshotRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class GitSnapshotService {
	private final GitSnapshotRepository gitSnapshotRepository;
}
