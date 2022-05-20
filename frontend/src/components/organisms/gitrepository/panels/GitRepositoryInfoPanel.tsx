import {formatDistance} from "date-fns";
import {FC} from "react";
import {RestGitCommit, RestGitRepository} from "../../../../types/git";
import {Stack} from "../../../atoms/layout/Stack";
import {Panel} from "../../../atoms/panel/Panel";
import {Code} from "../../../atoms/typography/Code";
import {Heading} from "../../../atoms/typography/Heading";
import {Paragraph} from "../../../atoms/typography/Paragraph";

interface GitRepositoryInfoPanelProps {
  repository: RestGitRepository;
  latestCommit: RestGitCommit | null;
}

export const GitRepositoryInfoPanel: FC<GitRepositoryInfoPanelProps> = ({repository, latestCommit}) => {
  return (
    <Panel>
      <Stack spacing="l">
        <>
          <Heading type="h5">Git repository</Heading>
          <Paragraph>{repository.name}</Paragraph>
        </>
        <>
          <Heading type="h5">URL</Heading>
          <Paragraph>{repository.url}</Paragraph>
        </>
        <>
          <Heading type="h5">Last fetched</Heading>
          <Paragraph>
            {repository.lastFetched
              ? formatDistance(new Date(repository.lastFetched), new Date(), {addSuffix: true})
              : "never"}
          </Paragraph>
        </>
        {latestCommit && (
          <>
            <Heading type="h5">Latest commit</Heading>
            <Paragraph>
              <Code>{latestCommit.hash}</Code>
            </Paragraph>
            <Paragraph>{latestCommit.shortMessage}</Paragraph>
          </>
        )}
      </Stack>
    </Panel>
  );
};
