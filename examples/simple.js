// Import the necessary modules.
/* eslint-disable no-console */
const KatApi = require('..')

// Create an instance of the API wrapper.
const kat = new KatApi()

// Simple search
kat.search('westworld')
  .then(res => console.log(res))
  .catch(err => console.error(err))
