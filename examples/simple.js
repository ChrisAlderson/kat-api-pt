// Import the neccesary modules.
const KAT = require("../kat-api-pt.js");

// Create an instance of the API wrapper.
const kat = new KAT();

// Simple search
kat.search("Anger Management")
  .then(res => console.log(res))
  .catch(err => console.err(err));
