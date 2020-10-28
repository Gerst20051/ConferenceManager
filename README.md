# ConferenceManager

Manage talks and attendees for conferences.

Open [http://hnswave.co/conference-manager/](http://hnswave.co/conference-manager/) to view it in the browser.

## Setup Repo

[$]> `mkdir ConferenceManager && cd $_`

[$]> `echo 'v12.19.0' > .nvmrc && nvm use`

https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtimes.html

### Install Dependencies

1. Serverless `npm install -g serverless`
2. Create React App `npm install -g create-react-app`

### Setup Provider Credentials

https://github.com/serverless/serverless/blob/master/docs/providers/aws/guide/credentials.md

### Create Backend Service

[$]> `serverless create --template aws-nodejs --path conference-manager`

https://github.com/serverless/serverless

### Create Frontend App

[$]> `npx create-react-app react-conference-manager --use-npm`

https://github.com/facebook/create-react-app

## Backend Instructions

[$]> `cd conference-manager`

[$]> `npm i`

### Start Docker DynamoDB

[$]> `npm run start:dynamodb`

### Start DynamoDB Admin (Optional)

[$]> `npm run start:dynamodb:admin`

### Start Serverless Offline (Locally)

[$]> `npm start` => `sls offline start`

### Invoke Lambda (Locally)

[$]> `serverless invoke local -f app -l -d '{ "path": "/request" }'`

### Deploy Lambda To AWS

[$]> `serverless deploy`

### Invoke Lambda (AWS)

[$]> `serverless invoke -f app -l -d '{ "path": "/request" }'`

## Frontend Instructions

[$]> `cd react-conference-manager`

[$]> `npm i`

### Run Development Server

[$]> `npm start` => `PORT=4000 react-scripts start`

Open [http://localhost:4000](http://localhost:4000) to view it in the browser.

### Run Testing Scripts

[$]> `npm test`

### Build Production Deployment

[$]> `npm run build` => `PUBLIC_URL=http://hnswave.co/conference-manager/ npm run build`
