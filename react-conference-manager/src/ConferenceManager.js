import { Backdrop, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, List, ListItem, ListItemText, Paper, TextField } from '@material-ui/core';
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
  listItem: {
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

export default function ConferenceManager() {
  const [backButtonEnabled, setBackButtonEnabled] = useState(true);
  const [backClickCount, setBackClickCount] = useState(0);
  const [showAddIcon, setShowAddIcon] = useState(true);
  const [attendee, setAttendee] = useState();
  const [talk, setTalk] = useState();
  const [conference, setConference] = useState();
  const [conferences, setConferences] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [openOptionsDialog, setOpenOptionsDialog] = useState(false);
  const [openTalkDialog, setOpenTalkDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [conferenceForm, setConferenceForm] = useState({});
  const [talkForm, setTalkForm] = useState({});
  const [attendeeForm, setAttendeeForm] = useState({});
  const [optionsSelection, setOptionsSelection] = useState();
  const classes = useStyles();

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setConferenceForm({});
    setTalkForm({});
    setAttendeeForm({});
  };

  const handleCloseTalkDialog = () => {
    setOpenTalkDialog(false);
  };

  const handleConferenceAdd = async () => {
    if (!conferenceForm.conference_name) return;
    setIsLoading(true);
    const response = await fetch(`${config.API_URL}/conferences`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ conference_name: conferenceForm.conference_name }),
    });
    const json = await response.json();
    setIsLoading(false);
    setOpenDialog(false);
    setConference(json);
    setConferenceForm({});
  };

  const handleTalkAdd = async () => {
    if (!talkForm.talk_name) return;
    setIsLoading(true);
    const response = await fetch(`${config.API_URL}/conferences/${conference.id}/talks`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ talk_name: talkForm.talk_name }),
    });
    const json = await response.json();
    setIsLoading(false);
  };

  const handleAttendeeAdd = async () => {
    if (!attendeeForm.attendee_name) return;
    setIsLoading(true);
    const response = await fetch(`${config.API_URL}/conferences/${conference.id}/attendees`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attendee_name: attendeeForm.attendee_name }),
    });
    const json = await response.json();
    setIsLoading(false);
  };

  const handleAttendeeSelect = async attendeeId => {
    setIsLoading(true);
    const response = await fetch(`${config.API_URL}/conferences/${conference.id}/talks/${talk.id}/attendees/${attendeeId}/add`, {
      method: 'PATCH',
    });
    const json = await response.json();
    setIsLoading(false);
    setTalk(json);
    setOpenTalkDialog(false);
  };

  const handleCloseOptions = () => {
    setOptionsSelection();
    setOpenOptionsDialog(false);
  };

  const addConferenceFormHandler = e => {
    setConferenceForm({
      ...conferenceForm,
      conference_name: e.target.value,
    });
  };

  const addTalkFormHandler = e => {
    setTalkForm({
      ...talkForm,
      talk_name: e.target.value,
    });
  };

  const addAttendeeFormHandler = e => {
    setAttendeeForm({
      ...attendeeForm,
      attendee_name: e.target.value,
    });
  };

  const dialogType = optionsSelection === 1
    ? 'Talk'
    : optionsSelection === 2
      ? 'Attendee'
      : 'Conference';

  return (
    <Fragment>
      <Header text="Conference Manager" leftContent={
        conference
          ? (
            <IconButton
              className={classes.leftHeaderButton}
              edge="start"
              color="inherit"
              onClick={() => (
                backButtonEnabled ? setConference() : setBackClickCount(backClickCount + 1)
              )}>
              <ArrowBackIcon />
            </IconButton>
          )
          : <GroupIcon className={classes.leftHeaderIcon} />
      } rightContent={
        showAddIcon ? (
          <IconButton edge="end" color="inherit" onClick={() => (
            talk
              ? setOpenTalkDialog(true)
              : conference
                ? (
                  setOptionsSelection(),
                  setOpenOptionsDialog(true)
                )
                : setOpenDialog(true)
          )}>
            <AddIcon />
          </IconButton>
        ) : null
      } />
      <Paper variant="outlined" square>
        <Box align="center">
          { conference
            ? (
              <Conference
                conference={conference}
                setBackButtonEnabled={setBackButtonEnabled}
                backClickCount={backClickCount}
                setShowAddIcon={setShowAddIcon}
                setAttendee={setAttendee}
                setTalk={setTalk} />
            )
            : (
              <ConferenceList
                conference={conference}
                setConference={setConference}
                conferences={conferences}
                setConferences={setConferences} />
            )
          }
        </Box>
      </Paper>
      <Box align="center" py={2}>
        <small>You are running this application in <b>{process.env.NODE_ENV}</b> mode.</small>
      </Box>
      <Dialog open={openOptionsDialog} onClose={handleCloseOptions}>
        <List>
          <ListItem button onClick={() => {
            setOptionsSelection(1);
            setOpenOptionsDialog(false);
            setOpenDialog(true);
          }}>
            <ListItemText primary="Add Talk" />
          </ListItem>
          <ListItem button onClick={() => {
            setOptionsSelection(2);
            setOpenOptionsDialog(false);
            setOpenDialog(true);
          }}>
            <ListItemText primary="Add Attendee" />
          </ListItem>
        </List>
      </Dialog>
      <Dialog open={openTalkDialog} onClose={handleCloseTalkDialog}>
        <DialogTitle>
          Add Attendee To Talk
        </DialogTitle>
        <List>
          {talk && conference && conference.attendees.filter(attendee => {
            const talkAttendeeIds = talk.attendees.map(attendee => attendee.id);
            return !talkAttendeeIds.includes(attendee.id);
          }).map(attendee => (
            <ListItem divider key={attendee.id} className={classes.listItem} onClick={() => {
              handleAttendeeSelect(attendee.id);
            }}>
              <ListItemText primary={attendee.name} align="center" />
            </ListItem>
          ))}
        </List>
      </Dialog>
      <Dialog open={openDialog && !isLoading} onClose={handleCloseDialog}>
        <DialogTitle>
          Add {dialogType}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter the name for the {dialogType}.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id={`${dialogType.toLowerCase()}_name`}
            label={`${dialogType} Name`}
            type="text"
            fullWidth
            onChange={(
              optionsSelection === 1
                ? addTalkFormHandler
                : optionsSelection === 2
                  ? addAttendeeFormHandler
                  : addConferenceFormHandler
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={(
            optionsSelection === 1
              ? handleTalkAdd
              : optionsSelection === 2
                ? handleAttendeeAdd
                : handleConferenceAdd
          )} color="primary" disabled={isLoading}>
            Add {dialogType}
          </Button>
        </DialogActions>
      </Dialog>
      <Backdrop className={classes.backdrop} open={isLoading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Fragment>
  );
}
