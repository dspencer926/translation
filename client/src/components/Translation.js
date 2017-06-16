import React, { Component } from 'react';
import responsiveVoice from '../responsiveVoice.js';
const socket = require('socket.io-client')();

class Translation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      langFrom: 'eng_USA',                                          //  source language code (from drop-down)
      langTo: 'es',                                                 //  target language code (from drop-down)
      speakLang: '',                                                //  language-code for TTS to speak
      audioClip: null,                                              //  TTS audio clip 
      inputText: '',                                                //  input text to be translated
      recogResult: '',                                              //  result of speech recog
      stsTranslation: '',                                           //  STS translation
      translatedResponse: '',                                       //  response from server    
      result: '',                                                   //  translated text in target language
      isRecording: false,                                           //  true/false is recording voice
      recClass: 'off',                                              //  class for record button animation
      convoMode: false,                                             //  conversation mode on/off
      convoStyle: {backgroundColor: '#FFFFEA', color: 'black'},     //  conversation mode button style
      textStyle: null,                                              //  for animation of text
      resultStyle: null,                                            //  ''
    }
    this.handleLangFromChange = this.handleLangFromChange.bind(this);
    this.handlePhraseSubmit = this.handlePhraseSubmit.bind(this);
    this.handleLangToChange = this.handleLangToChange.bind(this);
    this.recognizeAudio = this.recognizeAudio.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.translation = this.translation.bind(this);
    this.convoToggle = this.convoToggle.bind(this);
    this.recogRoute = this.recogRoute.bind(this);
    this.stopRec = this.stopRec.bind(this);
    this.clear = this.clear.bind(this);
    this.speak = this.speak.bind(this);
    socket.on('translatedResponse', (response) => {
      console.log(response);
      this.setState({
        inputText: '',
        translatedResponse: response,
      }, () => {
        this.speak()
      })
    });
  }

componentDidMount() {
  let langFrom = document.querySelector('#langFrom')[0].value;
  let langTo = document.querySelector('#langTo')[0].value;
  this.setState({
    langFrom: langFrom,
    langTo: langTo,
  });
  console.log(langFrom, langTo);
}

componentDidUpdate() {
  console.log('updating');
  console.log(this.state);

}

//sets state with input text
handleInput(e) {
  this.setState({inputText: e.target.value});
}

//sets state with translation result text
handleResult(e) {
  this.setState({result: e.target.value});
}

// state change for source language change
handleLangFromChange(e) {      
  this.setState({langFrom: e.target.value});
}

// state change for target language change
handleLangToChange(e) {
  this.setState({langTo: e.target.value});
}

// decides what to do when record button is clicked
recogRoute() {
  this.setState((prevState) => {return ({isRecording: !prevState.isRecording})}, 
    () => {
      if (this.state.isRecording === true) {
        this.setState({recClass: 'rec'});
        this.recognizeAudio();
      }
      else {
        this.setState({recClass: 'off'});
        this.stopRec();
      }
  });
}

// sends recorded audio to backend for recognition [then creates choice div if necessary] <-- make its own function?
recognizeAudio() {

  this.setState({textStyle: null});
  fetch('/translation/recognize', {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'go',
      langFrom: this.state.langFrom,
      langTo: this.state.langTo,
    })
  })
  .then((res) => {
    return res.json()
  })
  .then((json) => {
    console.log(json);
    let resultArr = json.split('\n');
    console.log(resultArr);
    if (resultArr.length > 1) {this.choiceDiv(resultArr)}
  })
}
  
