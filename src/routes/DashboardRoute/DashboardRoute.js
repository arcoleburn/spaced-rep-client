import config from '../../config';

import React, { Component } from 'react';
import TokenService from '../../services/token-service';
import DataContext from '../../contexts/DataContext';
import UserContext from '../../contexts/UserContext';
import { Wrapper } from '../../StyledComponents';

class DashboardRoute extends Component {
  static contextType = UserContext;

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language`, {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
    }).then((res) =>
      !res.ok
        ? res.json().then((e) => Promise.reject(e))
        : res.json().then((data) => {
            this.context.setLanguage(data.language.name);
            this.context.setWords(data.words);
            this.context.setTotalScore(data.language.total_score);
          })
    );
  }
  renderWords() {
    return this.context.words.map((word, i) => (
      <li>
        <h4>{word.original}</h4>{' '}
        <span>correct answer count: {word.correct_count}</span>
        <span> incorrect answer count: {word.incorrect_count} </span>
      </li>
    ));
  }
  render() {
    return (
      <Wrapper>
        {this.context.words === null ? (
          <p> no words found</p>
        ) : (
          <>
            <h2> {this.context.language}</h2>
            <a href="/learn">Start practicing</a>
            <h3>Words to practice</h3>
            <ul>{this.renderWords()}</ul>
            <p>Total correct answers: {this.context.total_score}</p>
          </>
        )}
      </Wrapper>
    );
  }
}

export default DashboardRoute;
