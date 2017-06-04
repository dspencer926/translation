const Translate = require('@google-cloud/translate');

const translationController = {};

const rec = require('node-record-lpcm16')//"borrowed" from https://www.npmjs.com/package/node-record-lpcm16#options 
  // var request = require('request')
const projectId = 'translation-app-168502';

translationController.recognize = (req, res) => {
  
//__________________NUANCE CODE_____________________________________________

  // let appId = 'NMDPTRIAL_dspencer926_gmail_com20170528030155';
  // let appKey = '8491cf9930c4e9470946769de7d0d55551e262248a00b4ba09e6597051bf62d550326f80f658c8009e3e9d850e72db5f543d84df3d3899471ef2b76fb11a4402';
  
  
  
//  `https://dictation.nuancemobility.net/NMDPAsrCmdServlet/dictation?app
// Id=${appId}&appKey=${appKey}`


//   var rec = require('node-record-lpcm16')//"borrowed" from https://www.npmjs.com/package/node-record-lpcm16#options 
//   var request = require('request')


//   exports.parseResult = (err, resp, body) => {
//     res.json(body);
//   }
  
//  if (req.body.status === 'go') {
//   rec.start().pipe(request.post({
//     'url'     : `https://dictation.nuancemobility.net/NMDPAsrCmdServlet/dictation?appId=${appId}&appKey=${appKey}`,   //add multi-language input functionality
//     'headers' : {
//       'Transfer-Encoding': 'chunked',
//       'Content-Type': 'audio/x-wav;codec=pcm;bit=16;rate=16000 ',
//       'Accept': 'text/plain',
//       'Accept-Language': 'en-US',
//     }
//   }, exports.parseResult))
//  }
 
//  if (req.body.status === 'stop') {
//   rec.stop()
//  }

// }
//_____________________________________________________________________

// _______________________WIT CODE_____________________________________

  var rec = require('node-record-lpcm16')//"borrowed" from https://www.npmjs.com/package/node-record-lpcm16#options 
  var request = require('request')
  
  var witToken = process.env.WIT_TOKEN;

  exports.parseResult = (err, resp, body) => {
    res.json(body);
  }
  
 if (req.body.status === 'go') {
  rec.start().pipe(request.post({
    'url'     : `https://api.wit.ai/speech?client=chromium&lang=es&output=json`,   //add multi-language input functionality
    'headers' : {
      'Accept'        : 'application/vnd.wit.20160202+json',
      'Authorization' : 'Bearer ' + witToken,
      'Content-Type'  : 'audio/wav'
    }
  }, exports.parseResult))
 }
 
 if (req.body.status === 'stop') {
  rec.stop()
 }

}

//___________________________________________________________________

//_______________________DON'T REMEMBER WHAT THIS IS_________________

// translationController.recognize = (req, res) => {

// var record = require('node-record-lpcm16')
// var fs = require('fs')
// var request = require('request')
// var witToken = process.env.WIT_TOKEN;

// exports.parseResult = (err, resp, body) => {
//   console.log(body);
// }
 
// if (req.body.status === 'go') {
//   console.log('in go');
//   var file = fs.createWriteStream('test.wav', { encoding: 'binary' })
//   record.start().pipe(file);
// } else if (req.body.status === 'stop') {
//   console.log('in stop');
//   record.stop()
//   request.post({
//       'url'     : 'https://api.wit.ai/speech?client=chromium&lang=en-us&output=json',
//       'headers' : {
//         'Accept'        : 'application/vnd.wit.20160202+json',
//         'Authorization' : 'Bearer ' + witToken,
//         'Content-Type'  : 'audio/wav'
//       },
//       'body': JSON.stringify(file)
//   }, exports.parseResult)
// }
// }

//____________________________________________________________________________


//____________________________GOOGLE SPEECH API_________________________________

// const Speech = require('@google-cloud/speech');
// const speech = Speech();
// const projectId = 'translation-app-168502';
// const fs = require('fs');




//   // const speechClient = {
//   //     projectId: projectId
//   //   };

//     const config = {
//       "encoding": 'LINEAR16',
//       "sampleRateHertz": 44100,
//       "languageCode": 'en-US',
//     }

//   // exports.parseResult = (err, resp, body) => {
//   //   res.json(body);
//   // }
//     var audio = fs.createWriteStream('test.wav', { encoding: 'binary' });
//     let path = '/Users/davidspencer/GA/projects/unit03/speakeasy/test.wav'
  
//     if (req.body.status === 'go') {
//       rec.start({
//         sampleRate : 44100,
//         verbose : true
//       }).pipe(audio)}
    
//     if (req.body.status === 'stop') {
//       rec.stop()
//     }

//     speech.recognize(path, config).then(function(data) {
//     var results = data[0];
//     var apiResponse = data[1];
//     console.log(apiResponse);
//     })
// }

//_____________________________________________________________



translationController.translate = (req, res) => {
  const translateClient = Translate({
    projectId: projectId
  });
  const text = req.body.text;
  const options = {
    from: req.body.langFrom,
    to: req.body.langTo,
  };
  translateClient.translate(text, options)
    .then((results) => {
      const translation = results[0];
      res.json({message: 'worked', data: {translation: translation, source: options.from, target: options.to}})
    })
    .catch((err) => {
      console.error('ERROR:', err);
    });
}


module.exports = translationController;