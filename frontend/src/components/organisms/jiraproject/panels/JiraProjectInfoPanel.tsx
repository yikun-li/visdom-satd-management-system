import {formatDistance} from "date-fns";
import {FC} from "react";
import {RestJiraProject} from "../../../../types/jira";
import {Stack} from "../../../atoms/layout/Stack";
import {Panel} from "../../../atoms/panel/Panel";
import {Heading} from "../../../atoms/typography/Heading";
import {Paragraph} from "../../../atoms/typography/Paragraph";

interface JiraProjectInfoPanelProps {
  jiraProject: RestJiraProject;
}

export const JiraProjectInfoPanel: FC<JiraProjectInfoPanelProps> = ({jiraProject}) => {
  return (
    <Panel>
      <Stack spacing="l">
        <>
          <Heading type="h5">Name</Heading>
          <Paragraph>{jiraProject.name}</Paragraph>
        </>
        <>
          <Heading type="h5">Jira project</Heading>
          <Paragraph>
            {jiraProject.projectName} ({jiraProject.key})
          </Paragraph>
        </>
        <>
          <Heading type="h5">Last scanned</Heading>
          <Paragraph>
            {jiraProject.lastScanned
              ? formatDistance(new Date(jiraProject.lastScanned), new Date(), {addSuffix: true})
              : "never"}
          </Paragraph>
        </>
      </Stack>
    </Panel>
  );
};
