// Import the neccesary modules.
import katApi from "../index.es6";

// Advanced search
katApi.search({
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
