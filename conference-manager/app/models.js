const { v4: uuidv4 } = require('uuid');

module.exports = {
  createAttendee: ({ name }) => {
    return {
      id: uuidv4(),
      name,
    };
  },
  createConference: ({ name }) => {
    return {
      id: uuidv4(),
      name,
      attendee_ids: [],
      talk_ids: [],
    };
  },
  createTalk: ({ name }) => {
    return {
      id: uuidv4(),
      name,
      attendee_ids: [],
    };
  },
};
