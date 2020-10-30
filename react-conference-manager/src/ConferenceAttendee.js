import { Box, Button, Typography } from '@material-ui/core';
import { Fragment } from 'react';

import config from './config';

export default function ConferenceAttendee(props) {
  const handleAttendeeRemove = async () => {
    const response = await fetch(`${config.API_URL}/conferences/${props.conference.id}/talks/${props.talk.id}/attendees/${props.attendee.id}/remove`, {
      method: 'PATCH',
    });
    const json = await response.json();
    props.setTalk(json);
    props.setAttendee();
  };

  return (
    <Fragment>
      <Box py={2}>
        <Typography variant="h6">Attendee Name</Typography>
        <Typography>{ props.attendee.name }</Typography>
      </Box>
      {props.talk && (
        <Box pb={2}>
          <Button variant="contained" color="secondary" onClick={handleAttendeeRemove}>Remove Attendee From Talk</Button>
        </Box>
      )}
    </Fragment>
  );
}
