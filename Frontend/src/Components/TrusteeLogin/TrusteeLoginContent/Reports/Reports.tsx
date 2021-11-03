import { useState } from "react";
import DisplayReport from "./DisplayReport/DisplayReport";

enum ReportDisplay {
  SelectQueries,
  ShowReport,
}

export default function Reports(props: { password: string; login: string }) {
  const [activeTab, setActiveTab] = useState(ReportDisplay.ShowReport);

  const toggleView = () => {
    if (activeTab === ReportDisplay.SelectQueries)
      setActiveTab(ReportDisplay.ShowReport);
    else setActiveTab(ReportDisplay.SelectQueries);
  };

  if (activeTab === ReportDisplay.SelectQueries)
    return <div>Select Queries and generate report </div>;
  return <DisplayReport back={toggleView} />;
}
