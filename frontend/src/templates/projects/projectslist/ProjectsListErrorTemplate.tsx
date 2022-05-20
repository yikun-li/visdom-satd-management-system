import {FC} from "react";
import {ErrorTemplate} from "../../ErrorTemplate";

interface ProjectsListErrorTemplateProps {
  error: Error;
}

export const ProjectsListErrorTemplate: FC<ProjectsListErrorTemplateProps> = ({error}) => {
  return <ErrorTemplate title={error.message} />;
};
