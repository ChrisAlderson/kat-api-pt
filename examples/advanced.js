// Import the neccesary modules.
const KAT = require('../kat-api-pt.js');

// Create an instance of the API wrapper.
const kat = new KAT();

// Advanced search
kat.search({
  query: 'ettv',
  category: 'tv',
  sort_by: 'seeders',
  order: 'desc',
  language: 'en'
}).then(res => console.log(res))
  .catch(err => console.error(err));
