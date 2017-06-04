import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';

class Nav extends Component {
  render() {
    return (
      <nav>
        <div id="nav-container">
          <div id='nav-div'>
            <div id='nav-title-div'>
              SpeakEasy
            </div>
            <div id='nav-link-div'>
              <Link to='/' className='link'>Translation</Link>
              <Link to='/phraselist' className='link'>Phrase List</Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;
