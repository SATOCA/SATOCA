import "./Guide.css";
import survey from "./survey.jpeg";
import options from "./options.jpeg";
import login from "./login.jpeg";
import upload from "./upload.jpeg";
import links from "./links.jpeg";
import report from "./report.jpeg";
import existinglist from "./existing_surveys.jpeg";
import closedsurvey from "./close_survey.jpeg";
import { Container } from "reactstrap";


export default function Guide() {
  return (
    <>
      <Container>
          <h2>How to use the platform</h2>
            <h4>  Survey Roles:</h4>
            <ol>
                <li><h6>   Trustee:</h6></li>
                <ul>
                    <li>Receives Invitation-Credential for Survey.</li>
                    <li>Receives participation note for Invitation-Credential.</li>
                    <li>Inspects and release Survey.</li>
                    <li>Sets privacy budget for interactive queries.</li>
                    <li>Defines differential private summary.</li>
                    <li>Deletes an erroneously submitted unique survey.</li>
                </ul>

                <li><h6>    Diagnostician</h6></li>
                <ul>
                    <li>Creates a new Computerized Adaptive Testing.</li>
                    <li>Curates items for a Computerized Adaptive Testing.</li>
                    <li>Sets stopping rule for a Computerized Adaptive Testing.</li>
                    <li>Sets start rule for a Computerized Adaptive Testing.</li>
                    <li>Sets rule of adaption for a Computerized Adaptive Testing.</li>
                    <li>Freezes Computerized Adaptive Testing into survey.</li>
                    <li>Receives Differential Private Summary.</li>
                </ul>
                <li><h6>   Participant:</h6></li>
                <ul>
                    <li>Recives a survey link from Trustee</li>
                    <li>Asnwers ased questions</li>
                    <li>Receives general information about survey results</li>
                </ul>
            </ol>
            <h4>How to Create a Survey?</h4>
            <ol>
                <li><h6>Survey is uploaded from an Excel File. You can download it from <a href="/SurveyUpload.xlsx" download>HERE</a></h6>
                    <h6>Document has two Sheets:</h6>
                </li>
                    <ul>
                        <li>Survey, where You save your questions</li>
                        <li>Options, where Survey parameters are defined.</li>
                    </ul>
                    <img src={survey} alt={"survey"} width="700px" />
                <li><h6>Survey Columns explanation:</h6></li>
                    <ul>
                        <li>ID - question id: int</li>
                        <li>Question - question text: str</li>
                        <li>Solution - number of column with correct answer: int</li>
                        <li>Start Set - flag marking questions to begin
                            the Survey with: (X / None )
                        </li>
                        <li>Dificulty - question's difficulty parameter: float</li>
                        <li>Slope - question's slope/discrimination parameter: float</li>
                        <li>A1 - A5 - multiple choice answers: str</li>
                    </ul>
                    <img src={options} alt={"otpions"} width="700px" />
                <li><h6>Options Columns explanation:</h6></li>
                    <ul>
                        <li>Title - survey title: str</li>
                        <li>Number participants - number of generated links
                            to survey instances: int
                        </li>
                        <li>Item severity boundary - minimal information gain value: float</li>
                        <li>Privacy Budget - epsilon (ε) metric of privacy loss
                            at a differential change in data: float
                        </li>
                        <li>Legal Disclaimer - legal disclaimer text: str</li>
                    </ul>
                <li><h6>To upload the Survey File Trustee have to login in.</h6></li>
                    <img src={login} alt={"login"} width="700px" />
                <li><h6>Choose Survey File path.</h6></li>
                    <img src={upload} alt={"upload"} width="700px" />
                <li><h6>After uploading the file appropriately defined number
                        of links will be shown.
                    </h6>
                    <h6>Trustee should send those links randomly to Participants.</h6>
                </li>
                    <img src={links} alt={"links"} width="700px" />
                <li><h6>Uploaded surveys are shown in a list.</h6></li>
                    <img src={existinglist} alt={"existinglist"} width="700px" />
                <li><h6>To generate a report survey hast do be closed.</h6>
                    <h6>This will happen either when all participants
                        will answer their survey,
                    </h6>
                    <h6>or when Trusee will decide so and close
                        it with a 'close survey' button.
                    </h6>
                </li>
                    <img src={closedsurvey} alt={"closedsurvey"} width="700px" />
                <li><h6>For a closed survey Trustee can generate reports.</h6></li>
                    <img src={report} alt={"report"} width="700px" />
            </ol>
      </Container>
    </>
  );
}
