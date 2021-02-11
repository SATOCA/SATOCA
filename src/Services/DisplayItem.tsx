import React from "react";
import {Item} from "../DataModel/Item";
import {Answer} from "../DataModel/Answer";
import {Button, ButtonGroup} from "reactstrap";

export type displayItemProps = {
    item: Item;
}

export type displayItemState = {
    selectedOption: string
}

export class DisplayItem extends React.Component<displayItemProps, displayItemState> {
    constructor(props: displayItemProps) {
        super(props);
        this.state = {
            selectedOption: ""
        };

        //this.handleOptionChange = this.handleOptionChange.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }


    chooseButtonType = () => {
        if (this.props.item.isMultiResponse) {
            return ({DisplayCheckboxButtons});
        } else {
            return ({DisplayRadioButtons});
        }
    }


    // todo: manage the state of which button(s) are active/select

    /*
    handleOptionChange = (changeEvent: any) => {
        this.setState({
            selectedOption: changeEvent.target.value
        });
    };
*/
// todo: replace any type
    handleFormSubmit = (formSubmitEvent: any) => {
        formSubmitEvent.preventDefault();

        console.log("You have submitted: ", this.state.selectedOption);

    };

    render() {
        return (
            <form onSubmit={this.handleFormSubmit}>
                <div className="question">
                    <h5>{this.props.item.question.text}</h5>
                </div>
                {this.chooseButtonType()}
                <div className="submitButton">
                    <button className="btn btn-primary mt-2" type="submit">
                        Submit
                    </button>
                </div>
            </form>
        );
    }
}

 const DisplayCheckboxButtons = (answerOptions: Answer[]) => {
    const [cSelected, setCSelected] = React.useState<Array<number>>([]);

    const onCheckboxBtnClick = (selected: number) => {
        const index = cSelected.indexOf(selected);
        if (index < 0) {
            cSelected.push(selected);
        } else {
            cSelected.splice(index, 1);
        }
        setCSelected([...cSelected]);
    }

    return (
        <div className="Answer-Options">
            <h5>Checkbox Buttons</h5>
            <ButtonGroup>
                {answerOptions.map((answer) =>
                    <Button color="primary" onClick={() => onCheckboxBtnClick(answer.id)} active={cSelected.includes(answer.id)}>
                        {answer.text}
                    </Button>)}
            </ButtonGroup>
            <p>Selected: {JSON.stringify(cSelected)}</p>
        </div>
    );
}

const DisplayRadioButtons = (answerOptions: Answer[]) => {
    const [rSelected, setRSelected] = React.useState<number | null>(null);

    return (
        <div className="Answer-Options">
            <h5>Radio Buttons</h5>
            <ButtonGroup vertical>
                {answerOptions.map((answer) =>
                    <Button color="primary" onClick={() => setRSelected(answer.id)} active={rSelected === answer.id}>
                        {answer.text}
                    </Button>)}
            </ButtonGroup>
            <p>Selected: {rSelected}</p>
        </div>
    );
}

