import {FC} from "react";
import {Page} from "../../../components/atoms/layout/Page";
import {PageHeader} from "../../../components/molecules/header/PageHeader";
import {NavBarContent} from "../../../components/molecules/navigation/NavBarContent";
import {
  JiraProjectNavigation,
  JiraProjectNavigationItems
} from "../../../components/organisms/jiraproject/JiraProjectNavigation";

interface JiraProjectLoadingTemplateProps {}

export const JiraProjectLoadingTemplate: FC<JiraProjectLoadingTemplateProps> = () => {
  return (
    <Page>
      <JiraProjectNavigation />
      <NavBarContent id={JiraProjectNavigationItems.DASHBOARD}>
        <PageHeader title="Jira Project Dashboard" />
      </NavBarContent>

      <NavBarContent id={JiraProjectNavigationItems.ISSUES}>
        <PageHeader title="Issues" />
      </NavBarContent>
    </Page>
  );
};
