import {AnalyserRunningState} from "../types/analyser";
import {DebtType} from "../types/debt";
import {CommentType} from "../types/git";

export const CommentTypeDescr: Record<CommentType, {name: string}> = {
  [CommentType.BLOCK]: {name: "Block"},
  [CommentType.INLINE]: {name: "Inline"},
  [CommentType.DOC_BLOCK]: {name: "Documentation block"},
  [CommentType.INLINE_MULTI]: {name: "Multiline inline"}
};

export const DebtTypeDescr: Record<DebtType, {name: string}> = {
  [DebtType.NOT_DEBT]: {name: "Not debt"},
  [DebtType.DEBT]: {name: "Debt"},
  [DebtType.TEST]: {name: "Test debt"},
  [DebtType.NOT_ANALYSED]: {name: "Not analysed"},
  [DebtType.CODE_DESIGN]: {name: "Code design debt"},
  [DebtType.REQUIREMENT]: {name: "Requirement debt"},
  [DebtType.DOCUMENTATION]: {name: "Documentation debt"}
};

export const AnalyserRunningStateDescr: Record<AnalyserRunningState, {name: string}> = {
  [AnalyserRunningState.RUNNING]: {name: "Running"},
  [AnalyserRunningState.IDLING]: {name: "Idling"}
};