choiceDiv(arr) {
  arr.pop();
  console.log(arr);
  let translationBox = document.querySelector('#input-div');
  let choiceBox = document.createElement('div');
  let choiceList = document.createElement('ul');
  let choices = arr.forEach((val) => {
    let newChoice = document.createElement('li');
    let newButton = document.createElement('button')
    newButton.addEventListener('click', 
      (e) => {
        this.setState((prevState) => {
          return {
            inputText: prevState.inputText += e.target.innerHTML,
            textStyle: 'text-animate',
          }
        },
        () => {
          choiceBox.remove()
          this.translation();
        })
      })
    newButton.innerHTML = val;
    newChoice.appendChild(newButton);
    choiceList.appendChild(newChoice);
  })
  choiceBox.appendChild(choiceList);
  choiceBox.classList.add('on-top');
  translationBox.appendChild(choiceBox);
}

//________ANIMATION FOR TEXT APPEARANCE_____________________________________________________________________
    // let phrase = json.data.translation.charAt(0).toUpperCase() + json.data.translation.slice(1)
    // console.log(phrase);
//___________________________________________________________________________________________________________



// trying to do the Nuance TTS fetch
//________________________________________________________________________________________________________________
  // fetch('http://localhost:3001/translation/speak', {
  //   credentials: 'same-origin',
  //   method: 'GET'})
  //   .then((response) => {
  //     return response;
  //   })
  //   .then((blob) => {
  //     let ctx = new AudioContext;
  //     let body = blob.body;
  //     let reader = body.getReader();
  //     reader.read().then((result) => {
  //     console.log(result);
  //     }) 
//____________________________________________________________________________________________________________________


//stops recording when recording button is clicked
stopRec() {
  console.log('stop');
  console.log(this.state.langTo, this.state.langFrom)
  fetch('/translation/recognize', {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      status: 'stop',
      langFrom: this.state.langFrom,
    })
  })
}

sendMsg(e) {
  e.preventDefault();
  console.log(socket.id);
  socket.emit('testing', this.state.result);

}

// sends input text to backend to be translated and sets state with translated resul [then sends info to TTS] <-- own func?
translation(e) {
  this.setState({resultStyle: null});
  fetch('/translation/translate', {
    credentials: 'same-origin',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: this.state.inputText,
      langFrom: this.state.langFrom,
      langTo: this.state.langTo,
    })
  })
  .then((res) => {
    return res.json()
  })
  .then((json) => {
    console.log(json);
    this.setState({
        inputText: json.data.stsTranslation,
        result: json.data.translation,
        resultStyle: 'text-animate',
    });
  })
}


//runs TTS module
  speak() {
    console.log('in speak function');
    let speakLang;
    switch (this.state.langFrom) {
      case 'spa-XLA': 
        speakLang = 'Spanish Latin American Female';
        break;
      case 'fra-FRA': 
        speakLang = 'French Female';
        break;
      case 'por-BRA': 
        speakLang = 'Brazilian Portuguese Female';
        break;
      case 'rus-RUS': 
        speakLang = 'Russian Female';
        break;
      case 'hin-IND': 
        speakLang = 'Hindi Female';
        break;
      case 'ita-ITA': 
        speakLang = 'Italian Female';
        break;
      case 'ara-XWW': 
        speakLang = 'Arabic Male';
        break;
      case 'cmn-CHN': 
        speakLang = 'Chinese Female';
        break;
      case 'jpn-JPN': 
        speakLang = 'Japanese Female';
        break;
      case 'deu-DEU': 
        speakLang = 'Deutsch Female';
        break;
      case 'eng-USA': 
        speakLang = 'US English Female';
        break;
    }
    let response = this.state.translatedResponse
    this.setState({speakLang: speakLang})
    console.log(this.state.translatedResponse, speakLang);
    responsiveVoice.speak(response, speakLang);
  }

//submits info to save phrase [delete?]
  handlePhraseSubmit() {
    let lang = document.querySelector('#langFrom')[0].value;
    fetch('/api/phrases', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: "same-origin",
          body: JSON.stringify({
                phrase: this.state.text,
                language: lang,
          }),
    })
    .then((res) => {
          return res.json()
    })
    .then((json) => {
          console.log(json);
    })
}

