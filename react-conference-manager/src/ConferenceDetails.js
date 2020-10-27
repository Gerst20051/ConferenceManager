import { Box, Divider, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Fragment } from 'react';

const useStyles = makeStyles(theme => ({
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export default function ConferenceDetails(props) {
  const classes = useStyles();

  return (
    <Fragment>
      <Box py={2}>
        <Typography variant="h6">Conference Name</Typography>
        <Typography>{ props.conference.name }</Typography>
      </Box>
      <Divider />
      <Box pt={2} pb={props.conference.talks.length ? 0 : 2}>
        <Typography variant="h6">Conference Talks</Typography>
        {
          props.conference.talks.length
            ? (
              <List disablePadding>
                {props.conference.talks.map(talk => (
                  <ListItem divider key={talk.id} className={classes.listItem} onClick={() => {
                    props.setTalk(talk);
                  }}>
                    <ListItemText primary={talk.name} align="center" />
                  </ListItem>
                ))}
              </List>
            )
            : <Typography>No Talks</Typography>
        }
      </Box>
      <Divider />
      <Box pt={2} pb={props.conference.attendees.length ? 0 : 2}>
        <Typography variant="h6">Conference Attendees</Typography>
        {
          props.conference.attendees.length
            ? (
              <List disablePadding>
                {props.conference.attendees.map(attendee => (
                  <ListItem divider key={attendee.id} className={classes.listItem} onClick={() => {
                    props.setAttendee(attendee);
                  }}>
                    <ListItemText primary={attendee.name} align="center" />
                  </ListItem>
                ))}
              </List>
            )
            : <Typography>No Attendees</Typography>
        }
      </Box>
    </Fragment>
  );
}
