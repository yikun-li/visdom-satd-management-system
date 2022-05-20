import {RestJob, RestJobState} from "../../types/job";
import {WebBackend} from "../backend";
import {getJobStatus} from "../remote/requests/getJobStatus";
import {InitializableService} from "../servicemanager";
import {IpcMessage, IpcService} from "./ipc";
import {RequestService} from "./request";

const LOCALSTORAGE_ACTIVE_JOBS_KEY = "SatdAnalyser:ActiveJobs";
const INTERVAL = 500;

export class JobService implements InitializableService {
  private activeJobs: Set<string> = new Set<string>();
  private jobStates: Map<string, RestJob> = new Map<string, RestJob>();
  private interval: ReturnType<typeof setInterval> | null = null;

  constructor(private backend: WebBackend) {
    if (!backend.ssr && typeof window !== "undefined") {
      (window as any).addJob = this.getJobState.bind(this);
    }
  }

  async initialize(): Promise<void> {
    if (!this.backend.ssr) {
      const jobs = window.localStorage.getItem(LOCALSTORAGE_ACTIVE_JOBS_KEY);

      if (jobs && jobs !== "") {
        for (const job of jobs.split(",")) {
          this.activeJobs.add(job);
          this.getJobState(job).catch((err) => console.error(`Failed getting job state of ${job}`, err));
        }
        console.log(`Loaded ${jobs.length} jobs`);
      }

      this.interval = setInterval(
        () => this.pingActiveJobs().catch((err) => console.error("Failed pinging jobs", err)),
        INTERVAL
      );
    }
  }

  async addJob(job?: RestJob | undefined | null): Promise<void> {
    if (!job) return;

    const update = job.state !== this.jobStates.get(job.id)?.state;

    this.jobStates.set(job.id, job);
    this.updateActiveJobs(job.id, job.state === RestJobState.RUNNING || job.state === RestJobState.READY);

    if (update) {
      this.backend.services.get(IpcService).emit(IpcMessage.UPDATE_JOB, {job});
    }

    if (job.state === RestJobState.CONTINUED && job.next && !this.jobStates.has(job.next)) {
      await this.getJobState(job.next);
    }
  }

  get jobs(): RestJob[] {
    return [...this.jobStates.values()].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  }

  get totalActive(): number {
    return this.activeJobs.size;
  }

  private async getJobState(jobId: string): Promise<void> {
    const response = await this.backend.services.get(RequestService).executeAndThrow(getJobStatus(jobId));
    await this.addJob(response.body);
  }

  private updateActiveJobs(jobId: string, active: boolean) {
    let updated = false;
    if (active && !this.activeJobs.has(jobId)) {
      this.activeJobs.add(jobId);
      updated = true;
    } else if (!active && this.activeJobs.has(jobId)) {
      this.activeJobs.delete(jobId);
      updated = true;
    }
    if (updated) {
      window.localStorage.setItem(LOCALSTORAGE_ACTIVE_JOBS_KEY, [...this.activeJobs.values()].join(","));
    }
  }

  private async pingActiveJobs(): Promise<void> {
    for (const jobId of this.activeJobs.values()) {
      this.getJobState(jobId).catch((err) => {
        console.log(`Failed pinging job ${jobId}`, err);
        this.updateActiveJobs(jobId, false);
      });
    }
  }
}
