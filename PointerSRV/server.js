const express = require('express');
const cors = require('cors');
//-----------------------------------------------
//-----------------------------------------------
const user_pointDB = require("./models/user_point.model");
//-----------------------------------------------
//-----------------------------------------------

const bodyParser = require('body-parser');
const apiRouter = require('./routers/api.router');

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(__dirname+"/database.db");
const db_utils = require('./services/database')
const port = process.env.PORT || 8080;
const scheduler = require('./services/scheduler');

const app = express();
app.use(express.static(__dirname+"/public"));
app.use(cors());
app.use(bodyParser.json());
app.use('/api', apiRouter);
app.use((req, res) => {
  res.redirect('/');
});

async function init() {
  await db_utils.initDataBase(db);
  //await db_utils.createData(db)
  //await scheduler.start()
}

init();
app.listen(port, () => {console.log(`Server started on port ${port}`);});
process.on('uncaughtException', (error) => {
  console.error('Error: ', error);
});