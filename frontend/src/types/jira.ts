import {DebtType, RestDebtStatistics} from "./debt";

export interface RestJiraProject {
  id: number;
  name: string;
  projectName: string;
  key: string;
  lastScanned: string | null;
}

export interface RestJiraIssue {
  id: number;
  key: string;
  status: string;
  resolution: string;
  type: string;
  updateDate: string;
  creationDate: string;
  description: RestJiraClassifiable | null;
  summary: RestJiraClassifiable;
}

export interface RestJiraClassifiable {
  content: string;
  debtType: DebtType;
  debtProbability: number | null;
  keywords: Record<string, number> | null;
}

export interface RestJiraProjectStatistics {
  perIssueType: Record<string, RestDebtStatistics>;
  perStatus: Record<string, RestDebtStatistics>;
  inSummary: RestDebtStatistics;
  inDescription: RestDebtStatistics;
}
