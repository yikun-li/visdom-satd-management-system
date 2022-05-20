import {FC, useState} from "react";
import {IpcMessage} from "../../../backend/services/ipc";
import {JobService} from "../../../backend/services/job";
import {useIpc} from "../../../hooks/useIpc";
import {useModal} from "../../../hooks/useModal";
import {useService} from "../../../hooks/useService";
import {Modal} from "../../atoms/modal/Modal";
import {JobsModal} from "../../molecules/jobs/JobsModal";
import {JobsRunningIndicator} from "../../molecules/jobs/JobsRunningIndicator";

export const JobsInformation: FC = () => {
  const jobService = useService(JobService);
  const [modalSession, openModal] = useModal();
  const [activeAmount, setActiveAmount] = useState(jobService.totalActive);

  useIpc(IpcMessage.UPDATE_JOB, () => setActiveAmount(jobService.totalActive));

  return (
    <>
      <JobsRunningIndicator activeAmount={activeAmount} onClick={() => openModal({})} />
      <Modal session={modalSession} content={JobsModal} />
    </>
  );
};
