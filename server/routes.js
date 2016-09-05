'use strict';

var config = require('../config');
var path = require('path');
var stravaApi = require('./stravaApi');

module.exports = function (app) {
    app.get('/client-configuration.js', function (req, res) {
        res.contentType('application/json');
        res.json({stravaApiKey: config.api.key});
    });

    app.post('/strava/oauth/token', stravaApi.token);
    app.get('/strava/*', stravaApi.proxy);

    app.get('*', function (req, res) {
        res.sendFile('public/index.html',
        { root: path.normalize(__dirname + '/..')});
    });
};
