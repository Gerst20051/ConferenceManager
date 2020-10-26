import { Fragment } from 'react';
import { Box, Button, Divider, Paper } from '@material-ui/core';
import ConferenceList from './ConferenceList';
import Header from './Header';

export default function ConferenceManager() {
  return (
    <Fragment>
      <Header text="Conference Manager" />
      <Paper variant="outlined" square>
        <Box align="center">
          <br />
          <Button variant="contained" color="primary">Create Conference</Button>
          <br />
          <br />
          <Divider />
          <ConferenceList />
        </Box>
      </Paper>
    </Fragment>
  );
}
