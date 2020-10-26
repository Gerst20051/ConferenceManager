import { Box, Typography } from '@material-ui/core';

export default function Conference(props) {
  return (
    <Box><br /><Typography>{ props.conference.name }</Typography><br /></Box>
  );
}
