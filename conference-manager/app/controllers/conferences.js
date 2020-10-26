const { v4: uuidv4 } = require('uuid');

module.exports = (function () {
  this.conferences = [];
  this.attendees = [];
  this.talks = [];

  this.dbCreateConference = ({ name }) => {
    return {
      id: uuidv4(),
      name,
      attendee_ids: [],
      talk_ids: [],
    };
  };

  this.dbCreateAttendee = ({ name }) => {
    return {
      id: uuidv4(),
      name,
    };
  };

  this.dbCreateTalk = ({ name }) => {
    return {
      id: uuidv4(),
      name,
      attendee_ids: [],
    };
  };

  this.transformConference = (conference) => {
    return {
      id: conference.id,
      name: conference.name,
      attendees: conference.attendee_ids.map(attendeeId => {
        return this.attendees.find(attendee => attendee.id === attendeeId);
      }),
      talks: conference.talk_ids.map(talkId => {
        return this.transformTalk(this.talks.find(talk => talk.id === talkId));
      }),
    };
  };

  this.transformTalk = (talk) => {
    return {
      id: talk.id,
      name: talk.name,
      attendees: talk.attendee_ids.map(attendeeId => {
        return this.attendees.find(attendee => attendee.id === attendeeId);
      }),
    };
  };

  this.getConferences = (req, res) => {
    res.send(this.conferences.map(this.transformConference));
  };

  this.createConference = (req, res) => {
    if (!req.body.conference_name) return res.sendStatus(400);
    const conference = this.dbCreateConference({ name: req.body.conference_name });
    this.conferences.push(conference);
    res.send(this.transformConference(conference));
  };

  this.getTalks = (req, res) => {
    const { conferenceId } = req.params;
    const conference = this.conferences.find(conference => conference.id === conferenceId);
    if (!conference) return res.sendStatus(404);
    const talks = this.talks.filter(talk => conference.talk_ids.includes(talk.id));
    res.send(talks.map(this.transformTalk));
  };

  this.createTalk = (req, res) => {
    if (!req.body.talk_name) return res.sendStatus(400);
    const { conferenceId } = req.params;
    const conference = this.conferences.find(conference => conference.id === conferenceId);
    if (!conference) return res.sendStatus(404);
    const talk = this.dbCreateTalk({ name: req.body.talk_name });
    conference.talk_ids.push(talk.id);
    this.talks.push(talk);
    res.send(this.transformTalk(talk));
  };

  this.createAttendee = (req, res) => {
    if (!req.body.attendee_name) return res.sendStatus(400);
    const { conferenceId } = req.params;
    const conference = this.conferences.find(conference => conference.id === conferenceId);
    if (!conference) return res.sendStatus(404);
    const attendee = this.dbCreateAttendee({ name: req.body.attendee_name });
    conference.attendee_ids.push(attendee.id);
    this.attendees.push(attendee);
    res.send(attendee);
  };

  this.addAttendee = (req, res) => {
    const { attendeeId, conferenceId, talkId } = req.params;
    const conference = this.conferences.find(conference => conference.id === conferenceId);
    if (!conference) return res.sendStatus(404);
    if (!conference.talk_ids.includes(talkId)) return res.sendStatus(404);
    const talk = this.talks.find(talk => talk.id === talkId);
    if (!talk) return res.sendStatus(404);
    if (talk.attendee_ids.includes(attendeeId)) return res.sendStatus(409);
    talk.attendee_ids.push(attendeeId);
    res.send(this.transformTalk(talk));
  };

  this.removeAttendee = (req, res) => {
    const { attendeeId, conferenceId, talkId } = req.params;
    const conference = this.conferences.find(conference => conference.id === conferenceId);
    if (!conference) return res.sendStatus(404);
    if (!conference.talk_ids.includes(talkId)) return res.sendStatus(404);
    const talk = this.talks.find(talk => talk.id === talkId);
    if (!talk) return res.sendStatus(404);
    if (!talk.attendee_ids.includes(attendeeId)) return res.sendStatus(404);
    talk.attendee_ids = talk.attendee_ids.filter(talkAttendeeId => talkAttendeeId !== attendeeId);
    res.send(this.transformTalk(talk));
  };

  return this;
})();
