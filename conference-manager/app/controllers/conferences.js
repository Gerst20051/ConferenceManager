const db = require('../db');
const models = require('../models');
const transformers = require('../transformers');

module.exports = new function () {
  this.addAttendee = async (req, res) => {
    try {
      const { attendeeId, conferenceId, talkId } = req.params;
      const dbConference = await db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      if (!dbConference.talk_ids.includes(talkId)) return res.sendStatus(404);
      const dbTalk = await db.getTalkById(talkId);
      if (!dbTalk) return res.sendStatus(404);
      if (dbTalk.attendee_ids.includes(attendeeId)) return res.sendStatus(409);
      dbTalk.attendee_ids.push(attendeeId);
      await db.putTalk(dbTalk);
      const talk = await transformers.talk(dbTalk);
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
      const dbConference = await db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      const rawAttendee = models.createAttendee({ name: req.body.attendee_name });
      await db.putAttendee(rawAttendee);
      dbConference.attendee_ids.push(rawAttendee.id);
      await db.putConference(dbConference);
      const attendee = await transformers.attendee(rawAttendee);
      res.send(attendee);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.createConference = async (req, res) => {
    try {
      if (!req.body.conference_name) return res.sendStatus(400);
      const rawConference = models.createConference({ name: req.body.conference_name });
      await db.putConference(rawConference);
      const conference = await transformers.conference(rawConference);
      res.send(conference);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.createTalk = async (req, res) => {
    try {
      if (!req.body.talk_name) return res.sendStatus(400);
      const { conferenceId } = req.params;
      const dbConference = await db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      const rawTalk = models.createTalk({ name: req.body.talk_name });
      await db.putTalk(rawTalk);
      dbConference.talk_ids.push(rawTalk.id);
      await db.putConference(dbConference);
      const talk = await transformers.talk(rawTalk);
      res.send(talk);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.getConferences = async (req, res) => {
    try {
      const dbConferences = await db.getConferences();
      const conferences = await Promise.all(dbConferences.map(transformers.conference));
      res.send(conferences);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.getTalks = async (req, res) => {
    try {
      const { conferenceId } = req.params;
      const dbConference = await db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      const dbTalks = await db.getTalksByIds(dbConference.talk_ids);
      const talks = await Promise.all(dbTalks.map(transformers.talk));
      res.send(talks);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };

  this.removeAttendee = async (req, res) => {
    try {
      const { attendeeId, conferenceId, talkId } = req.params;
      const dbConference = await db.getConferenceById(conferenceId);
      if (!dbConference) return res.sendStatus(404);
      if (!dbConference.talk_ids.includes(talkId)) return res.sendStatus(404);
      const dbTalk = await db.getTalkById(talkId);
      if (!dbTalk) return res.sendStatus(404);
      if (!dbTalk.attendee_ids.includes(attendeeId)) return res.sendStatus(404);
      dbTalk.attendee_ids = dbTalk.attendee_ids.filter(talkAttendeeId => talkAttendeeId !== attendeeId);
      await db.putTalk(dbTalk);
      const talk = await transformers.talk(dbTalk);
      res.send(talk);
    } catch (e) {
      console.error(e);
      res.sendStatus(500);
    }
  };
};
