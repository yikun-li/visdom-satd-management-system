export enum AnalyserRunningState {
  IDLING = "IDLING",
  RUNNING = "RUNNING"
}

export interface RestAnalyserStatus {
  workLeft: number;
  status: AnalyserRunningState;
}
