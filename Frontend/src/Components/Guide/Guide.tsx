import "./Guide.css";
import survey from "./survey.jpeg";
import options from "./options.jpeg";
import login from "./login.jpeg";
import upload from "./upload.jpeg";
import links from "./links.jpeg";
import report from "./report.jpeg";
import { Container } from "reactstrap";

export default function Guide() {
  return (
    <>
      <br/>
      <Container>
          <h2>How to use the platform</h2>

            <h4>How to Create a Survey?</h4>
            <p>Survey is uploaded from an Excel File. You will find an example in /docs Folder under UploadSurvey.xlsx.<br/>
              Document has two Sheets:
                <li>Survey, where You save your questions</li>
                <li>Options, where Survey parameters are defined.</li></p><br/>
              <img src={survey} alt={"survey"}/>
              <br/><br/>
            <p> Survey Columns explanation:
              <ul>
              <li>ID - question id</li>
              <li>Question - question text</li>
              <li>Solution - number of column with correct answer</li>
              <li>Start Set - flag marking questions to begin the Survey with</li>
              <li>Dificulty - question's difficulty parameter</li>
              <li>Slope - question's slope/discrimination parameter</li>
              <li>A1 - A5 - multiple choice answers</li></ul>
            </p><br/>
            <img src={options} alt={"otpions"}/><br/>
          <p>Options Columns explanation:
              <ul>
              <li>Title - survey title</li>
              <li>Number participants - number of generated links to survey instances</li>
              <li>Item severity boundary - minimal information gain value</li>
              <li>Privacy Budget - epsilon (ε) metric of privacy loss at a differential change in data</li>
              <li>Legal Disclaimer - legal disclaimer text</li></ul>
          </p>
          <p><br/>
              To upload the Survey File Trustee have to login in.
          </p>
            <img src={login} alt={"login"}/>
          <p><br/>
              Choose Survey File path.
          </p>
            <img src={upload} alt={"upload"}/>
          <p><br/>
              After uploading the file appropriately defined (xlsx file) number of links will be shown.
          </p>
            <img src={links} alt={"links"}/>
          <p><br/>
              For a started Survey Trustee can generate reports.
          </p>
            <img src={report} alt={"report"}/>
      </Container>
    </>
  );
}
