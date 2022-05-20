import {FC} from "react";
import {ErrorTemplate} from "../../ErrorTemplate";

interface ProjectErrorTemplateProps {
  error: Error;
}

export const ProjectErrorTemplate: FC<ProjectErrorTemplateProps> = ({error}) => {
  return <ErrorTemplate title={error.message} />;
};
