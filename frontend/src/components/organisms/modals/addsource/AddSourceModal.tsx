import {FC, useState} from "react";
import {CloseModalFn} from "../../../../hooks/useModal";
import {RestProject} from "../../../../types/project";
import {Stack} from "../../../atoms/layout/Stack";
import {StackItem} from "../../../atoms/layout/StackItem";
import {Tab} from "../../../atoms/tabs/Tab";
import {Tabs} from "../../../atoms/tabs/Tabs";
import {Heading} from "../../../atoms/typography/Heading";
import {AddGitSourceForm} from "./AddGitSourceForm";
import {AddJiraSourceForm} from "./jira/AddJiraSourceForm";

export interface AddSourceModalArgs {
  project: RestProject;
}

interface AddSourceModalContentProps extends AddSourceModalArgs {
  onClose: CloseModalFn;
}

export const AddSourceModal: FC<AddSourceModalContentProps> = ({project, onClose}) => {
  const [selectedTab, setSelectedTab] = useState("git");

  return (
    <Stack spacing="l">
      <Stack spacing="l" horizontal center>
        <StackItem flex>
          <Heading>Add source</Heading>
        </StackItem>
        <Tabs current={selectedTab} onChange={setSelectedTab}>
          <Tab id="git">Git Repository</Tab>
          <Tab id="jira">Jira Project</Tab>
        </Tabs>
      </Stack>
      {selectedTab === "git" ? (
        <AddGitSourceForm projectId={project.id} onSuccess={() => onClose()} />
      ) : (
        <AddJiraSourceForm projectId={project.id} onSuccess={() => onClose()} />
      )}
    </Stack>
  );
};
