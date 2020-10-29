const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const { ATTENDEES_TABLE, CONFERENCES_TABLE, IS_OFFLINE, TALKS_TABLE } = process.env;

const dynamoDb = new AWS.DynamoDB.DocumentClient(
  IS_OFFLINE === 'true'
    ? {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    }
    : undefined
);

module.exports = (function () {
  this.model = {
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

  this.db = {
    getAttendeesByIds: async (attendeeIds) => {
      if (!attendeeIds.length) return [];
      const params = { RequestItems: {} };
      params.RequestItems[ATTENDEES_TABLE] = {
        Keys: attendeeIds.map(attendeeId => ({ id: attendeeId })),
      };
      const result = await dynamoDb.batchGet(params).promise();
      return result.Responses[ATTENDEES_TABLE];
    },
    getConferenceById: async (id) => {
      const result = await dynamoDb.get({
        TableName: CONFERENCES_TABLE,
        Key: { id },
      }).promise();
      return result.Item;
    },
    getConferences: async () => {
      const result = await dynamoDb.scan({
        TableName: CONFERENCES_TABLE,
      }).promise();
      return result.Items;
    },
    getTalkById: async (id) => {
      const result = await dynamoDb.get({
        TableName: TALKS_TABLE,
        Key: { id },
      }).promise();
      return result.Item;
    },
    getTalksByIds: async (talkIds) => {
      if (!talkIds.length) return [];
      const params = { RequestItems: {} };
      params.RequestItems[TALKS_TABLE] = {
        Keys: talkIds.map(talkId => ({ id: talkId })),
      };
      const result = await dynamoDb.batchGet(params).promise();
      return result.Responses[TALKS_TABLE];
    },
    putAttendee: async (attendee) => {
      const params = {
        TableName: ATTENDEES_TABLE,
        Item: attendee,
      };
      const result = await dynamoDb.put(params).promise();
      return result;
    },
    putConference: async (conference) => {
      const params = {
        TableName: CONFERENCES_TABLE,
        Item: conference,
      };
      const result = await dynamoDb.put(params).promise();
      return result;
    },
    putTalk: async (talk) => {
      const params = {
        TableName: TALKS_TABLE,
        Item: talk,
      };
      const result = await dynamoDb.put(params).promise();
      return result;
    },
  };

  this.transformConference = async (conference) => {
    const dbAttendees = await this.db.getAttendeesByIds(conference.attendee_ids);
    const attendees = await Promise.all(dbAttendees.map(this.transformAttendee));
    const dbTalks = await this.db.getTalksByIds(conference.talk_ids);
    const talks = await Promise.all(dbTalks.map(this.transformTalk));
    return {
      id: conference.id,
      name: conference.name,
      attendees,
      talks,
    };
  };

  this.transformTalk = async (talk) => {
    const dbAttendees = await this.db.getAttendeesByIds(talk.attendee_ids);
    const attendees = await Promise.all(dbAttendees.map(this.transformAttendee));
    return {
      id: talk.id,
      name: talk.name,
      attendees,
    };
  };

  this.transformAttendee = async (attendee) => {
    return {
      id: attendee.id,
      name: attendee.name,
    };
  };

  this.getConferences = async (req, res) => {
    try {
      const dbConferences = await this.db.getConferences();
      const conferences = await Promise.all(dbConferences.map(this.transformConference));
      res.send(conferences);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.createConference = async (req, res) => {
    try {
      if (!req.body.conference_name) return res.sendStatus(400);
      const rawConference = this.model.createConference({ name: req.body.conference_name });
      await this.db.putConference(rawConference);
      const conference = await this.transformConference(rawConference);
      res.send(conference);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.getTalks = async (req, res) => {
    try {
      const { conferenceId } = req.params;
      const dbConference = await this.db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      const dbTalks = await this.db.getTalksByIds(dbConference.talk_ids);
      const talks = await Promise.all(dbTalks.map(this.transformTalk));
      res.send(talks);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.createTalk = async (req, res) => {
    try {
      if (!req.body.talk_name) return res.sendStatus(400);
      const { conferenceId } = req.params;
      const dbConference = await this.db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      const rawTalk = this.model.createTalk({ name: req.body.talk_name });
      await this.db.putTalk(rawTalk);
      dbConference.talk_ids.push(rawTalk.id);
      await this.db.putConference(dbConference);
      const talk = await this.transformTalk(rawTalk);
      res.send(talk);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.createAttendee = async (req, res) => {
    try {
      if (!req.body.attendee_name) return res.sendStatus(400);
      const { conferenceId } = req.params;
      const dbConference = await this.db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      const rawAttendee = this.model.createAttendee({ name: req.body.attendee_name });
      await this.db.putAttendee(rawAttendee);
      dbConference.attendee_ids.push(rawAttendee.id);
      await this.db.putConference(dbConference);
      const attendee = await this.transformAttendee(rawAttendee);
      res.send(attendee);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.addAttendee = async (req, res) => {
    try {
      const { attendeeId, conferenceId, talkId } = req.params;
      const dbConference = await this.db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      if (!dbConference.talk_ids.includes(talkId)) return res.sendStatus(404);
      const dbTalk = await this.db.getTalkById(talkId);
      if (!dbTalk) return res.sendStatus(404);
      if (dbTalk.attendee_ids.includes(attendeeId)) return res.sendStatus(409);
      dbTalk.attendee_ids.push(attendeeId);
      await this.db.putTalk(dbTalk);
      const talk = await this.transformTalk(dbTalk);
      res.send(talk);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.removeAttendee = async (req, res) => {
    try {
      const { attendeeId, conferenceId, talkId } = req.params;
      const dbConference = await this.db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      if (!dbConference.talk_ids.includes(talkId)) return res.sendStatus(404);
      const dbTalk = await this.db.getTalkById(talkId);
      if (!dbTalk) return res.sendStatus(404);
      if (!dbTalk.attendee_ids.includes(attendeeId)) return res.sendStatus(404);
      dbTalk.attendee_ids = dbTalk.attendee_ids.filter(talkAttendeeId => talkAttendeeId !== attendeeId);
      await this.db.putTalk(dbTalk);
      const talk = await this.transformTalk(dbTalk);
      res.send(talk);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  return this;
})();
