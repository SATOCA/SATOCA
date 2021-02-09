import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import { getSurveyFromMock } from "./Services/SurveyDataService";

function setupSurvey() {
  const survey = getSurveyFromMock();
  //! \todo implement logic. for now it is a random shuffle
  survey.items.sort(() => Math.random() - 0.5);
  return survey.items;
}

//! \todo should have no items data -> items: {}
const intialState = { finished: false, items: setupSurvey() };
export type SurveyComponentState = Readonly<typeof intialState>;

export type SurveyComponentProps = {
  id: number;
};

export function SurveyComponent(props: SurveyComponentProps){

  const [items, setItems] = useState(setupSurvey());
  let history = useHistory();

  let nextQuestion = () => {
    if (items.length > 1) {
      //! \todo implement logic to select next item. for now the first item will be poped.
      setItems(items.slice(1, items.length));
    } else {
      history.push("/survey-end");
    }
  };

  return (
      <div>
        <h3 data-testid="header">Survey with id: {props.id}</h3>
        {/* //! \todo replace with component (arg: item[0]) */}
        <span data-testid="question" onClick={nextQuestion}>
          {items[0].question.text}
        </span>
      </div>
  );
}

// //! \todo setup state from props
// export class SurveyComponent extends React.Component<
//   SurveyComponentProps,
//   SurveyComponentState
// > {
//   readonly state: SurveyComponentState = intialState;
//
//   nextQuestion = () => {
//     if (this.state.items.length > 1) {
//       //! \todo implement logic to select next item. for now the first item will be poped.
//       this.setState({
//         items: this.state.items.slice(1, this.state.items.length),
//       });
//     } else {
//       let history = useHistory();
//       history.push("survey-end");
//       this.setState({ finished: true });
//     }
//   };
//
//   render() {
//     return (
//       <div>
//         <h3 data-testid="header">Survey with id: {this.props.id}</h3>
//         {/* //! \todo replace with component (arg: item[0]) */}
//         <span data-testid="question" onClick={this.nextQuestion}>
//           {this.state.items[0].question.text}
//         </span>
//         <p data-testid="finished">
//           finished: {this.state.finished ? "yes" : "no"}
//         </p>
//       </div>
//     );
//   }
// }
