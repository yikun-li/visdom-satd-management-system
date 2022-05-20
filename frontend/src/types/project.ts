import {RestGitRepository} from "./git";
import {RestJiraProject} from "./jira";

export enum RestProjectSourceType {
  GIT = "GIT",
  JIRA = "JIRA"
}

export interface RestProjectGitSource {
  type: RestProjectSourceType.GIT;
  git: RestGitRepository;
  jira: null;
}

export interface RestProjectJiraSource {
  type: RestProjectSourceType.JIRA;
  git: null;
  jira: RestJiraProject;
}

export type RestProjectSource = RestProjectGitSource | RestProjectJiraSource;

export interface RestProject {
  id: number;
  name: string;
  sources: RestProjectSource[] | null;
  jira: number | null;
  git: number | null;
  created: string;
  lastUpdated: string;
}