// toggles conversation mode on/off
  convoToggle() {
    this.setState({convoMode: !this.state.convoMode},
    () => {
      if (this.state.convoMode === true) {
        this.setState({convoStyle: {backgroundColor: 'black', color: 'white'}})
      } else {this.setState({convoStyle: {backgroundColor: '#FFFFEA', color: 'black'}})}
    });
  }

//clears both input/result divs
  clear() {
    this.setState({
      inputText: '',
      result: ''
    });
  }

  render() {
    return (
      <div id='translation-container'>
        <div id='translation-div'>
          <div id='input-div'>
            <form id='translation-form' onSubmit={(e) => this.translation(e)}>
              <textarea id='input-box' name='text' rows='3' value={this.state.inputText} className={this.state.textStyle} onChange={(e) => this.handleInput(e)}/>
                <button id='send-btn' onClick={(e) => {this.sendMsg(e)}}>send!</button>
                <div id='to-from-div'>
                  <div id='from-div'>
                    <select name='langFrom' defaultValue='eng-USA' id='langFrom' onChange={(e) => {this.handleLangFromChange(e)}}> 
                      <option value='eng-USA'>English</option>
                      <option value='spa-XLA'>Spanish</option>
                      <option value='fra-FRA'>French</option>
                      <option value='por-BRA'>Portuguese</option>
                      <option value='ita-ITA'>Italian</option>
                      <option value='rus-RUS'>Russian</option>
                      <option value='ara-XWW'>Arabic</option>
                      <option value='cmn-CHN'>Chinese</option>
                      <option value='jpn-JPN'>Japanese</option>
                      <option value='deu-DEU'>German</option>
                      <option value='heb-ISR'>Hebrew</option>
                      <option value='fin-FIN'>Finnish</option>
                      <option value='hin-IND'>Hindi</option>
                      <option value='kor-KOR'>Korean</option>
                      <option value='tur-TUR'>Turkish</option>
                    </select>
                  </div>
                  <div id='triangle-div'>
                    <div id='triangle-topleft'></div>
                    <div id='triangle-bottomright'></div>
                  </div>
                  <div id='to-div'>
                    <select name='langTo' id='langTo' defaultValue='es' onChange={(e) => {this.handleLangToChange(e)}}> 
                      <option value='en'>English</option>
                      <option value='es'>Spanish</option>
                      <option value='fr'>French</option>
                      <option value='pt'>Portuguese</option>
                      <option value='it'>Italian</option>
                      <option value='ru'>Russian</option>
                      <option value='ar'>Arabic</option>
                      <option value='zh-CN'>Chinese</option>
                      <option value='ja'>Japanese</option>
                      <option value='de'>German</option>
                      <option value='iw'>Hebrew</option>
                      <option value='fi'>Finnish</option>
                      <option value='hi'>Hindi</option>
                      <option value='ko'>Korean</option>
                      <option value='tr'>Turkish</option>
                    </select>
                  </div>
                  </div>
                {/*<input id='submit-btn' type='submit'/>*/}
              <textarea id='result-box' name='result' rows='3' value={this.state.translatedResponse} className={this.state.resultStyle} onChange={(e) => this.handleResult(e)}></textarea>
            </form>
          </div>
          <div id='two-button-div'>
            <button id='save-btn'>Log</button>
            <button id='convo-btn' style={this.state.convoStyle} onClick={this.convoToggle}><i className="fa fa-comments-o" aria-hidden="true"></i></button>
            <button id='clear-btn' onClick={this.clear}>Clear</button>
          </div>
        </div>
        <div id='recognize-button-container' className={this.state.recClass}>
          <button id='start-recog' onClick={this.recogRoute}><i className={`${this.state.recClass} fa fa-microphone fa-3x`} aria-hidden="true"></i></button>
          {/*<button id='stop-recog' onMouseup={this.stopRec}>Stop Recognition</button>*/}
        </div>
      </div>
    );
  }
}

export default Translation;
