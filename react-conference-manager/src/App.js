import { useState } from 'react';

import ConferenceManager from './ConferenceManager';
import Swagger from './Swagger';

function App() {
  const [swagger, setSwagger] = useState(window.location.search === '?swagger');

  return swagger ? <Swagger /> : <ConferenceManager setSwagger={setSwagger} />;
}

export default App;
