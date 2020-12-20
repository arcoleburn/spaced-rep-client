import React, { Component } from 'react'
import LoginForm from '../../components/LoginForm/LoginForm'
import {Wrapper} from '../../StyledComponents'

class LoginRoute extends Component {
  static defaultProps = {
    location: {},
    history: {
      push: () => { },
    },
  }

  handleLoginSuccess = () => {
    const { location, history } = this.props
    const destination = (location.state || {}).from || '/'
    history.push(destination)
  }

  render() {
    return (
      <Wrapper>
        <h2>Login</h2>
        <LoginForm
          onLoginSuccess={this.handleLoginSuccess}
        />
      </Wrapper>
    );
  }
}

export default LoginRoute
