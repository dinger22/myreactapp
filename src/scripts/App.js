import React, { useState } from "react";
import "../css/App.css";

const StarsDisplay = props => (
  <>
    {utils.range(1, props.count).map(starId => (
      <div key={starId} className="star" />
    ))}
  </>
);

const NumberButton = props => (
  <button
    className="number"
    style={{ backgroundColor: colors[props.status] }}
    key={props.number}
    onClick={() => props.onClick(props.number, props.status)}
  >
    {props.number}
  </button>
);

const PlayAgain = props => (
  <div className="game-done">
    <button onClick={props.onClick}>Play Again</button>
  </div>
);

const App = () => {
  const [availableNums, setAvailableNums] = useState(utils.range(1, 9));
  const [candidateNums, setCandidateNums] = useState([]);
  const [stars, setStars] = useState(utils.random(1, 9));

  const candidateAreWrong = utils.sum(candidateNums) > stars;
  const gameIsDone = availableNums.length === 0;
  const numberStatus = number => {
    if (!availableNums.includes(number)) {
      return "used";
    }
    if (candidateNums.includes(number)) {
      return candidateAreWrong ? "wrong" : "candidate";
    }
    return "available";
  };

  const onClickNumber = (number, currentStatus) => {
    if (currentStatus == "used") return;

    const newCandidateNums =
      currentStatus == "available"
        ? candidateNums.concat(number)
        : candidateNums.filter(cn => cn !== number);
    if (utils.sum(newCandidateNums) != stars) {
      setCandidateNums(newCandidateNums);
    } else {
      const newAvailableNums = availableNums.filter(
        n => !newCandidateNums.includes(n)
      );
      setStars(utils.randomSumIn(newAvailableNums, 9));
      setAvailableNums(newAvailableNums);
      setCandidateNums([]);
    }
  };

  const resetGame = () => {
    setStars(utils.random(1, 9));
    setAvailableNums(utils.range(1, 9));
    setCandidateNums([]);
  };

  return (
    <div className="game">
      <div className="help">
        Pick 1 or more numbers that sum to the number of stars
      </div>
      <div className="body">
        <div className="left">
          {gameIsDone ? (
            <PlayAgain onClick={resetGame} />
          ) : (
            <StarsDisplay count={stars} />
          )}
        </div>
        <div className="right">
          {utils.range(1, 9).map(num => (
            <NumberButton
              key={num}
              status={numberStatus(num)}
              number={num}
              onClick={onClickNumber}
            ></NumberButton>
          ))}
        </div>
      </div>
      <div className="timer">Time Remaining: 10</div>
    </div>
  );
};

//Color
const colors = {
  available: "lightgray",
  used: "lightgreen",
  wrong: "lightcoral",
  candidate: "deepskyblue"
};

// Math utils
const utils = {
  // Sum an array
  sum: arr => arr.reduce((acc, curr) => acc + curr, 0),

  // create an array of numbers between min and max (edges included)
  range: (min, max) => Array.from({ length: max - min + 1 }, (_, i) => min + i),

  // pick a random number between min and max (edges included)
  random: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),

  // Given an array of numbers and a max...
  // Pick a random sum (< max) from the set of all available sums in arr
  randomSumIn: (arr, max) => {
    const sets = [[]];
    const sums = [];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0, len = sets.length; j < len; j++) {
        const candidateSet = sets[j].concat(arr[i]);
        const candidateSum = utils.sum(candidateSet);
        if (candidateSum <= max) {
          sets.push(candidateSet);
          sums.push(candidateSum);
        }
      }
    }
    return sums[utils.random(0, sums.length - 1)];
  }
};

export default App;
