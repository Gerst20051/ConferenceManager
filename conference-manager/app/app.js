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

// TODO: Create The Following Routes

// GET LIST OF CONFERENCES
// - app.get('/conferences')

// CREATE A CONFERENCE
// - app.post('/conferences')
// -- conference name

// GET LIST OF TALKS (FOR A CONFERENCE)
// - app.get('/conferences/:conference-id/talks')

// CREATE A TALK (FOR A CONFERENCE)
// - app.post('/conferences/:conference-id/talks')
// -- conference id
// -- talk name

// CREATE AN ATTENDEE (FOR A CONFERENCE)
// - app.post('/conferences/:conference-id/attendees')
// -- conference id
// -- attendee name

// ADD A CONFERENCE ATTENDEE TO A TALK
// - app.patch('/conferences/:conference-id/talks/:talk-id/attendees/:attendee-id/add

// REMOVE A CONFERENCE ATTENDEE FROM A TALK
// - app.patch('/conferences/:conference-id/talks/:talk-id/attendees/:attendee-id/remove

// TODO: Create The Following Models

// conference: {
//   id: '',
//   name: '',
//   attendee_ids: [],
//   talk_ids: [],
// }

// attendee: {
//   id: '',
//   name: '',
// }

// talk: {
//   id: '',
//   name: '',
//   attendee_ids: [],
// }

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
