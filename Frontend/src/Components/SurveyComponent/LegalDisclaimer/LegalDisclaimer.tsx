import React, {useEffect, useState} from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";

interface LegalDisclaimerProps {
    surveyId: string,
    participantId: string
}

const LegalDisclaimer = (props: LegalDisclaimerProps) => {
    const [text, setText] = useState("TODO: load from backend");
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
//        surveyApi.getLegalDisclaimer(props.surveyId)
//          .then(async (response) => { setText((await response).legalDisclaimer); })
    }, [props.surveyId]);

    const handleSubmit = async (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        event.preventDefault();
        //! \todo  await axios.post()
        //! \todo: reload
    };

    return (
        <div className="centered glass-card-content-min-height">
            <Form onSubmit={handleSubmit}>
                <FormGroup row>
                    {text}
                </FormGroup>
                <FormGroup row>
                    <Input id="exampleCheck" name="check" type="checkbox" onChange={e => (console.log(e))} />
                    <Label check for="exampleCheck">Accept legal disclaimer</Label>
                </FormGroup>
                <FormGroup row>
                    <Button type="submit">Next</Button>
                </FormGroup>
            </Form>
        </div>
    );
}

export default LegalDisclaimer;
