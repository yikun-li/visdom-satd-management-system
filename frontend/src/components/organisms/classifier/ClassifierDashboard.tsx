import {FC, useEffect} from "react";
import {Col, Row} from "react-grid-system";
import {GetAnalyserResponse} from "../../../backend/remote/requests/getAnalyser";
import {postAnalyser, PostAnalyserBody} from "../../../backend/remote/requests/postAnalyser";
import {RequestService} from "../../../backend/services/request";
import {useLastResponse} from "../../../hooks/useLastResponse";
import {useServerResponse} from "../../../hooks/useServerResponse";
import {useService} from "../../../hooks/useService";
import {RestServerResponse} from "../../../types/response";
import {ClassifierPanel} from "./ClassifierPanel";

interface ClassifierDashboardProps {
  analyserResponse: RestServerResponse<GetAnalyserResponse>;
}

export const ClassifierDashboard: FC<ClassifierDashboardProps> = ({analyserResponse}) => {
  const requester = useService(RequestService);
  const response = useServerResponse(analyserResponse);
  const [loading, lastResponse] = useLastResponse(response);

  const handleStart = async (body: PostAnalyserBody) => {
    await requester.executeAndThrow(postAnalyser(body));
    await response.reload();
  };

  useEffect(() => {
    const timeout = setTimeout(() => response.reload(), 2000);

    return () => {
      clearInterval(timeout);
    };
  }, [response]);

  if (lastResponse.loading) {
    return <div />;
  }

  if (!lastResponse.success) {
    return <div />;
  }

  return (
    <Row>
      <Col xl={6} lg={12}>
        <ClassifierPanel
          status={lastResponse.body.comments.status}
          workLeft={lastResponse.body.comments.workLeft}
          title="Comment classifier"
          onStart={() => handleStart({comments: true, issues: false})}
          loading={loading}
        />
      </Col>
      <Col xl={6} lg={12}>
        <ClassifierPanel
          status={lastResponse.body.issues.status}
          workLeft={lastResponse.body.issues.workLeft}
          title="Issue classifier"
          onStart={() => handleStart({comments: false, issues: true})}
          loading={loading}
        />
      </Col>
    </Row>
  );
};
