import React, { Component } from 'react';

class Signup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
    }
  }

signUp(e) {
  e.preventDefault();
  fetch('http://localhost:3001/auth/register', {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: e.target.username.value,
      password: e.target.password.value,
    })
  })
  .then((res) => {
    return res.json()
  })
  .then((json) => {
    console.log(json);
  })
}

  render() {
    return (
      <div className="signup" onSubmit={(e) => this.signUp(e)}>
        <form>
          <input type='text' name='username' placeholder='username'/>
          <input type='text' name='password' placeholder='password'/>
          <input type='submit' />
        </form>
      </div>
    );
  }
}

export default Signup;
