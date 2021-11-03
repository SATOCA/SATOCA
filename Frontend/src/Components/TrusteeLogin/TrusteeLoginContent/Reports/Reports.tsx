import { useEffect, useState } from "react";
import DisplayReport from "./DisplayReport/DisplayReport";
import { Report } from "../../../../../../Backend/src/routers/dto/CreateReportResponseDto";
import SurveyApi from "../../../../Services/SurveyAPI";
import { AxiosError } from "axios";

enum ReportDisplay {
  SelectQueries,
  ShowReport,
}

export default function Reports(props: { password: string; login: string }) {
  const [activeTab, setActiveTab] = useState(ReportDisplay.ShowReport);
  const [reportData, setReportData] = useState<Report>({ histogramData: [] });
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const surveyApi = SurveyApi.getInstance();

  useEffect(() => {
    surveyApi
      .createReport(props.login, props.password)
      .then(async (response) => {
        console.log(response);
        setReportData(response.report);
        setHasError(false);
      })
      .catch((error: AxiosError) => {
        setHasError(true);
        setErrorMessage(error.message);
      });
  }, [props.login, props.password]);

  const toggleView = () => {
    if (activeTab === ReportDisplay.SelectQueries)
      setActiveTab(ReportDisplay.ShowReport);
    else setActiveTab(ReportDisplay.SelectQueries);
  };

  if (hasError) return <div>{errorMessage}</div>;

  if (activeTab === ReportDisplay.SelectQueries)
    return <div>Select Queries and generate report </div>;
  return <DisplayReport back={toggleView} report={reportData} />;
}
