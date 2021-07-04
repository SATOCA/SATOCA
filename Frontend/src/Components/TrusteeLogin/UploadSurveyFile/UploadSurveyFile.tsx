import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import SurveyApi from "../../../Services/SurveyAPI";
type UploadSurveyFileProps = {
  login: string;
  password: string;
};

export default function UploadSurveyFile(props: UploadSurveyFileProps) {
  const [listItems, setListItems] = useState(<div> </div>);
  const [file, setFile] = useState<File | undefined>(undefined);

  const surveyApi = SurveyApi.getInstance();

  const updateFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event === null || event.target === null || event.target.files === null)
      return;

    setFile(event.target.files[0]);
  };

  const upload = async () => {
    if (file !== undefined)
      await surveyApi
        .uploadSurveyFile(file, props.login, props.password)
        .then((response) => {
          console.log(response);
          setListItems(
            <ol>
              {response.links.map((link) => {
                return (
                  <li key={link}>{process.env.REACT_APP_SERVER_HOST + link}</li>
                );
              })}
            </ol>
          );
          console.log(listItems);
        })
        .catch();
  };

  return (
    <Form>
      <FormGroup>
        <Label for="fileUpload">Survey File (.xslx)</Label>
        <Input
          type="file"
          id="fileUpload"
          name="surveyFile"
          label="Upload a survey file!"
          onChange={updateFileChanged}
        />
      </FormGroup>
      <Button disabled={file === undefined} onClick={upload}>
        Submit
      </Button>
      {listItems}
    </Form>
  );
}
