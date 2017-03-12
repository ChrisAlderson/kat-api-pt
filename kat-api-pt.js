'use strict';

const bytes = require('bytes');
const cheerio = require('cheerio');
const got = require('got');

module.exports = class KAT {

  constructor({baseUrl = 'https://katcr.co/new/', debug = false} = {}) {
    this._baseUrl = baseUrl
    this.debug = debug;

    this._category = {
      anime: 'Anime',
      applications: 'Applications',
      books: 'Books',
      games: 'Games',
      movies: 'Movies',
      music: 'Music',
      other: 'Other',
      tv: 'TV',
      xxx: 'XXX'
    };
    this._lang = {
      'all': 0,
      'english': 1,
      'bengali': 10,
      'chinese': 11,
      'dutch': 12,
      'french': 2,
      'german': 3,
      'greek': 13,
      'hindi': 9,
      'italian': 4,
      'japanese': 14,
      'korean': 15,
      'russian': 7,
      'spanish': 6,
      'tamil': 16,
      'teleglu': 17,
      'turkish': 18,
      'unknown': 8
    };
    this._sort = {
      id: 'id',
      name: 'name',
      comments: 'comments',
      size: 'size',
      completed: 'times_completed',
      seeders: 'seeders',
      leechers: 'leechers'
    };
    this._order = {
      asc: 'asc',
      desc: 'desc'
    };
  }

  _get(uri, data = {}) {
    if (this._debug) console.warn(`Making request to: '${uri}', opts: ${JSON.stringify(opts)}`);

    return got(`${this._baseUrl}/${uri}`, {
      method: 'GET',
      query: data
    }).then(({body}) => body);
  }

  _formatPage(res, page, date) {
    const $ = cheerio.load(res);

    const data = $('p[align=center]').text();
    const total_results = parseInt(data.match(/(\d+)<</i)[1]);
    const total_pages = Math.ceil(total_results / 20);

    const result = {
      response_time: date,
      page: page,
      total_results,
      total_pages,
      results: []
    };

    $('tr.t-row').each(function() {
      const entry = $(this);

      const title = entry.find('a.cellMainLink').text();
      const category = entry.find('span[id*=cat_]').find('a').text();
      const link = `${this._baseUrl}entry.find('a.cellMainLink').attr('href')`;
      const verifiedTitle = entry.find('i.ka ka-verify').attr('title');
      const verified = verifiedTitle === 'Uploader' ? 0 : 1;
      const comments = parseInt(entry.find('a.icommentjs.kaButton.smallButton.rightButton').text());
      // const magnet = $(this).find('a.icon16[data-nop]').attr('href');
      const torrentLink = `${this._baseUrl}$(this).find('a.icon16[data-download]').attr('href')`;
      const fileSize = entry.find('td.ttable_col2').eq(0).text();
      const size = bytes(fileSize);
      const pubDate = Number(new Date(entry.find('td.ttable_col1').eq(1).text()));
      const seeds = parseInt(entry.find('td.ttable_col2').eq(1).text(), 10);
      const leechs = parseInt(entry.find('td.ttable_col1').eq(2).text(), 10);
      const peers = seeds + leechs;

      result.results.push({
        title,
        category,
        link,
        verified,
        comments,
        // magnet
        torrentLink,
        fileSize,
        size,
        pubDate,
        seeds,
        leechs,
        peers
      });
    });

    return result;
  }

  _getData({category, query, page = 1, incldead, freeleech, inclexternal, language, sort_by = 'id', order = 'desc'}, date) {
    if (category && !this._category[category]) {
      throw new Error(`'${category}' is not a valid value for category`);
    } else {
      category = this._category[category];
    }
    if (language && !this._lang[language]) {
      throw new Error(`'${language}' is not a valid value for lang`);
    } else {
      language = this._lang[language];
    }
    if (sort_by && !this._sort[sort_by]) {
      throw new Error(`'${sort_by}' is not a valid value for sort`);
    } else {
      sort_by = this._sort[sort_by];
    }
    if (order && !this._order[order]) {
      throw new Error(`'${order}' is not a valid value for order`);
    } else {
      order = this._order[order];
    }

    return this._get('torrents-search.php', {
      category,
      search: query,
      page,
      incldead,
      freeleech,
      inclexternal,
      lang: language,
      sort: sort_by,
      order
    }).then(res => this._formatPage(res, page, Date.now() - date));
  }

  search(query) {
    const date = Date.now();

    if (typeof(query) === 'string') {
      return this._getData({ query }, date);
    } else if (typeof(query) === 'object') {
      return this._getData(query, date);
    }

    throw new Error('search needs an object or string as a parameter!');
  }

}
