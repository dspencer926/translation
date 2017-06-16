const Translate = require('@google-cloud/translate');
const Speech = require('@google-cloud/speech');

const translationController = {};

const rec = require('node-record-lpcm16')//"borrowed" from https://www.npmjs.com/package/node-record-lpcm16#options 
  // var request = require('request')
const projectId = 'translation-app-168502';
const translateClient = Translate({
    projectId: projectId
  });

  let appId = 'NMDPTRIAL_dspencer926_gmail_com20170528030155';
  let appKey = '8491cf9930c4e9470946769de7d0d55551e262248a00b4ba09e6597051bf62d550326f80f658c8009e3e9d850e72db5f543d84df3d3899471ef2b76fb11a4402';

translationController.recognize = (req, res) => {

//__________________NUANCE CODE_____________________________________________________________________________________


  const rec = require('node-record-lpcm16')//"borrowed" from https://www.npmjs.com/package/node-record-lpcm16#options 
  const request = require('request')
  let langFrom = req.body.langFrom;
  console.log(langFrom);


  exports.parseResult = (err, resp, body) => {
    res.json(body);  // figure out status/error
  }
  
 if (req.body.status === 'go') {
  rec.start({
    sampleRate: 16000,
  }).pipe(request.post({
    'url'     : `https://dictation.nuancemobility.net/NMDPAsrCmdServlet/dictation?appId=${appId}&appKey=${appKey}`,   //add multi-language input functionality
    'headers' : {
      'Transfer-Encoding': 'chunked',
      'Content-Type': 'audio/x-wav;codec=pcm;bit=16;rate=16000',
      'Accept': 'text/plain',
      'Accept-Language': langFrom,
    }
  }, exports.parseResult))
}
 
  if (req.body.status === 'stop') {
    rec.stop()
  }
}

//___________________________________________________________________________________________________________

// _______________________ TRYING GOOGLE STREAMING RECOG AGAIN ______________________________________________________

// // Instantiates a client
// const speech = Speech();

// // The encoding of the audio file, e.g. 'LINEAR16'
// const encoding = 'LINEAR16';

// // The sample rate of the audio file in hertz, e.g. 16000
// const sampleRateHertz = 44100;

// // The BCP-47 language code to use, e.g. 'en-US'
// const languageCode = 'en-US';

// const request = {
//   config: {
//     encoding: encoding,
//     sampleRateHertz: sampleRateHertz,
//     languageCode: languageCode
//   },
//   interimResults: false // If you want interim results, set this to true
// };

// if (req.body.status === 'go') {
//   console.log('in record func')
// // Create a recognize stream
// const recognizeStream = speech.createRecognizeStream(request)
//   .on('error', console.error)
//   .on('data', (data) => console.log(data));

// // Start recording and send the microphone input to the Speech API
// rec
//   .start({
//     sampleRateHertz: sampleRateHertz,
//     threshold: 0,
//     // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
//     verbose: false,
//     recordProgram: 'rec', // Try also "arecord" or "sox"
//     silence: '10.0'
//   })
//   .on('error', console.error)
//   .pipe(recognizeStream);

// console.log('Listening, press Ctrl+C to stop.');
// }

//  if (req.body.status === 'stop') {
//   rec.stop()
//  }

// }
//___________________________________________________________________________________________________________________

// _______________________WIT CODE RECOG W/ AUTO STS TRANSLATION __________________________________________________

//   var rec = require('node-record-lpcm16')//"borrowed" from https://www.npmjs.com/package/node-record-lpcm16#options 
//   var request = require('request')
//   var text = '';
//   let langFrom = req.body.langFrom;
//   let langTo = req.body.langTo
//   var options = {
//     from: langFrom,
//     to: langTo,
//   };
  
//   var witToken = process.env.WIT_TOKEN;

//   exports.parseResult = (err, resp, body) => {
//     let jsonObj = JSON.parse(body)
//     text = jsonObj._text;
//     console.log('original recog', text)
//     startTranslation(text, options);
//   }
  
//  if (req.body.status === 'go') {
//   rec.start().pipe(request.post({
//     'url'     : `https://api.wit.ai/speech?client=chromium&lang=es&output=json`,   //add multi-language input functionality
//     'headers' : {
//       'Accept'        : 'application/vnd.wit.20160202+json',
//       'Authorization' : 'Bearer ' + witToken,
//       'Content-Type'  : 'audio/wav'
//     }
//   }, exports.parseResult))
//  }
 
//  if (req.body.status === 'stop') {
//   rec.stop()
//  }

