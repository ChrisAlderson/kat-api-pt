// Import the API wrapper.
import KatAPI from "../kat-api-pt";

// Create an instance of the API wrapper.
const kat = new KatAPI();

// Simple search
kat.search("Anger Management")
  .then(res => console.log(res))
  .catch(err => console.err(err));
