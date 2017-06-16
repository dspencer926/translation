const express = require('express');
const path = require('path');
const logger = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const cors = require('cors');
const app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

require('dotenv').config()


const PORT = process.env.PORT || 3001;
server.listen(PORT, function() {
  console.log(`listening on port ${PORT}`);
});

// socket = io.listen(server);

app.use('/static', express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());





app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

let socketIds = [];

io.sockets.on('connection', (socket) => {
  socketIds.push(socket.id);
  console.log(socketIds)
  console.log('connected');
  socket.on('message', function(msg, msg2){
    console.log('message: ' + msg, msg2);
  });
socket.on('disconnect', (socket) => {
  console.log('disconnect ', socket.id);
  socketIds = socketIds.filter((val) => {
    return (val !== socket.id)
  })
  console.log(socketIds)
})
  socket.on('testing', (message) => {
    let testSocket = socketIds.filter((val) => {
    return (val !== socket.id)
  })
    console.log('testing, should send to: ', testSocket[0], 'message: ', message);
    socket.broadcast.emit('translatedResponse', message);
  });
})

const translationRoute = require('./routes/translationRoute');
app.use('/translation', translationRoute);

const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/users', userRoutes)

app.use('/testing', (req, res) => {
    console.log('successssss', req.user);
    res.send({user: req.user, auth: true});
});


/* handling 404 */
app.get('*', function(req, res) {
  res.status(404).send({message: 'Oops! Not found.'});
});