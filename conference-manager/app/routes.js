module.exports = app => {
  const conferences = require('./controllers/conferences');

  app.get('/', (req, res) => {
    res.send('WELCOME TO THE CONFERENCE MANAGER REST API');
  });

  app.get('/conferences', conferences.getConferences);
  app.post('/conferences', conferences.createConference);
  app.get('/conferences/:conferenceId/talks', conferences.getTalks);
  app.post('/conferences/:conferenceId/talks', conferences.createTalk);
  app.post('/conferences/:conferenceId/attendees', conferences.createAttendee);
  app.patch('/conferences/:conferenceId/talks/:talkId/attendees/:attendeeId/add', conferences.addAttendee);
  app.patch('/conferences/:conferenceId/talks/:talkId/attendees/:attendeeId/remove', conferences.removeAttendee);

  app.get('/request', (req, res) => {
    res.send({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      req: {
        ...req,
        res: null,
      },
    });
  });
};
