import { Box, List, ListItem, ListItemText, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useEffect, useState } from 'react';

import config from './config';

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
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    fetch(`${config.API_URL}/conferences`)
      .then(res => res.json())
      .then(
        result => {
          setIsLoaded(true);
          setConferences(result);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, [props.conference]);

  if (error) {
    return <Box py={2}><Typography>Error Loading Conferences</Typography></Box>;
  } else if (!isLoaded) {
    return <Box py={2}><Typography>Loading Conferences...</Typography></Box>;
  } else if (!conferences.length) {
    return <Box py={2}><Typography>No Conferences Exist</Typography></Box>;
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
