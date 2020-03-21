const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
require('dotenv').config();

const MAX_ALLOWED_SESSION_DURATION = 14400;
const twilioAccountSid = 'AC015ceea6e72b7ae090e8291eb30a6935';
const twilioApiKeySID = 'SKbf7a181dd0cf3639fe1059e99eb2ee2a';
const twilioApiKeySecret = 'GqgW0qU3T7ea3xgbr0kErXjagyVD7bIv';

app.use(express.static(path.join(__dirname, 'build')));

app.get('/token', (req, res) => {
  const { identity, roomName } = req.query;
  const token = new AccessToken(twilioAccountSid, twilioApiKeySID, twilioApiKeySecret, {
    ttl: MAX_ALLOWED_SESSION_DURATION,
  });
  token.identity = identity;
  const videoGrant = new VideoGrant({ room: roomName });
  token.addGrant(videoGrant);
  res.send(token.toJwt());
  console.log(`issued token for ${identity} in room ${roomName}`);
});

app.get('*', (_, res) => res.sendFile(path.join(__dirname, 'build/index.html')));

// app.listen(3000, () => console.log('token server running on 3000'));

var server = http.createServer(app);

server.listen(process.env.PORT || 3000, function() {
	console.log("Express server listening on port 3000");
});
