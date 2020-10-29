const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes')(app);

module.exports.handler = serverless(app);
