import { Box, Typography } from '@material-ui/core';
import { Fragment } from 'react';

export default function ConferenceAttendee(props) {
  return (
    <Fragment>
      <Box py={2}>
        <Typography variant="h6">Attendee Name</Typography>
        <Typography>{ props.attendee.name }</Typography>
      </Box>
    </Fragment>
  );
}
