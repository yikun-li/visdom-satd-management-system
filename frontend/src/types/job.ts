export enum RestJobType {
  CLONE_REPOSITORY = "CLONE_REPOSITORY",
  CREATE_SNAPSHOT = "CREATE_SNAPSHOT",
  FIND_COMMENTS = "FIND_COMMENTS",
  PULL = "PULL"
}

export enum RestJobState {
  READY = "READY",
  RUNNING = "RUNNING",
  FINISHED = "FINISHED",
  ERRORED = "ERRORED",
  CONTINUED = "CONTINUED"
}

export interface RestJob {
  id: string;
  state: RestJobState;
  runningTime: number;
  next: string | null;
  type: RestJobType;
  start: string;
}
