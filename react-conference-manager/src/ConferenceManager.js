import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GroupIcon from '@material-ui/icons/Group';
import { Fragment, useState } from 'react';

import Conference from './Conference';
import ConferenceList from './ConferenceList';
import config from './config';
import Header from './Header';

const useStyles = makeStyles(theme => ({
  backdrop: {
    color: theme.palette.common.white,
    zIndex: theme.zIndex.drawer + 1,
  },
  leftHeaderButton: {
    marginRight: theme.spacing(1),
  },
  leftHeaderIcon: {
    marginRight: theme.spacing(2.5),
  },
}));

export default function ConferenceManager() {
  const [conference, setConference] = useState();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({});
  const classes = useStyles();

  const handleClose = () => {
    setOpen(false);
    setForm({});
  };

  const handleAdd = async () => {
    if (!form.conference_name) return;
    setIsLoading(true);
    const response = await fetch(`${config.API_URL}/conferences`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conference_name: form.conference_name }),
    });
    const json = await response.json();
    setIsLoading(false);
    setOpen(false);
    setConference(json);
    setForm({});
  };

  return (
    <Fragment>
      <Header text="Conference Manager" leftContent={
        conference
          ? (
            <IconButton className={classes.leftHeaderButton} edge="start" color="inherit" onClick={() => setConference()}>
              <ArrowBackIcon />
            </IconButton>
          )
          : <GroupIcon className={classes.leftHeaderIcon} />
      } rightContent={(
        <IconButton edge="end" color="inherit" onClick={() => setOpen(true)}>
          <AddIcon />
        </IconButton>
      )} />
      <Paper variant="outlined" square>
        <Box align="center">
          { conference
            ? <Conference conference={conference} />
            : <ConferenceList conference={conference} setConference={setConference} />
          }
        </Box>
      </Paper>
      <Box align="center" py={2}>
        <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
      </Box>
      <Dialog open={open && !isLoading} onClose={handleClose}>
        <DialogTitle>Add Conference</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name for the conference.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="conference_name"
            label="Conference Name"
            type="text"
            fullWidth
            onChange={e => {
              setForm({
                ...form,
                conference_name: e.target.value,
              });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAdd} color="primary" disabled={isLoading}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Fragment>
  );
}
