const express = require('express');
const XeroClient = require('xero-node').AccountingAPIClient;
const config = require('./config.json');

let app = express();
let previousRequestToken = null;
let xeroClient = new XeroClient(config);


app.set('port', 3000);

app.get('/', function(req,res) {
  res.send('<a href="connect">Connect to Xero</a>')
});

app.get('/connect', async function(req, res) {
  previousRequestToken = await xeroClient.oauth1Client.getRequestToken();
  let authoriseURL = xeroClient.oauth1Client.buildAuthoriseUrl(previousRequestToken);
  res.redirect(authoriseURL)
});

app.get('/callback', async function(req, res) {
  let oauth_verifier = req.query.oauth_verifier;
  let accessToken = await xeroClient.oauth1Client.swapRequestTokenforAccessToken(previousRequestToken, oauth_verifier);

  let org = await xeroClient.organisations.get();

  res.send(org);
});

app.listen(app.get('port'), function(){
  console.log('Your app is up and running on http://localhost:3000/')
});
