'use strict';

const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  res.send('WELCOME TO THE CONFERENCE MANAGER REST API');
});

app.get('/request', (req, res) => {
  res.send({
    message: 'Go Serverless v1.0! Your function executed successfully!',
    req: {
      ...req,
      res: null,
    },
  });
});

module.exports.handler = serverless(app);
