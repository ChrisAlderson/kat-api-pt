// Import the API wrapper.
import KatAPI from "../kat-api-pt";

// Create an instance of the API wrapper.
const kat = new KatAPI();

// Advanced search
kat.search({
    query: "Anger Management",
    category: "tv",
    min_seeds: "3",
    uploader: "ettv",
    sort_by: "seeders",
    order: "desc",
    verified: 1,
    language: "en"
  })
  .then(res => console.log(res))
  .catch(err => console.error(err));
