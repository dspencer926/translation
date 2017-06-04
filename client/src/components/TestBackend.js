import React, { Component } from 'react';

class TestBackend extends Component {

   componentDidMount() {
    fetch('/users/phrases', {
      credentials: 'same-origin'
    }) 
    .then((response) => {
      return response.json()
    })
    .then ((responseJson) => {
      console.log(responseJson)
    });
  }


  render() {
    return (
      <footer>
        <div id='footer-container'>
          <div id='footer-div'>
            <div id='footer-text-container'>
              <div>SpeakEasy</div>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}

export default TestBackend;
