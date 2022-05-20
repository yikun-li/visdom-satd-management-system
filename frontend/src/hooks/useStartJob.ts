import {useCallback, useRef, useState} from "react";
import {RestRequestBuilder} from "../backend/remote/util/types";
import {IpcMessage} from "../backend/services/ipc";
import {JobService} from "../backend/services/job";
import {RequestService} from "../backend/services/request";
import {RestJob, RestJobState} from "../types/job";
import {useIpc} from "./useIpc";
import {useService} from "./useService";

interface UseStartJobOptions {
  onDone?(): void;
}

export function useStartJob<Vars extends any[]>(
  builder: RestRequestBuilder<Vars, any, RestJob>,
  getJob: null,
  options?: UseStartJobOptions
): [RestJob | null, (...vars: Vars) => Promise<void>];

export function useStartJob<Vars extends any[], Body>(
  builder: RestRequestBuilder<Vars, any, Body>,
  getJob: (body: Body) => RestJob,
  options?: UseStartJobOptions
): [RestJob | null, (...vars: Vars) => Promise<void>];

export function useStartJob<Vars extends any[], Body>(
  builder: RestRequestBuilder<Vars, any, Body>,
  getJob: ((body: Body) => RestJob) | null,
  {onDone = () => void 0}: UseStartJobOptions = {}
): [RestJob | null, (...vars: Vars) => Promise<void>] {
  const jobs = useService(JobService);
  const requester = useService(RequestService);
  const [job, setJob] = useState<RestJob | null>(null);
  const getJobRef = useRef(getJob);

  const call = useCallback(
    async (...vars: Vars) => {
      const response = await requester.executeAndThrow(await builder(...vars));
      const job = getJobRef.current === null ? (response.body as unknown as RestJob) : getJobRef.current(response.body);
      await jobs.addJob(job);
      setJob(job);
    },
    [builder, jobs, requester]
  );

  useIpc(IpcMessage.UPDATE_JOB, ({job: updated}: {job: RestJob}) => {
    if (updated.id === job?.id) {
      setJob(updated);
      if (updated.state === RestJobState.FINISHED) {
        onDone();
      }
    }
  });

  return [job, call];
}
