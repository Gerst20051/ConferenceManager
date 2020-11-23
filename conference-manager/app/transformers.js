const db = require('./db');

module.exports = new function () {
  this.attendee = async attendee => ({
    id: attendee.id,
    name: attendee.name,
  });

  this.conference = async conference => {
    const dbAttendees = await db.getAttendeesByIds(conference.attendee_ids);
    const attendees = await Promise.all(dbAttendees.map(this.attendee));
    const dbTalks = await db.getTalksByIds(conference.talk_ids);
    const talks = await Promise.all(dbTalks.map(this.talk));
    return {
      id: conference.id,
      name: conference.name,
      attendees,
      talks,
    };
  };

  this.talk = async talk => {
    const dbAttendees = await db.getAttendeesByIds(talk.attendee_ids);
    const attendees = await Promise.all(dbAttendees.map(this.attendee));
    return {
      id: talk.id,
      name: talk.name,
      attendees,
    };
  };
};
