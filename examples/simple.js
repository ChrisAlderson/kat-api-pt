// Import the neccesary modules.
import katApi from "../index.es6";

// Simple search
katApi.search("Anger Management")
  .then(res => console.log(res))
  .catch(err => console.err(err));
