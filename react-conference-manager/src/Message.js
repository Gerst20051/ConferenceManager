import { useEffect, useState } from 'react';

export default function Message() {
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('https://q8sxd5phn7.execute-api.us-east-1.amazonaws.com/dev/request')
      .then(res => res.json())
      .then(
        result => {
          setIsLoaded(true);
          setMessage(result.message);
        },
        error => {
          setIsLoaded(true);
          setError(error);
        }
      );
  }, []);

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return <div>Message: {message}</div>;
  }
}
