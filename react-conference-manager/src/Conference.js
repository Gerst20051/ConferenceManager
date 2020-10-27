import { useState } from 'react';

import ConferenceAttendee from './ConferenceAttendee';
import ConferenceDetails from './ConferenceDetails';
import ConferenceTalk from './ConferenceTalk';

export default function Conference(props) {
  const [talk, setTalk] = useState();
  const [attendee, setAttendee] = useState();

  return (
    attendee
      ? <ConferenceAttendee attendee={attendee} />
      : talk
        ? <ConferenceTalk talk={talk} setAttendee={setAttendee} />
        : (
          <ConferenceDetails
            conference={props.conference}
            setTalk={setTalk}
            setAttendee={setAttendee}
          />
        )
  );
}
