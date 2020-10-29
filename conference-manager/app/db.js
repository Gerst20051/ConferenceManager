const AWS = require('aws-sdk');
const { ATTENDEES_TABLE, CONFERENCES_TABLE, IS_OFFLINE, TALKS_TABLE } = process.env;

const dynamoDb = new AWS.DynamoDB.DocumentClient(
  IS_OFFLINE === 'true'
    ? {
      region: 'localhost',
      endpoint: 'http://localhost:8000',
    }
    : undefined
);

module.exports = {
  getAttendeesByIds: async (attendeeIds) => {
    if (!attendeeIds.length) return [];
    const params = { RequestItems: {} };
    params.RequestItems[ATTENDEES_TABLE] = {
      Keys: attendeeIds.map(attendeeId => ({ id: attendeeId })),
    };
    const result = await dynamoDb.batchGet(params).promise();
    return result.Responses[ATTENDEES_TABLE];
  },
  getConferenceById: async (id) => {
    const result = await dynamoDb.get({
      TableName: CONFERENCES_TABLE,
      Key: { id },
    }).promise();
    return result.Item;
  },
  getConferences: async () => {
    const result = await dynamoDb.scan({
      TableName: CONFERENCES_TABLE,
    }).promise();
    return result.Items;
  },
  getTalkById: async (id) => {
    const result = await dynamoDb.get({
      TableName: TALKS_TABLE,
      Key: { id },
    }).promise();
    return result.Item;
  },
  getTalksByIds: async (talkIds) => {
    if (!talkIds.length) return [];
    const params = { RequestItems: {} };
    params.RequestItems[TALKS_TABLE] = {
      Keys: talkIds.map(talkId => ({ id: talkId })),
    };
    const result = await dynamoDb.batchGet(params).promise();
    return result.Responses[TALKS_TABLE];
  },
  putAttendee: async (attendee) => {
    const params = {
      TableName: ATTENDEES_TABLE,
      Item: attendee,
    };
    const result = await dynamoDb.put(params).promise();
    return result;
  },
  putConference: async (conference) => {
    const params = {
      TableName: CONFERENCES_TABLE,
      Item: conference,
    };
    const result = await dynamoDb.put(params).promise();
    return result;
  },
  putTalk: async (talk) => {
    const params = {
      TableName: TALKS_TABLE,
      Item: talk,
    };
    const result = await dynamoDb.put(params).promise();
    return result;
  },
};
