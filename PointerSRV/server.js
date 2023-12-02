const express = require('express');
const cors = require('cors');

//initilize firestore database
const admin = require('firebase-admin');
var serviceAccount = require(__dirname + "/pointertracker-b0779-firebase-adminsdk-r5vq4-be3f232431.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pointertracker-b0779.firebaseio.com',
});
exports.db = admin.firestore();

const bodyParser = require('body-parser');
const apiRouter = require('./routers/api.router');
const port = process.env.PORT || 8080;

//-----------------------------------------------
//-----------------------------------------------

const app = express();
app.use(express.static(__dirname + "/public"));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use((req, res) => {
  res.redirect('/');
});

app.listen(port, () => { console.log(`Server started on port ${port}`); });
process.on('uncaughtException', (error) => {
  console.error('Error: ', error);
}); 