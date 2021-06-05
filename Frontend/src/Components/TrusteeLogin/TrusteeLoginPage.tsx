import React from "react";
import {Button, Form, FormGroup, Input, Label} from "reactstrap";

export default function TrusteeLogin() {
    const [login, setLogin] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [validLogin, setValidLogin] = React.useState(true);
    const [validPassword, setValidPassword] = React.useState(true);
    const handleSubmit = (event: { currentTarget: any; preventDefault: () => void; stopPropagation: () => void; }) => {
        event.preventDefault();
        console.log(login,password);
        if (login.length === 0) {
            return;
        }
        if (password.length === 0) {
            return;
        }
    };
    return (
        <div className="centered front-page-alignment">
            <Form onSubmit={handleSubmit}>
                <FormGroup>
                    <Label for="exampleEmail">Login</Label>
                    <Input type="text" value={login} onChange={e => setLogin(e.target.value)}  />
                </FormGroup>
                <FormGroup>
                    <Label for="examplePassword">Password</Label>
                    <Input type="text" value={password} onChange={e => setPassword(e.target.value)}  />
                </FormGroup>
                <Button>Submit</Button>
            </Form>
        </div>
    );
}