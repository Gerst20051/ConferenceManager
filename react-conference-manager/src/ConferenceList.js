import { Box, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';

const useStyles = makeStyles(theme => ({
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export default function ConferenceList(props) {
  const classes = useStyles();
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [conferences, setConferences] = useState([{
    id: 'sadfsfa',
    name: 'conference name 1',
    attendees: [
      {
        id: 'sdfasdff',
        name: 'attendee name 1',
      },
      {
        id: 'sdfassdfsdfdff',
        name: 'attendee name 2',
      },
    ],
    talks: [
      {
        id: 'sdfasdff',
        name: 'talk name',
        attendees: [
          {
            id: 'sdfassdfsdfdff',
            name: 'attendee name 2',
          },
        ],
      },
    ],
  }, {
    id: 'sadsdfsdfsfa',
    name: 'conference name 2',
    attendees: [
      {
        id: 'sdfasdff',
        name: 'attendee name 1',
      },
      {
        id: 'sdfassdfsdfdff',
        name: 'attendee name 2',
      },
    ],
    talks: [
      {
        id: 'sdfasdff',
        name: 'talk name',
        attendees: [
          {
            id: 'sdfassdfsdfdff',
            name: 'attendee name 2',
          },
        ],
      },
    ],
  }]);

  useEffect(() => {
    fetch('https://q8sxd5phn7.execute-api.us-east-1.amazonaws.com/dev/conferences')
      .then(res => res.json())
      .then(
        result => {
          setIsLoaded(true);
          // setConferences(result);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [props.conference]);

  if (error) {
    return <Box><br /><Typography>Error Loading Conferences</Typography><br /></Box>;
  } else if (!isLoaded) {
    return <Box><br /><Typography>Loading Conferences...</Typography><br /></Box>;
  } else if (!conferences.length) {
    return <Box><br /><Typography>No Conferences Exist</Typography><br /></Box>;
  } else {
    return (
      <List disablePadding>
        {conferences.map(conference => (
          <ListItem divider key={conference.id} className={classes.listItem} onClick={() => {
            props.setConference(conference);
          }}>
            <ListItemText primary={conference.name} align="center" />
          </ListItem>
        ))}
      </List>
    );
  }
}
