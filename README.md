# StravaAnalyticsApp

Just an empty Strava App for now.

## Development setup

In order to start it up locally you need to add a config.js file to the root of the project that has the following content:

```
'use strict';

var config = {
    port: 5000,
    api: {
        host: 'https://www.strava.com',
        key: '',
        secret: ''
    }
};

module.exports = config;
```

A key and secret can be obtained by creating an API Application on strava.com. 
