import {FC, useState} from "react";
import {IpcMessage} from "../../../backend/services/ipc";
import {JobService} from "../../../backend/services/job";
import {useIpc} from "../../../hooks/useIpc";
import {useService} from "../../../hooks/useService";
import {RestJob} from "../../../types/job";

export const JobsManager: FC = () => {
  const jobService = useService(JobService);
  const [jobs, setJobs] = useState<RestJob[]>(() => jobService.jobs);

  useIpc(IpcMessage.UPDATE_JOB, () => setJobs(jobService.jobs));

  return null;
  return <div className={""} />;
};
