require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const passport = require('passport');

const routes = require('./routes/main');
const secureRoutes = require('./routes/secure');

const connectWithRetry = () => {
  console.log('MongoDB connection with retry');
  mongoose.connect(process.env.MONGO_CONNECTION_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 500,
    socketTimeoutMS: 500
  }).catch(err => {
    console.log('MongoDB connection unsuccessful, retry after 1000 milliseconds. ', err);
    dbConnected = false;
    setTimeout(connectWithRetry, 500);
  });
};

let dbConnected = false;

mongoose.connection.on('error', (error) => {
  console.log('MongoDB connection error:', error);
  dbConnected = false;
});

mongoose.connection.on('connected', function () {
  console.log('Connected to MongoDB');
  dbConnected = true;
});

mongoose.connection.on('disconnected', function () {
  console.log('Disconnected from MongoDB');
  dbConnected = false;
  connectWithRetry();
});

connectWithRetry();

const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const checkDbConnection = debounce(async () => {
  try {
    await mongoose.connection.db.admin().ping();
    if (!dbConnected) {
      console.log('Reconnected to MongoDB');
      dbConnected = true;
    }
  } catch (err) {
    if (dbConnected) {
      console.log('Lost connection to MongoDB:', err);
      dbConnected = false;
    }
  }
}, 350); // Debounce interval

setInterval(checkDbConnection, 500);

const app = express();
const session = require('express-session');

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.static(__dirname + '/public'));
app.use('/game', express.static(__dirname + '/Game'));

app.use((req, res, next) => {
  if (!dbConnected && req.path !== '/checkdb.html' && req.path !== '/check-db-connection') {
    return res.redirect('/checkdb.html');
  }
  next();
});

require('./auth/auth');

app.get('/leaderboard.html', passport.authenticate('jwt', { session: false }), function (req, res) {
  res.sendFile(__dirname + '/public/leaderboard.html');
});

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/checkdb.html', function (req, res) {
  res.sendFile(__dirname + '/public/checkdb.html');
});

app.get('/check-db-connection', function (req, res) {
  res.json({ connected: dbConnected });
});

app.use('/', routes);
app.use('/', passport.authenticate('jwt', { session: false }), secureRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: '404 - Not Found' });
});

app.use((err, req, res, next) => {
  console.log(err.message);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server started on port ${process.env.PORT || 3000}`);
});
