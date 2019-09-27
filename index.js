const express = require('express');
const XeroClient = require('xero-node').AccountingAPIClient;
const config = require('./config.json');

let app = express();
let previousRequestToken = null;
let xeroClient = new XeroClient(config);

let item1 = {
  "Code": "Surfboard",
  "PurchaseDetails": {
    "COGSAccountCode": "300"
  },
  "SalesDetails": {
    "UnitPrice": 520.99,
    "AccountCode": "400",
    "TaxType": "NONE"
  },
  "InventoryAssetAccountCode": "140",
  "QuantityOnHand": 10.0000,
};

let item2 = {
  "Code": "Skateboard",
  "PurchaseDetails": {
    "COGSAccountCode": "300"
  },
  "SalesDetails": {
    "UnitPrice": 124.30,
    "AccountCode": "400",
    "TaxType": "NONE"
  },
  "InventoryAssetAccountCode": "140",
  "QuantityOnHand": 10,
};

let contact1 = {
  "Name": "Rod Drury"
};

let invoice1 = {
  "Type": "ACCREC",
  "Contact": {
    "ContactID": "df9f931e-4042-40ba-90cb-885676c8f363"
  },
  "DueDate": "\/Date(1518685950940+0000)\/",
  "LineItems": [
    {
      "Description": "Sold four gnarly Surfbaoards",
      "Quantity": "4",
      "ItemCode": "Surfboard",
      "UnitAmount": "520.99",
      "AccountCode": "300"
    },
    {
      "Description": "Sold five incredible skateboards",
      "Quantity": "5",
      "ItemCode": "Skateboard",
      "UnitAmount": "124.30",
      "AccountCode": "300"
   }
  ],
  "Status": "AUTHORISED"
};

let payment1 = {
  "Invoice": { "InvoiceID": "ee467c3a-e88a-4d85-98be-01724ee00aa4" },
  "Account": { "Code": "090" },
  "Date": "2019-09-08",
  "Amount": 2705.46,
};


app.set('port', 3000);

app.get('/', (req,res) => {
  res.send('<a href="connect">Connect to Xero</a>')
});

app.get('/connect', async (req, res) => {
  previousRequestToken = await xeroClient.oauth1Client.getRequestToken();
  let authoriseURL = xeroClient.oauth1Client.buildAuthoriseUrl(previousRequestToken);
  res.redirect(authoriseURL)
});

app.get('/callback', async (req, res) => {
  let oauth_verifier = req.query.oauth_verifier;
  let accessToken = await xeroClient.oauth1Client.swapRequestTokenforAccessToken(previousRequestToken, oauth_verifier);

  // let org = await xeroClient.organisations.get();
  // let myAccounts = await xeroClient.accounts.get();
  // let myItems = await xeroClient.items.get();
  // let myContacts = await xeroClient.contacts.get();
  // let postItem2 = await xeroClient.items.create(item2);
  // let postContact1 = await xeroClient.contacts.create(contact1);
  // let mySales = await xeroClient.invoices.get();
  let myPayments = await xeroClient.payments.create(payment1);

res.send(myPayments);
});

app.listen(app.get('port'), () => {
  console.log('Your app is up and running on http://localhost:3000/')
});
