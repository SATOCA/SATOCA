import { useState } from "react";

enum ReportDisplay {
  SelectQueries,
  ShowReport,
}

export default function Reports(props: { password: string; login: string }) {
  const [activeTab, setActiveTab] = useState(ReportDisplay.SelectQueries);

  if (activeTab === ReportDisplay.SelectQueries)
    return <div>Select Queries and generate report </div>;
  else if (activeTab === ReportDisplay.ShowReport)
    return <div>Display Report </div>;
  else return <div>ups...</div>;
}
