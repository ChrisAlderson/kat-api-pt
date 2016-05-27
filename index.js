"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require("babel-runtime/regenerator");

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require("babel-runtime/helpers/asyncToGenerator");

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _typeof2 = require("babel-runtime/helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

var _bytes = require("bytes");

var _bytes2 = _interopRequireDefault(_bytes);

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

var _request = require("request");

var _request2 = _interopRequireDefault(_request);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var defaultOptions = {
  "headers": {
    "Accept-Encoding": "gzip, deflate"
  },
  "gzip": true,
  "timeout": 3 * 1000
};

/**
 * @class
 * @classdesc The factory function for getting information from {@link http://kat.cr/}.
 * @memberof module:lib/kat
 * @property {Array} BASE_URLS - An array of KAT proxies.
 * @property {Object} request - The request object with added defaults.
 * @property {Object} katPlatformMap - Map object for the platform codes.
 * @property {Object} katLanguageMap - Map object for the language codes.
 */
// Import the neccesary modules.
var KAT = function KAT() {
  var options = arguments.length <= 0 || arguments[0] === undefined ? defaultOptions : arguments[0];


  var BASE_URLS = ["https://kat.cr/usearch/", "https://kickassto.co/usearch/"];
  var request = _request2.default.defaults(options);

  var katPlatformMap = {
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

  var katLanguageMap = {
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
   * @memberof module:lib/kat
   * @param {DOM} response - The body from `requestData`.
   * @param {Integer} page - The page number form the search request.
   * @param {Date} date - Date used for the response time.
   * @returns {Object} - A formatted object of the page.
   */
  var formatPage = function formatPage(response, page, date) {
    var $ = _cheerio2.default.load(response);

    var matcher = /\s+[a-zA-Z]+\s\d+[-]\d+\s[a-zA-Z]+\s(\d+)/;
    var totalResults = $("table#mainSearchTable.doublecelltable").find("h2").find("span").text().match(matcher);
    var totalPages = $("div.pages.botmarg5px.floatright").children("a.turnoverButton.siteButton.bigButton").last().text();

    var formatted = {
      response_time: parseInt(date),
      page: parseInt(page),
      totalResults: parseInt(totalResults[1]),
      totalPages: totalPages ? totalPages : 1,
      results: []
    };

    $("table.data").find("tr[id]").each(function () {
      var torrent = {
        title: $(this).find("a.cellMainLink").text(),
        category: $(this).find("span.font11px.lightgrey.block").find("a[href]").last().text(),
        link: $(this).find("a.cellMainLink[href]").attr("href"),
        guid: $(this).find("a.cellMainLink[href]").attr("href"),
        verified: $(this).find("i.ka.ka16.ka-verify.ka-green").length,
        comments: parseInt($(this).find("a.icommentjs.kaButton.smallButton.rightButton").text()),
        magnet: $(this).find("a.icon16[data-nop]").attr("href"),
        torrentLink: $(this).find("a.icon16[data-download]").attr("href"),
        fileSize: $(this).find("td.center").eq(0).text(),
        size: (0, _bytes2.default)($(this).find("td.center").eq(0).text()),
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
   * @memberof module:lib/kat
   * @param {String} url - The base url of the request
   * @param {String} endpoint - The endpoint for the request
   * @param {Boolean} retry - Retry the function (Default `true`).
   * @returns {Promise} - The body of the request.
   */
  var requestData = function requestData(url, endpoint) {
    var retry = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

    return new Promise(function (resolve, reject) {
      request(url + endpoint, function (err, res, body) {
        if (err && retry) {
          return resolve(requestData(BASE_URLS[1], endpoint, false));
        } else if (err) {
          return reject(err + " with link: '" + endpoint + "'");
        } else if (!body || res.statusCode >= 400) {
          return reject("Could not load data from: '" + endpoint + "'");
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
  var makeEndpoint = function makeEndpoint(query) {
    var endpoint = "";

    if (!query) {
      console.error("Field 'query' is required.");
    } else if (typeof query === "string") {
      endpoint += query;
    } else if ((typeof query === "undefined" ? "undefined" : (0, _typeof3.default)(query)) === "object") {
      if (query.query) endpoint += query.query;
      if (query.category) endpoint += " category:" + query.category;
      if (query.uploader) endpoint += " user:" + query.uploader;
      if (query.min_seeds) endpoint += " seeds:" + query.min_seeds;
      if (query.age) endpoint += " age:" + query.age;
      if (query.min_files) endpoint += " files:" + query.min_files;
      if (query.imdb) endpoint += " imdb:" + query.imdb.replace(/\D/g, "");
      if (query.tvrage) endpoint += " tv:" + query.tvrage;
      if (query.isbn) endpoint += " isbn:" + query.isbn;
      if (query.language) {
        var languageCode = katLanguageMap[query.language] !== undefined ? katLanguageMap[query.language] : "";
        endpoint += " lang_id:" + languageCode;
      }
      if (query.adult_filter) endpoint += " is_safe:" + query.adult_filter;
      if (query.verified) endpoint += " verified:" + query.verified;
      if (query.season) endpoint += " season:" + query.season;
      if (query.episode) endpoint += " episode:" + query.episode;
      if (query.platform_id) {
        var platformCode = katPlatformMap[query.platform_id] !== undefined ? katPlatformMap[query.platform_id] : "";
        endpoint += " platform_id:" + platformCode;
      }
      if (query.page) endpoint += "/" + query.page;
      if (query.sort_by) endpoint += "/?field=" + query.sort_by;
      if (query.order) endpoint += "&order=" + query.order;
    } else {
      console.err("Not a valid query.");
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
  var search = function () {
    var ref = (0, _asyncToGenerator3.default)(_regenerator2.default.mark(function _callee(query) {
      var endpoint, t, data;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              endpoint = makeEndpoint(query);
              t = Date.now();
              _context.next = 5;
              return requestData(BASE_URLS[0], endpoint);

            case 5:
              data = _context.sent;
              return _context.abrupt("return", formatPage(data, query.page || 1, Date.now() - t));

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);

              console.error("Encoutered an error: " + _context.t0);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined, [[0, 9]]);
    }));
    return function search(_x3) {
      return ref.apply(this, arguments);
    };
  }();

  // Return the public functions.
  return {
    search: search
  };
};

// Export the kat factory function.
exports.default = KAT();
