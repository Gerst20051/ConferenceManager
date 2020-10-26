import { useEffect, useState } from 'react';
import { Box, Typography } from '@material-ui/core';

export default function ConferenceList() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [conferences, setConferences] = useState([]);

  useEffect(() => {
    fetch('https://q8sxd5phn7.execute-api.us-east-1.amazonaws.com/dev/conferences')
      .then(res => res.json())
      .then(
        (result) => {
          setIsLoaded(true);
          setConferences(result);
        },
        (error) => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error Loading Conferences</div>;
  } else if (!isLoaded) {
    return <div>Loading Conferences...</div>;
  } else if (!conferences.length) {
    return <Box><br /><Typography>No Conferences Exist</Typography><br /></Box>;
  } else {
    return (
      <ul>
        {conferences.map(conference => (
          <li key={conference.id}>
            {conference.name}
          </li>
        ))}
      </ul>
    );
  }
}