//   function startTranslation(text, options) {
//   console.log('options', options)
//     translateClient.translate(text, options)
//       .then((results) => {
//         const translation = results[0];
//         console.log('translation 1', translation);
//         text = translation;
//         options = {
//           from: options.to,
//           to: options.from,
//         };
//         translateClient.translate(text, options)
//         .then((results) => {
//           const STStranslation = results[0];
//           console.log('translation 2', STStranslation);
//           res.json({message: 'worked', data: {translation: STStranslation, source: options.from, target: options.to}})
//       })
//       .catch((err) => {
//         console.error('ERROR:', err);
//       });
//     });
//   }
// }
//___________________________________________________________________________________________________________________

// _______________________WIT CODE JUST RECOG; NO AUTO STS TRANSLATION _____________________________________

//   var rec = require('node-record-lpcm16')//"borrowed" from https://www.npmjs.com/package/node-record-lpcm16#options 
//   var request = require('request')
  
//   var witToken = process.env.WIT_TOKEN;

//   exports.parseResult = (err, resp, body) => {
//     res.json(body);
//   }
  
//  if (req.body.status === 'go') {
//   rec.start().pipe(request.post({
//     'url'     : `https://api.wit.ai/speech?client=chromium&lang=es&output=json`,   //add multi-language input functionality
//     'headers' : {
//       'Accept'        : 'application/vnd.wit.20160202+json',
//       'Authorization' : 'Bearer ' + witToken,
//       'Content-Type'  : 'audio/wav'
//     }
//   }, exports.parseResult))
//  }
 
//  if (req.body.status === 'stop') {
//   rec.stop()
//  }

// }

//__________________________________________________________________________________________________________________


//______________GOOGLE TRANSLATE_____________________________________________________________________________

translationController.translate = (req, res) => {
  let langFrom = '';
  switch (req.body.langFrom) {
    case 'eng-USA': 
      langFrom = 'en';
      break;
    case 'spa-XLA': 
      langFrom = 'es';
      break;
    case 'fra-FRA': 
      langFrom = 'fr';
      break;
    case 'por-BRA': 
      langFrom = 'pt';
      break;
    case 'ita-ITA': 
      langFrom = 'it';
      break;
    case 'rus-RUS': 
      langFrom = 'ru';
      break;
    case 'hin-IND': 
      langFrom = 'hi';
      break;
    case 'ara-XWW': 
      langFrom = 'ar';
      break;
    case 'cmn-CHN': 
      langFrom = 'zh-CN';
      break;
    case 'jpn-JPN': 
      langFrom = 'ja';
      break;
    case 'deu-DEU': 
      langFrom = 'de';
      break;
    case 'heb-ISR': 
      langFrom = 'iw';
      break;
    case 'jpn-JPN': 
      langFrom = 'fi';
      break;
    case 'tur-TUR': 
      langFrom = 'tr';
      break;
    case 'kor-KOR': 
      langFrom = 'ko';
      break;
  }
  let text = req.body.text;
  let translation = '';
  let options = {
    from: langFrom,
    to: req.body.langTo,
  };
  translateClient.translate(text, options)
    .then((results) => {
      translation = results[0];
      console.log(translation);
      text = translation;
      options = {
        from: options.to,
        to: options.from,
      };
      translateClient.translate(text, options)
      .then((results) => {
        let stsTranslation = results[0];
        console.log('translation', translation)
        console.log('sts translation', stsTranslation);
        res.json({message: 'worked', 
          data: {
            translation: translation, 
            stsTranslation: stsTranslation,
            source: options.from, 
            target: options.to}})
        })
    .catch((err) => {
      console.error('ERROR:', err);
    });
  });
}
//_________________________________________________________________________________________________________________

//______________________________________NUANCE TEXT TO SPEECH______________________________________________________

// translationController.speak = (req, res) => {

//   let phrase = 'hello world my name is david nice to meet you.  that is weird that when i make the message longer, it seems like the size of the response gets smaller? That does not make any sense to me.';

//   fetch (`https://tts.nuancemobility.net:443/NMDPTTSCmdServlet/tts?appId=${appId}&appKey=${appKey}&id=1123kjh42&ttsLang=en_US`, {
//       method: 'POST',
//       headers: {
//       'Content-Type': 'text/plain',
//       'Accept': 'audio/x-wav;codec=pcm;bit=16;rate=8000',
//       },
//       body: phrase,
//     })
//     .then((response) => {
//       console.log(response);
//       res.send(response);
//     })
// }





//_________________________________________________________________________________________________________________


module.exports = translationController;