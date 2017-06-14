import React, { Component } from 'react';
import './App.css';
import Welcome from './components/Welcome';
import Nav from './components/Nav';
import Signup from './components/Signup';
import Login from './components/Login';
import Footer from './components/Footer';
import Translation from './components/Translation';
// import Recorder from './components/Recorder';
// import TestBackend from './components/TestBackend';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      audioClip: null,
      username: null,
      isLogged: false,
    }
    this.recordState = this.recordState.bind(this);
  }

  recordState(clip) {
    this.setState({audioClip: clip});
  }


  render() {
    return (
      <Router>
      <div className="App">
          <Translation recordState={this.recordState} />
          <Route path='/login' component={Login} />
          <Route path='/register' component={Signup} />
          {/*
          <Route exact path='/' component={Translation} />
          <Recorder audioClip={this.state.audioClip}/>
          <Nav />
          <main> 
          </main>
          <Footer />*/}
        </div>
      </Router>
    );
  }
}

export default App;
