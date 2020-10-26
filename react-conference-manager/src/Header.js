import { AppBar, Box, Typography } from '@material-ui/core';

export default function Header(props) {
  return (
    <AppBar position="static">
      <Box mx="auto" p={2}>
        <Typography variant="h4" align="center">
          {props.text}
        </Typography>
      </Box>
    </AppBar>
  );
}
