const express = require('express');
const translationController = require('../controllers/translationController');
require('isomorphic-fetch');

const translationRoute = express.Router();

translationRoute.post('/translate', translationController.translate);
translationRoute.post('/recognize', translationController.recognize);

module.exports = translationRoute;