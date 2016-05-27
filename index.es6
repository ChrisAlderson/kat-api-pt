// Import the neccesary modules.
import bytes from "bytes";
import cheerio from "cheerio";
import req from "request";

// The default request options
const defaultOptions = {
  "headers": {
    "Accept-Encoding": "gzip, deflate"
  },
  "gzip": true,
  "timeout": 1 * 1000
};

/**
 * @class
 * @classdesc The factory function for getting information from {@link http://kat.cr/}.
 * @property {Array} BASE_URLS - An array of KAT proxies.
 * @property {Object} request - The request object with added defaults.
 * @property {Object} katPlatformMap - Map object for the platform codes.
 * @property {Object} katLanguageMap - Map object for the language codes.
 */
const KAT = (options = defaultOptions) => {

  const BASE_URLS = ["https://kat.cr/usearch/", "https://kickassto.co/usearch/"];
  const request = req.defaults(options);

  const katPlatformMap = {
    "android": 4,
    "blackberry": 7,
    "gamecube": 15,
    "ipad": 18,
    "iphone": 19,
    "ipod": 20,
    "java": 22,
    "linux": 24,
    "mac": 25,
    "nintendo3-ds": 31,
    "nintendo-ds": 33,
    "dvd": 35,
    "other": 65,
    "palm-os": 37,
    "pc": 38,
    "ps2": 43,
    "ps3": 44,
    "ps4": 66,
    "psp": 45,
    "symbian": 52,
    "wii": 56,
    "wiiu": 68,
    "windows-ce": 57,
    "windows-mobile": 58,
    "windows-phone": 59,
    "xbox": 61,
    "xbox-360": 62,
    "xbox-one": 67
  };

  const katLanguageMap = {
    "en": 2,
    "sq": 42,
    "ar": 7,
    "eu": 44,
    "bn": 46,
    "pt-br": 39,
    "bg": 37,
    "yue": 45,
    "ca": 47,
    "zh": 10,
    "hr": 34,
    "cs": 32,
    "da": 26,
    "nl": 8,
    "tl": 11,
    "fi": 31,
    "fr": 5,
    "de": 4,
    "el": 30,
    "he": 25,
    "hi": 6,
    "hu": 27,
    "it": 3,
    "ja": 15,
    "kn": 49,
    "ko": 16,
    "lt": 43,
    "ml": 21,
    "cmn": 23,
    "ne": 48,
    "no": 19,
    "fa": 33,
    "pl": 9,
    "pt": 17,
    "pa": 35,
    "ro": 18,
    "ru": 12,
    "sr": 28,
    "sl": 36,
    "es": 14,
    "sv": 20,
    "ta": 13,
    "te": 22,
    "th": 24,
    "tr": 29,
    "uk": 40,
    "vi": 38
  };

  /**
   * @description Formats the info from a given search page.
   * @function KAT#formatPage
   * @param {DOM} response - The body from `requestData`.
   * @param {Integer} page - The page number form the search request.
   * @param {Date} date - Date used for the response time.
   * @returns {Object} - A formatted object of the page.
   */
  const formatPage = (response, page, date) => {
    const $ = cheerio.load(response);

    const matcher = /\s+[a-zA-Z]+\s\d+[-]\d+\s[a-zA-Z]+\s(\d+)/;
    const totalResults = $("table#mainSearchTable.doublecelltable").find("h2").find("span").text().match(matcher);
    const totalPages = $("div.pages.botmarg5px.floatright").children("a.turnoverButton.siteButton.bigButton").last().text();

    const formatted = {
      response_time: parseInt(date),
      page: parseInt(page),
      totalResults: parseInt(totalResults[1]),
      totalPages: totalPages ? totalPages : 1,
      results: []
    };

    $("table.data").find("tr[id]").each(function () {
      const torrent = {
        title: $(this).find("a.cellMainLink").text(),
        category: $(this).find("span.font11px.lightgrey.block").find("a[href]").last().text(),
        link: $(this).find("a.cellMainLink[href]").attr("href"),
        guid: $(this).find("a.cellMainLink[href]").attr("href"),
        verified: $(this).find("i.ka.ka16.ka-verify.ka-green").length,
        comments: parseInt($(this).find("a.icommentjs.kaButton.smallButton.rightButton").text()),
        magnet: $(this).find("a.icon16[data-nop]").attr("href"),
        torrentLink: $(this).find("a.icon16[data-download]").attr("href"),
        fileSize: $(this).find("td.center").eq(0).text(),
        size: bytes($(this).find("td.center").eq(0).text()),
        files: parseInt($(this).find("td.center").eq(1).text()),
        pubDate: Number(new Date($(this).find("td.center").eq(2).attr("title"))),
        seeds: parseInt($(this).find("td.center").eq(3).text()),
        leechs: parseInt($(this).find("td.center").eq(4).text())
      };
      torrent.peers = torrent.seeds + torrent.leechs;
      formatted.results.push(torrent);
    });

    return formatted;
  };

  /**
   * @description Request the data from {@link https://kat.cr/} with an endpoint.
   * @function KAT#requestData
   * @param {String} url - The base url of the request
   * @param {String} endpoint - The endpoint for the request
   * @param {Boolean} [retry=true] - Retry the request.
   * @returns {Promise} - The body of the request.
   */
  const requestData = (url, endpoint, retry = true) => {
    return new Promise((resolve, reject) => {
      request(url + endpoint, (err, res, body) => {
        if (err && retry) {
          return resolve(requestData(BASE_URLS[1], endpoint, false));
        } else if (err) {
          return reject(`${err.code} with link: '${endpoint}'`);
        } else if (!body || res.statusCode >= 400) {
          return reject(`Could not load data from: '${endpoint}'`);
        } else {
          return resolve(body);
        }
      });
    });
  };

  /**
   * @description Makes an endpoint for the request.
   * @function KAT#makeEndpoint
   * @memberof module:lib/kat
   * @param {Object} query - Contains values which will determine the
   * endpoint.
   * @returns {String} - An endpoint for {@link https://kat.cr/}
   */
  const makeEndpoint = query => {
    let endpoint = "";

    if (!query) {
      return new Error(`Field 'query' is required.`);
    } else if (typeof (query) === "string") {
      endpoint += query;
    } else if (typeof (query) === "object") {
      if (query.query) endpoint += query.query;
      if (query.category) endpoint += ` category:${query.category}`;
      if (query.uploader) endpoint += ` user:${query.uploader}`;
      if (query.min_seeds) endpoint += ` seeds:${query.min_seeds}`;
      if (query.age) endpoint += ` age:${query.age}`;
      if (query.min_files) endpoint += ` files:${query.min_files}`;
      if (query.imdb) endpoint += ` imdb:${query.imdb.replace(/\D/g, "")}`;
      if (query.tvrage) endpoint += ` tv:${query.tvrage}`;
      if (query.isbn) endpoint += ` isbn:${query.isbn}`;
      if (query.language) {
        const languageCode = katLanguageMap[query.language] !== undefined ? katLanguageMap[query.language] : "";
        endpoint += ` lang_id:${languageCode}`;
      }
      if (query.adult_filter) endpoint += ` is_safe:${query.adult_filter}`;
      if (query.verified) endpoint += ` verified:${query.verified}`;
      if (query.season) endpoint += ` season:${query.season}`;
      if (query.episode) endpoint += ` episode:${query.episode}`;
      if (query.platform_id) {
        const platformCode = katPlatformMap[query.platform_id] !== undefined ? katPlatformMap[query.platform_id] : "";
        endpoint += ` platform_id:${platformCode}`;
      }
      if (query.page) endpoint += `/${query.page}`;
      if (query.sort_by) endpoint += `/?field=${query.sort_by}`;
      if (query.order) endpoint += `&order=${query.order}`;
    } else {
      return new Error("Not a valid query.");
    }

    return endpoint;
  };

  /**
   * @description Returns the formated data from a search request.
   * @function KAT#search
   * @memberof module:lib/kat
   * @param {Object} query - The query object/string to query kickass.
   * @returns {Object} - The the content of the search results and some metadata
   * about the search.
   */
  const search = async query => {
    try {
      const endpoint = makeEndpoint(query);
      const t = Date.now();
      const data = await requestData(BASE_URLS[0], endpoint);
      return formatPage(data, query.page || 1, Date.now() - t);
    } catch (err) {
      return new Error(err);
    }
  };

  // Return the public functions.
  return {
    search
  };

};

// Export the kat factory function.
export default KAT();
