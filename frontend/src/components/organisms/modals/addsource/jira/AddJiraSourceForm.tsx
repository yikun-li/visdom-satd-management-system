import {Form, useForm} from "formorama";
import {FC, useEffect, useMemo, useState} from "react";
import {getJiraProjects, postJiraProject} from "../../../../../backend/remote/requests";
import {RequestService} from "../../../../../backend/services/request";
import {useLazyRequestResource} from "../../../../../hooks/useLazyRequestResource";
import {useService} from "../../../../../hooks/useService";
import {RestJiraProject} from "../../../../../types/jira";
import {AddJiraSourceDetails} from "./AddJiraSourceDetails";
import {AddJiraSourceProjects} from "./AddJiraSourceProjects";

interface JiraSourceForm {
  name: string;
  url: string;
  auth: "no" | "userpass";
  username: string | null;
  password: string | null;
  key: string;
}

function validator(stage: 1 | 2): (values: JiraSourceForm) => any {
  if (stage === 1) {
    return (values) => {
      const errors: any = {};
      if (!values.name || values.name.length < 1) errors.name = "Please fill in a name";
      if (!values.url || values.url.length < 1) errors.url = "Please fill in an url";
      if (values.auth === "userpass") {
      }

      return errors;
    };
  } else {
    return () => ({});
  }
}

interface AddJiraSourceFormProps {
  projectId: number;

  onSuccess(jiraProject: RestJiraProject): void;
}

export const AddJiraSourceForm: FC<AddJiraSourceFormProps> = ({projectId, onSuccess}) => {
  const requester = useService(RequestService);
  const [projects, getProjects] = useLazyRequestResource(getJiraProjects, {loading: null});
  const [stage, setStage] = useState<1 | 2>(1);
  const validate = useMemo(() => validator(stage), [stage]);
  const form = useForm<JiraSourceForm>({validate});

  const handleSubmit = async (values: JiraSourceForm) => {
    if (stage === 1) {
      try {
        const res = await getProjects(values.url, values.username, values.password);
        if (res && !(res instanceof Error)) {
          setStage(2);
        }
      } catch (e) {
        console.log("Error", e);
      }
    } else {
      const response = await requester.executeAndThrow(postJiraProject({...values, projectId}));
      onSuccess(response.body);
    }
  };

  useEffect(() => {
    form.change("auth", "no");
  }, [form]);

  return (
    <Form form={form} onSubmit={handleSubmit}>
      {stage === 1 ? (
        <AddJiraSourceDetails />
      ) : (
        projects.loading === false && projects.success && <AddJiraSourceProjects projects={projects.body} />
      )}
    </Form>
  );
};
