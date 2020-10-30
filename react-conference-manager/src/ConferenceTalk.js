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

export default function ConferenceTalk(props) {
  const classes = useStyles();

  return (
    <Fragment>
      <Box py={2}>
        <Typography variant="h6">Talk Name</Typography>
        <Typography>{ props.talk.name }</Typography>
      </Box>
      <Divider />
      <Box pt={2} pb={props.talk.attendees.length ? 0 : 2}>
        <Typography variant="h6">Talk Attendees</Typography>
        {
          props.talk.attendees.length
            ? (
              <List disablePadding>
                {props.talk.attendees.map(attendee => (
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
