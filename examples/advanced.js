// Import the necessary modules.
/* eslint-disable no-console */
const KatApi = require('..')

// Create an instance of the API wrapper.
const kat = new KatApi()

// Advanced search
kat.search({
  query: 'westworld',
  category: 'tv_other',
  sortBy: 'seeders',
  orderBy: 'desc',
  language: 'english'
}).then(res => console.log(res))
  .catch(err => console.error(err))
