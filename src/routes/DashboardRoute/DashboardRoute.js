import config from '../../config';

import React, { Component } from 'react';
import TokenService from '../../services/token-service';


class DashboardRoute extends Component {
  state = {
    language: '',
    total_score: 0,
    words: [],
  };

  componentDidMount() {
    fetch(`${config.API_ENDPOINT}/language`, {
      headers: {
        'content-type': 'application/json',
        authorization: `Bearer ${TokenService.getAuthToken()}`,
      },
    }).then((res) =>
      !res.ok
        ? res.json().then((e) => Promise.reject(e))
        : res
            .json()
            .then((data) =>
              this.setState({
                language: data.language.name,
                total_score: data.language.total_score,
                words: data.words,
              })
            )
    );
  }

  render() {
    let list = [];
    let words = this.state.words.forEach((word) => {
      console.log('word', word);
     
      list.push(<li><h4>{word.original}</h4> <span>correct answer count: {word.correct_count}, incorrect answer count: {word.incorrect_count} </span></li>);
    });
    console.log('words', list);
    return (
      <section>
        <h2> {this.state.language}</h2>
        <a href="/learn">Start practicing</a>
        <h3>Words to practice</h3>
        <ul>{list}</ul>
        <p>Total correct answers: {this.state.total_score}</p>
      </section>
    );
  }
}

export default DashboardRoute;
