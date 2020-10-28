const dev = {
  API_URL: 'http://localhost:3000/dev',
};

const prod = {
  API_URL: 'https://q8sxd5phn7.execute-api.us-east-1.amazonaws.com/dev',
};

const config = process.env.NODE_ENV === 'production' ? prod : dev;

export default {
  ...config,
};
