import { useEffect, useState } from 'react';

import ConferenceAttendee from './ConferenceAttendee';
import ConferenceDetails from './ConferenceDetails';
import ConferenceTalk from './ConferenceTalk';

export default function Conference(props) {
  const [talk, setTalk] = useState();
  const [attendee, setAttendee] = useState();
  const [backClickCount, setBackClickCount] = useState(props.backClickCount);

  props.setBackButtonEnabled(!talk && !attendee);
  props.setShowAddIcon(
    (!attendee && !talk)
    || (!attendee && talk && props.conference.attendees.length)
  );

  useEffect(() => {
    if (backClickCount < props.backClickCount) {
      setBackClickCount(props.backClickCount);
      if (attendee) {
        props.setAttendee();
        setAttendee();
      } else if (talk) {
        props.setTalk();
        setTalk();
      }
      return;
    }
    props.setAttendee(attendee);
    props.setTalk(talk);
  }, [props, attendee, talk, backClickCount]);

  return (
    attendee
      ? (
        <ConferenceAttendee
          attendee={attendee}
          conference={props.conference}
          talk={talk}
          setTalk={setTalk}
          setAttendee={setAttendee} />
      )
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
