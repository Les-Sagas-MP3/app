// Install express server
const express = require('express');
const path = require('path');

// Get conf from env variables
const appUrl = process.env.APP_URL || 'https://les-sagas-mp3-app-staging.herokuapp.com'
const apiUrl = process.env.API_URL || 'https://les-sagas-mp3-api-staging.herokuapp.com/api'

// Write conf in assets
const confText = '{"webUrl":"' + appUrl + '","apiUrl":"' + apiUrl + '"}'
fs = require('fs');
fs.writeFile('www/assets/config.json', confText, function (err) {
  if (err) return console.log(err);
  console.log(confText + ' > www/assets/config.json');
});

const app = express();

// Serve only the static files form the www directory
app.use(express.static(__dirname + '/www'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/www/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);