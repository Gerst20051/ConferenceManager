import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Paper, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import GroupIcon from '@material-ui/icons/Group';
import { Fragment, useState } from 'react';

import Conference from './Conference';
import ConferenceList from './ConferenceList';
import Header from './Header';

const useStyles = makeStyles(theme => ({
  leftHeaderIcon: {
    marginRight: theme.spacing(2),
  },
}));

export default function ConferenceManager() {
  const [conference, setConference] = useState();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({});
  const classes = useStyles();

  const handleAdd = () => {
    if (!form.conference_name) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
      setConference({
        id: 'tewsoidfj',
        name: form.conference_name,
      });
    }, 2000);
  };

  return (
    <Fragment>
      <Header text="Conference Manager" leftContent={
        conference
          ? (
            <ArrowBackIcon className={classes.leftHeaderIcon} onClick={() => {
              setConference();
            }} />
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
      <Dialog open={open} onClose={() => setOpen(false)}>
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
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          { isLoading
            ? <CircularProgress />
            : (
              <Button onClick={handleAdd} color="primary">
                Add
              </Button>
            )
          }
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}
