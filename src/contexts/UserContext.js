import React, { Component } from 'react';
import AuthApiService from '../services/auth-api-service';
import TokenService from '../services/token-service';
import IdleService from '../services/idle-service';

const UserContext = React.createContext({
  user: {},
  error: null,
  language: null,
  words: null,
  nextWord: null,
  response: null,
  guess: null,
  total_score: 0,
  setGuess: () => {},
  setResponse: () => {},
  setError: () => {},
  clearError: () => {},
  setUser: () => {},
  processLogin: () => {},
  processLogout: () => {},
  setLanguage: () => {},
  setWords: () => {},
  setNextWord: () => {},
  setTotalScore: () => {},
});

export default UserContext;

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    const state = {
      user: {},
      error: null,
      language: null,
      words: null,
      nextWord: null,
      total_score: 0,
      currWord: null,
      guess: null,
      response: null,
      feedback: null,
    };

    const jwtPayload = TokenService.parseAuthToken();

    if (jwtPayload)
      state.user = {
        id: jwtPayload.user_id,
        name: jwtPayload.name,
        username: jwtPayload.sub,
      };

    this.state = state;
    IdleService.setIdleCallback(this.logoutBecauseIdle);
  }

  componentDidMount() {
    if (TokenService.hasAuthToken()) {
      IdleService.regiserIdleTimerResets();
      TokenService.queueCallbackBeforeExpiry(() => {
        this.fetchRefreshToken();
      });
    }
  }

  componentWillUnmount() {
    IdleService.unRegisterIdleResets();
    TokenService.clearCallbackBeforeExpiry();
  }

  setError = (error) => {
    console.error(error);
    this.setState({ error });
  };

  clearError = () => {
    this.setState({ error: null });
  };

  setUser = (user) => {
    this.setState({ user: user });
  };
  setLanguage = lang => {
    this.setState({language: lang})
  };
  setWords = wrds => {
    this.setState({words: wrds})
  };
  setNextWord = word =>{
    this.setState({nextWord: word})
  };
  
  setResponse = (response) => {
    this.setState({
      response: response,
    });
  };

  setFeedback = (feedback) => {
    this.setState({
      feedback: feedback,
    });
  };

  setGuess = (guess) => {
    this.setState({
      guess: guess,
    });
  };

  setTotalScore = (score) => {
    console.log('set score ran with ', score)
    this.setState({
      total_score: score,
    });
  };

  processLogin = (authToken) => {
    TokenService.saveAuthToken(authToken);
    const jwtPayload = TokenService.parseAuthToken();
    this.setUser({
      id: jwtPayload.user_id,
      name: jwtPayload.name,
      username: jwtPayload.sub,
    });
    IdleService.regiserIdleTimerResets();
    TokenService.queueCallbackBeforeExpiry(() => {
      this.fetchRefreshToken();
    });
  };

  processLogout = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({});
  };

  logoutBecauseIdle = () => {
    TokenService.clearAuthToken();
    TokenService.clearCallbackBeforeExpiry();
    IdleService.unRegisterIdleResets();
    this.setUser({ idle: true });
  };

  fetchRefreshToken = () => {
    AuthApiService.refreshToken()
      .then((res) => {
        TokenService.saveAuthToken(res.authToken);
        TokenService.queueCallbackBeforeExpiry(() => {
          this.fetchRefreshToken();
        });
      })
      .catch((err) => {
        this.setError(err);
      });
  };

  render() {
    const value = {
      user: this.state.user,
      error: this.state.error,
      total_score: this.state.total_score,
      setError: this.setError,
      currWord: this.state.currWord,
      clearError: this.clearError,
      setUser: this.setUser,
      processLogin: this.processLogin,
      processLogout: this.processLogout,
      setLanguage: this.setLanguage,
      language: this.state.language,
      setWords: this.setWords,
      guess: this.state.guess,
      words: this.state.words,
      nextWord: this.state.nextWord,
      setNextWord: this.setNextWord,
      setTotalScore: this.setTotalScore,
      setCurrWord: this.setCurrWord,
      setGuess: this.setGuess,
      setResponse: this.setResponse,
      response: this.state.response,
      feedback: this.state.feedback,
      setFeedback: this.setFeedback,
    };
    return (
      <UserContext.Provider value={value}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
