import {FC, useContext} from "react";
import {createPortal} from "react-dom";
import {JobService} from "../../backend/services/job";
import {useService} from "../../hooks/useService";
import {JobsContext, JobsContextValue} from "./JobsContext";
import {JobsManager} from "./organisms/JobsManager";

export interface JobsProviderProps {
  root: HTMLElement | null;
}

export const JobsProvider: FC<JobsProviderProps> = ({children, root}) => {
  const value: JobsContextValue = {};

  const serv = useService(JobService);

  return (
    <JobsContext.Provider value={value}>
      {root && createPortal(<JobsManager />, root)}
      {children}
    </JobsContext.Provider>
  );
};
