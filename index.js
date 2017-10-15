// Import the necessary modules.
const bytes = require('bytes')
const cheerio = require('cheerio')
const debug = require('debug')
const got = require('got')
const { stringify } = require('querystring')

const { name } = require('./package')

/**
 * @typedef {Object} Response
 * @property {Date} response_time The response_time of the response.
 * @property {number} page The page of the response.
 * @property {number} total_results The total_results of the response.
 * @property {number} total_pages The total_pages of the response.
 * @property {Array<Torrent>} results The results of the response.
 */

/**
 * The model of the torrent object
 * @typedef {Object} Torrent
 * @property {string} title The title of the torrent.
 * @property {string} category The category of the torrent.
 * @property {string} link The link of the torrent.
 * @property {boolean} verified The verified of the torrent.
 * @property {number} comments The comments of the torrent.
 * @property {string} torrentLink The torrentLink of the torrent.
 * @property {string} fileSize The fileSize of the torrent.
 * @property {number} size The size of the torrent.
 * @property {numer} seeds The seeds of the torrent.
 * @property {number} leechs The leechs of the torrent.
 * @property {number} peers The peers of the torrent.
 */

/**
 * A KickassTorrents API wrapper.
 * @type {KatApi}
 */
module.exports = class KatApi {

  /**
   * Create a new instance of the module.
   * @param {!Object} config={} - The configuration object for the module.
   * @param {!string} baseUrl=https://katcr.co/ - The base url of katcr.
   * @type {String}
   */
  constructor({baseUrl = 'https://katcr.co/'} = {}) {
    /**
      * The base url of katcr.
      * @type {string}
      */
    this._baseUrl = baseUrl
    /**
      * Show extra output.
      * @type {Function}
      */
    this._debug = debug(name)
    /**
     * The available categories to search for.
     * @type {Object}
     */
    this._category = {
      anime_english_translated: 118,
      anime_other: 133,
      applications_handheld: 144,
      applications_windows: 139,
      applications_mac: 140,
      applications_linux: 142,
      applications_other: 131,
      books_children: 102,
      books_comics: 103,
      books_manga: 104,
      books_magazines: 105,
      books_textbooks: 106,
      books_fiction: 107,
      books_non_fiction: 108,
      books_audio_books: 109,
      books_biography: 110,
      books_religion: 111,
      books_history: 112,
      books_computers_technology: 113,
      books_educational: 114,
      books_cooking: 115,
      books_sport: 116,
      books_other: 132,
      games_windows: 85,
      games_linux: 87,
      games_xbox: 90,
      games_wii: 91,
      games_handheld: 92,
      games_playstation: 97,
      games_other: 130,
      movies_3d_movies: 69,
      movies_hd: 71,
      movies_screener: 74,
      movies_ultrahd: 75,
      movies_dubbed_movies: 78,
      movies_asian_bollywood: 79,
      movies_animation: 80,
      movies_documentary: 81,
      movies_other: 128,
      movies_blu_ray_iso: 148,
      movies_cam: 149,
      movies_dvd_iso: 150,
      music_mp3: 22,
      music_lossless: 23,
      music_radio_shows: 26,
      music_aac: 64,
      music_transcode: 65,
      music_soundtrack: 66,
      music_karaoke: 67,
      music_videos_concerts: 68,
      music_other: 129,
      other_subtitles: 134,
      other_pictures: 136,
      other_other: 138,
      other_tutorials: 145,
      other_wordpress: 153,
      other_dazposer: 154,
      tv_dvd_iso: 5,
      tv_blu_ray_iso: 6,
      tv_hd: 41,
      tv_documentary: 7,
      tv_sport: 146,
      tv_other: 151,
      tv_ultra_hd: 152,
      xxx_videos: 119,
      xxx_hd: 155,
      xxx_ultrahd: 121,
      xxx_pictures: 122,
      xxx_magazines: 123,
      xxx_books: 124,
      xxx_hentai: 125,
      xxx_xxx_games: 126
    }
    /**
     * The available languages to search for.
     * @type {Object}
     */
    this._lang = {
      all: 0,
      english: 1,
      bengali: 10,
      chinese: 11,
      dutch: 12,
      french: 2,
      german: 3,
      greek: 13,
      hindi: 9,
      italian: 4,
      japanese: 14,
      korean: 15,
      russian: 7,
      spanish: 6,
      tamil: 16,
      telegu: 17,
      turkish: 18,
      unknown: 8
    }
    /**
     * The available ways to sort the results by.
     * @type {Object}
     */
    this._sort = {
      id: 'id',
      name: 'name',
      comments: 'comments',
      size: 'size',
      completed: 'times_completed',
      seeders: 'seeders',
      leechers: 'leechers'
    }
    /**
     * The available ways to order the results by.
     * @type {Object}
     */
    this._order = {
      asc: 'asc',
      desc: 'desc'
    }
  }

  /**
   * Make a get request to kat.co.
   * @param {!string} endpoint - The endpoint to make the request to.
   * @param {?Object} query - The query parameters of the HTTP request.
   * @returns {Promise<Function, Error>} - The response body wrapped in
   * cheerio.
   */
  _get(endpoint, query) {
    const uri = `${this._baseUrl}${endpoint}`
    const opts = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
      },
      query
    }

    this._debug(`Making request to: '${uri}?${stringify(query)}'`)

    return got.get(uri, opts)
      .then(({ body }) => cheerio.load(body))
  }

  /**
   * Format the result page in the response object.
   * @param {!Object} $ - The cheerio loaded body.
   * @param {!number} page - The page of the torrent to find.
   * @param {!Date} date - The date the query was started.
   * @returns {Response} - The response of a query.
   */
  _formatPage($, page, date) {
    const data = $('a.button.button--gray').last().text()
    const totalResults = data ? parseInt(data.match(/(\d+)$/i)[1], 10) : 0
    const totalPages = Math.ceil(totalResults / 15)

    const result = {
      response_time: date,
      page,
      total_results: totalResults,
      total_pages: totalPages,
      results: []
    }

    const _this = this
    $('tr.t-row').each(function () {
      const entry = $(this)

      const title = entry.find('a.cellMainLink').text()

      const category = entry.find('span[id*=cat_]').find('a').text()
      const link = `${_this._baseUrl}${entry.find('a.cellMainLink').attr('href')}`
      const verifiedTitle = entry.find('i.ka ka-verify').attr('title')
      const verified = verifiedTitle === 'Uploader'
      const comments = parseInt(
        entry.find('a.icommentjs.kaButton.smallButton.rightButton').text(), 10
      )
      const torrentLink = `${_this._baseUrl}${$(this).find('a.icon16[data-download]').attr('href')}`
      const fileSize = entry.find('td.ttable_col2').eq(0).text()
      const size = bytes(fileSize)
      let seeds = parseInt(entry.find('td.ttable_col2').eq(1).text(), 10)
      seeds = !isNaN(seeds) ? seeds : 0
      let leechs = parseInt(entry.find('td.ttable_col1').eq(2).text(), 10)
      leechs = !isNaN(leechs) ? leechs : 0
      const peers = seeds + leechs

      result.results.push({
        title,
        category,
        link,
        verified,
        comments,
        torrentLink,
        fileSize,
        size,
        seeds,
        leechs,
        peers
      })
    })

    return result
  }

  /**
   * Make an advanced search.
   * @param {!Object} config - The config of the advanced query object.
   * @param {!string} [config.category] - The category of the torrents to find.
   * @param {!string} config.query - The keywords to search for.
   * @param {?number} [config.page=1] - The page of the torrent to find.
   * @param {?number} [config.language] - The language of the torrents to find.
   * @param {?string} [config.sortBy='id'] - The way to sort the results by.
   * @param {?string} [config.orderBy='desc'] - The way to order the results by.
   * @param {!Date} date - The date the query was started.
   * @returns {Promise<Resonse, Error>} - The response of an advanced search.
   */
  _getData({
    category,
    query,
    page = 1,
    language,
    sortBy = 'id',
    orderBy = 'desc'
  }, date) {
    let err
    if (category && !this._category[category]) {
      err = new Error(`'${category}' is not a valid value for category`)
      return Promise.reject(err)
    }
    if (language && !this._lang[language]) {
      err = new Error(`'${language}' is not a valid value for lang`)
    }
    if (sortBy && !this._sort[sortBy]) {
      err = new Error(`'${sortBy}' is not a valid value for sort`)
    }
    if (orderBy && !this._order[orderBy]) {
      err = new Error(`'${orderBy}' is not a valid value for order`)
    }

    if (err) {
      return Promise.reject(err)
    }

    const cat = this._category[category]
    const lang = this._lang[language]
    const sort = this._sort[sortBy]
    const order = this._order[orderBy]

    return this._get('/new/search-torrents.php', {
      search: query,
      cat,
      page,
      lang,
      sort,
      order
    }).then(res => this._formatPage(res, page, Date.now() - date))
  }

  /**
   * Search for content on katcr.co.
   * @param {Object|string} query - Object for advanced search, string for
   * simple search.
   * @returns {Promise<Response, Error>} - The response object of the query.
   */
  search(query) {
    const date = Date.now()

    if (typeof (query) === 'string') {
      return this._getData({ query }, date)
    } else if (typeof (query) === 'object') {
      return this._getData(query, date)
    }

    const err = new Error('search needs an object or string as a parameter!')
    return Promise.reject(err)
  }

}
