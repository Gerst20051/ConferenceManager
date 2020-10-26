'use strict';

const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/request', (req, res) => {
  res.send({
    message: 'Go Serverless v1.0! Your function executed successfully!',
    req: {
      ...req,
      res: null,
    },
  });
});

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  return await handler(event, context);
};
