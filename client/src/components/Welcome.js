import React, { Component } from 'react';

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }
  }



  render() {
    return (
      <div id="welcome-container">
        <div id='welcome-div'>
          <div id='title-div'>
            <h1>Welcome to SpeakEasy</h1>
          </div>
          <div id='sub-title-div'>
            <h2>Easy Translation for today's Jetsetter</h2>
          </div>
          <div id='login-signup-guest-div'>
            <div>Login</div>
            <div>Sign Up</div>
            <div>Continue as Guest</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Welcome;
