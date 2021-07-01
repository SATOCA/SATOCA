import React, { useState } from "react";
import { Button, Form, FormGroup, Input, Label } from "reactstrap";
import SurveyApi from "../../../Services/SurveyAPI";

type UploadSurveyFileProps = {
  login: string;
  password: string;
};

export default function UploadSurveyFile(props: UploadSurveyFileProps) {
  const [file, setFile] = useState<File | undefined>(undefined);

  const surveyApi = SurveyApi.getInstance();

  const updateFileChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event === null || event.target === null || event.target.files === null)
      return;

    setFile(event.target.files[0]);
  };

  const upload = () => {
    if (file !== undefined)
      surveyApi
        .uploadSurveyFile(file, props.login, props.password)
        .then((response) => console.log(response));
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
    </Form>
  );
}