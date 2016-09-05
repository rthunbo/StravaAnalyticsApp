'use strict';

var request = require('request');
var querystring = require('querystring');

var config = require('../config');

var tokenMethod = function (req, res) {

    var body = req.body;
    body.client_secret = config.api.secret;

    var options = {
        baseUrl: config.api.host,
        uri: req.url.substring('/strava'.length),
        method: req.method,
        json: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: querystring.stringify(body)
    };

    request(options, function (error, response, body) {
        res.status(response.statusCode);
        res.send(response.body);
    });
};

var proxyMethod = function (req, res) {

    var options = {
        baseUrl: config.api.host,
        uri: req.url.substring('/strava'.length),
        method: req.method,
        json: true,
        headers: {
            'Authorization': req.header('Authorization')
        }
    };

    request(options, function (error, response, body) {
        res.status(response.statusCode);
        res.send(response.body);
    });
};

module.exports = {
    token: tokenMethod,
    proxy: proxyMethod
};
