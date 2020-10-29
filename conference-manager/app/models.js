const { v4: uuidv4 } = require('uuid');

module.exports = {
  createAttendee: ({ name }) => ({
    id: uuidv4(),
    name,
  }),
  createConference: ({ name }) => ({
    id: uuidv4(),
    name,
    attendee_ids: [],
    talk_ids: [],
  }),
  createTalk: ({ name }) => ({
    id: uuidv4(),
    name,
    attendee_ids: [],
  }),
};
