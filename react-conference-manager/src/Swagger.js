import 'swagger-ui-react/swagger-ui.css';

import SwaggerUI from 'swagger-ui-react';

import config from './config';

function Swagger() {
  return <SwaggerUI url={config.SWAGGER_URL} />;
}

export default Swagger;
