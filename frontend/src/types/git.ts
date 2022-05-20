import {DebtType, RestDebtStatistics} from "./debt";
import {RestJob} from "./job";

export enum CommentType {
  INLINE = "INLINE",
  INLINE_MULTI = "INLINE_MULTI",
  BLOCK = "BLOCK",
  DOC_BLOCK = "DOC_BLOCK"
}

export interface RestGitRepository {
  id: number;
  name: string;
  url: string;
  stored: boolean | null;
  lastFetched: string | null;
  defaultBranch: string;
}

export interface RestGitBranch {
  id: number | null;
  name: string;
  totalCommits: number | null;
  totalSnapped: number | null;
}

export interface RestGitCommit {
  id: number;
  hash: string;
  date: string;
  shortMessage: string;
  fullMessage: string;
  snapped: boolean;
}

export interface RestGitSnapshot {
  id: number;
  commitIds: number[];
  statistics: RestGitCommentStatistics | null;
}

export interface RestGitCommentStatistics {
  total: RestDebtStatistics;
  perType: Record<CommentType, RestDebtStatistics>;
}

export interface RestGitCommitWithStatistics {
  commit: RestGitCommit;
  statistics: RestGitCommentStatistics;
}

export interface RestGitFile {
  id: number;
  path: string;
  filename: string;
  scannedForComments: boolean;
  content: null;
  comments: RestGitFileComment[] | null;
  statistics: RestGitCommentStatistics | null;
}

export interface RestGitFileComment {
  id: number;
  content: string;
  debtType: DebtType;
  debtProbability: number | null;
  type: CommentType;
  line: number;
  keywords: Record<string, number> | null;
}

export interface RestGitDirectory {
  name: string;
  path: string;
  statistics: RestGitCommentStatistics | null;
}

export interface RestGitFiles {
  path: string;
  directories: RestGitDirectory[];
  files: RestGitFile[];
}

export interface RestGetGitRepositoryResponse {
  repository: RestGitRepository;
  branch: RestGitBranch | null;
  latestCommit: RestGitCommit | null;
  latestSnapshot: RestGitSnapshot | null;
}

export interface RestStoreBranchResponse {
  branch: RestGitBranch;
  storeJob: RestJob;
}

export interface RestCreateGitRepositoryResponse {
  repository: RestGitRepository;
  cloneJob: RestJob | null;
}

export interface RestGitBranchStatisticsResponse {
  from: string;
  to: string;
  interval: number;
  branchName: string;
  data: RestGitCommitWithStatistics[];
}
