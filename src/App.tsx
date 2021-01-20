import React from 'react';
import logo from './logo.svg';
import './App.css';


function Searchbox() {
  const [criteria, setCriteria] = React.useState("");
  return <input type="text" value={criteria} onChange={e => setCriteria(e.currentTarget.value)} />;
}

const mock_survey = [
  {
    question: "this is the question",
    choices: [
      "one", "two", "three", "four", "none of them"
    ],
    correct: "two"
  }
]

type SurveyProps = {
  question: string;
  choices: string[];
};
interface SurveyState {
  //! \todo reload the survey and set the already choosen answer
};

class Survey extends React.Component<SurveyProps, SurveyState> {
  constructor(props: SurveyProps) {
    super(props);
  }

  render() {
    return (
      <h1>{this.props.question}</h1>
    )
  }
}

// function component == stateless
const HelloVariante1 = (props: { who: string }) => (
  <p>Hello, {props.who}</p>
);

const HelloVariante2: React.FunctionComponent<{ who: string; }> = (props) => {
  return <p>Hello, {props.who}</p>
};

interface HelloProps {
  who: string;
}
function HelloVariante3(props: HelloProps) {
  return <p>Hello, {props.who}</p>
}





const Count: React.FunctionComponent<{ count: number; }> = (props) => {
  return <h1>{props.count}</h1>;
};

// class component == state
interface Props { }

interface State {
  count: number;
};

class Counter extends React.Component<Props, State> {
  state: State = {
    count: 0
  };

  increment = () => {
    this.setState({
      count: (this.state.count + 1)
    });
  };

  decrement = () => {
    this.setState({
      count: (this.state.count - 1)
    });
  };

  render() {
    return (
      <div>
        <Count count={this.state.count} />
        <button onClick={this.increment}>Increment</button>
        <button onClick={this.decrement}>Decrement</button>
      </div>
    );
  }
}

const Slider = (): JSX.Element => {
  const [sliderValue, setSliderValue] = React.useState<number>(0);
  return (
    <input
      type="range"
      min={0}
      max={100}
      value={sliderValue}
      onChange={(
        ev: React.ChangeEvent<HTMLInputElement>,
      ): void => {
        setSliderValue(parseInt(ev.target.value, 10),);
      }}
    />
  );
};

function App() {
  return (
    <div className="App">
      <HelloVariante1 who="World 2221" />
      <HelloVariante2 who="World 2" />
      <HelloVariante3 who="World 3" />
      <Searchbox />
      <Counter />
      <br />
      <Slider />
      <Survey question="this is the question" choices={["one", "two", "three"]} />
    </div>
  );
}

export default App;
