import React, { Component } from 'react';

navigator.getUserMedia = navigator.getUserMedia ||
                         navigator.webkitGetUserMedia ||
                         navigator.mozGetUserMedia;

class Recorder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mediaWorks: false,
      audioClip: null,
    }
    this.audioProcess = this.audioProcess.bind(this);
  }

  componentDidMount() {
    this.audioProcess();
  }

  audioProcess() {
    const record = document.querySelector('#record');
    const stop = document.querySelector('#stop');
    const soundClips = document.querySelector('#sound-clips');
    if (navigator.getUserMedia) {
      var AudioContext = window.AudioContext || window.webkitAudioContext;
      this.setState({mediaWorks: true});
      console.log('getUserMedia supported.');
      // Success callback
        var audioCtx = new AudioContext();   
        stop.onclick = () => {
          let clipContainer = document.createElement('article');
          let clipLabel = document.createElement('p');
          let audio = document.createElement('audio');
          let deleteButton = document.createElement('button');
                  
          clipContainer.classList.add('clip');
          audio.setAttribute('controls', '');
          deleteButton.innerHTML = "Delete";

          clipContainer.appendChild(audio);
          clipContainer.appendChild(clipLabel);
          clipContainer.appendChild(deleteButton);
          soundClips.appendChild(clipContainer);
          let audioSource = this.props.audio;
          console.log(this.props.audio);
          audio.src = this.props.audio;
        }
    }
  }

  render() {
    return (
      <div id="recorder-div">
        <button id='record'>Record</button>
        <button id='stop'>Stop</button>
        <button id='playback'>Play</button>
        <div id='sound-clips'></div>
      </div>

    );
  }
}

export default Recorder;