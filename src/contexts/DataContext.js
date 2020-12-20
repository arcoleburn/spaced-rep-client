import React, { Component } from 'react';

const DataContext = React.createContext({
  language: '',
  total_score: 0,
  words: [],
  setData: ()=>{},
  setLang: () => {},
  setScore: () => {},
  setWords: () => {},
});

export default DataContext;

export class DataProvider extends Component {
  constructor(props) {
    super(props)
    const state = {
      language: '',
      total_score: 0,
      words: [],
    };
  }

  setData = (data) => {
    this.setState({
      language: data.language,
      total_score: data.total_score,
      words: data.words,
    });
  };
  setLang = (lang) => {
    this.setState({ language: lang });
  };
  setScore = (score) => {
    this.setState({ total_score: score });
  };
  setWords = (wrds) => {
    this.setState({ words: wrds });
  };

  render() {
    const value = {
      language: this.state.language,
      total_score: this.state.total_score,
      words: this.state.words,
    };
    return (
      <DataContext.Provider value={value}>
        {this.props.children}
      </DataContext.Provider>
    );
  }
}
