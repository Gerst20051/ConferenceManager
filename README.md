# ConferenceManager

Manage talks and attendees at a conference.

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

### Invoke Lambda (Locally)

[$]> `serverless invoke local -f app -l -d '{ "path": "/request" }'`

### Deploy Lambda To AWS

[$]> `serverless deploy`

### Invoke Lambda (AWS)

[$]> `serverless invoke -f app -l -d '{ "path": "/request" }'`

## Frontend Instructions

### Run Development Server

[$]> `npm start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Run Testing Scripts

[$]> `npm test`

### Build Production Deployment

[$]> `PUBLIC_URL=http://hnswave.co/conference-manager/ npm run build`
