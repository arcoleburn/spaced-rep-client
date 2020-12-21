import React, { Component } from 'react';
import config from '../../config';
import UserContext from '../../contexts/UserContext';
import TokenService from '../../services/token-service';
import { LearningSection } from '../../StyledComponents';

class LearningRoute extends Component {
  static contextType = UserContext;

  state = {
    answer: null,

    translation: '',
    score: 0,
    correct: '',
    incorrect: '',
    total: 0,
    isClicked: false,
    nextWord: null,
    response: {},
    guess: ''
  };

  handleNext() {
    console.log('nxt ran')
    this.setState({
      isClicked: false,
      correct: this.state.response.wordCorrectCount,
      incorrect: this.state.response.wordIncorrectCount,
      translation: '',
      answer: null,
      nextWord: {
        nextWord: this.state.response.nextWord,
        totalScore: this.state.response.nextWord.totalScore,
        wordCorrectCount: this.state.response.wordCorrectCount,
        wordIncorrectCount:this.state.response.wordIncorrectCount
      }
    });
  }

  async componentDidMount() {
    console.log('did mount ran')
    try {
      const response = await fetch(
        `${config.API_ENDPOINT}/language/head`,
        {
          headers: {
            authorization: `bearer ${TokenService.getAuthToken()}`,
          },
        }
      );
      const json = await response.json();
      console.log('comp mount json', json)
      this.context.setNextWord(json)
      this.setState({nextWord: json})
      this.setState({
        correct: json.wordCorrectCount,

        incorrect: json.wordIncorrectCount,
        total: json.totalScore,
        isClicked: false,
        score: null,
      });
    } catch (e) {
      this.setState({ error: e });
    }
  }

  async submitForm(e) {
    e.preventDefault();
    console.log(e.target.guess.value);
    const guess = e.target.guess.value.toLowerCase().trim();
    e.target.guess.value = ''
    this.setState({guess: guess})
    this.context.setGuess(guess);

    try {
      const res = await fetch(
        `${config.API_ENDPOINT}/language/guess`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
            authorization: `bearer ${TokenService.getAuthToken()}`,
          },
          body: JSON.stringify({ guess: guess }),
        }
      );
      const json = await res.json();
      console.log('sub json', json);
      this.context.setResponse(json);
      this.setState({
        response: json,
        total: json.totalScore,
        isClicked: true,
        translation: json.answer,
      });
    } catch (e) {
      this.setState({ error: e });
    }
    // this.context.setTotalScore(this.context.response.totalScore);
    if (this.state.response.isCorrect) {
      this.setState({
        answer: 'correct',
        correct: this.state.correct + 1,
      });
    } else {
      this.setState({
        answer: 'incorrect',
        incorrect: this.state.incorrect + 1,
      });
    }
  }
  render() {
    return (
      <LearningSection>
        <form onSubmit={(e) => this.submitForm(e, this.context)}>
          {this.state.answer == null && <h2>Translate the word:</h2>}
          {this.state.answer === 'correct' && (
            <div className="DisplayFeedback">
              <h2>You were correct! :D</h2>
              <p>
                The correct translation for{' '}
                {this.state.nextWord.nextWord} was{' '}
                {this.state.translation} and you chose{' '}
                {this.state.guess}!
              </p>
            </div>
          )}
          {this.state.answer === 'incorrect' && (
            <div className="DisplayFeedback">
              <h2>Good try, but not quite right :(</h2>
              <p>
                The correct translation for{' '}
                <strong>{this.state.nextWord.nextWord}</strong> was{' '}
                <strong>{this.state.translation}</strong> and you chose{' '}
                <strong>{this.state.guess}!</strong>
              </p>
            </div>
          )}
          <span className='word'>
            {this.state.isClicked == false && this.state.nextWord
              ? this.state.nextWord.nextWord
              : null}
          </span>
          <div className="DisplayScore">
            {' '}
            <p>Your total score is: {this.state.total}</p>
          </div>
          {this.state.isClicked === false && <fieldset>
            <label htmlFor="learn-guess-input">
              What's the translation for this word?
            </label>
            <input
              name="guess"
              id="learn-guess-input"
              type="text"
              required
            ></input>
            {this.state.isClicked === false && (
              <button type="submit">Submit your answer</button>
            )}
          </fieldset>}

          <p>
            You have answered this word correctly {this.state.correct}{' '}
            times.
          </p>
          <p>
            You have answered this word incorrectly{' '}
            {this.state.incorrect} times.
          </p>
        </form>
        {this.state.answer !== null && (
          <button onClick={() => this.handleNext()}>
            Try another word!
          </button>
        )}
      </LearningSection>
    );
  }
}

export default LearningRoute;
