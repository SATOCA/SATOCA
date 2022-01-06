import UploadSurveyFile from "./UploadSurveyFile/UploadSurveyFile";
import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import classnames from "classnames";
import Reports from "./Reports/Reports";

export default function TrusteeLoginContent(props: {
  login: string;
  password: string;
}) {
  const [activeTab, setActiveTab] = useState("1");

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "1" })}
            onClick={() => {
              toggle("1");
            }}
          >
            Upload new Survey
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === "2" })}
            onClick={() => {
              toggle("2");
            }}
          >
            Existing Surveys
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <UploadSurveyFile login={props.login} password={props.password} />
        </TabPane>
        <TabPane tabId="2">
          <Reports login={props.login} password={props.password} />
        </TabPane>
      </TabContent>
    </div>
  );
}
