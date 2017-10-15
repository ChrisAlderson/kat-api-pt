# kat-api-pt

[![Build Status](https://travis-ci.org/ChrisAlderson/kat-api-pt.svg?branch=master)](https://travis-ci.org/ChrisAlderson/kat-api-pt)
[![Coverage Status](https://coveralls.io/repos/github/ChrisAlderson/kat-api-pt/badge.svg?branch=master)](https://coveralls.io/github/ChrisAlderson/kat-api-pt?branch=master)
[![Dependency Status](https://david-dm.org/ChrisAlderson/kat-api-pt.svg)](https://david-dm.org/ChrisAlderson/kat-api-pt)
[![devDependency Status](https://david-dm.org/ChrisAlderson/kat-api-pt/dev-status.svg)](https://david-dm.org/ChrisAlderson/kat-api-pt#info=devDependencies)

A KickassTorrents API wrapper for NodeJs.

## Usage

#### Setup
```
npm install --save kat-api-pt
```

#### Initialize
```js
const KatApi = require('kat-api-pt')

const kat = new KatApi({
  baseUrl // The base url of kat.co. Defaults to 'https://kat.co/new/'
})
```

### Example usage

#### Simple search
```js
kat.search('westworld')
  .then(res => console.log(res))
  .catch(err => console.err(err));
```

#### Advanced search
```js
kat.search({
  query: 'westworld',
  category: 'tv_other',
  sortBy: 'seeders',
  orderBy: 'desc',
  language: 'english'
}).then(res => console.log(res))
  .catch(err => console.error(err));
```

## Response

Example of a response:

```js
{ response_time: 257,
  page: 1,
  total_results: 15,
  total_pages: 1,
  results: [...]
}
```

## Results

Example of one object from the `results` array:

```js
{
  title: 'Westworld S01E08 HDTV XviD B4ND1T69',
  category: 'TV',
  link: 'https://katcr.co/torrents-details.php?id=136488',
  verified: false,
  comments: 0,
  torrentLink: 'https://katcr.co/download.php?id=136488&name=',
  fileSize: '434.33 MB',
  size: 455428014,
  seeds: 3,
  leechs: 3,
  peers: 6
}
```

## Parameters

These are the parameters available for the advanced search:

 - query
 - category
 - language
 - page
 - sortBy
 - orderBy

### category

These are the available categories to search with:

 - anime_english_translated
 - anime_other
 - applications_handheld
 - applications_windows
 - applications_mac
 - applications_linux
 - applications_other
 - books_children
 - books_comics
 - books_manga
 - books_magazines
 - books_textbooks
 - books_fiction
 - books_non_fiction
 - books_audio_books
 - books_biography
 - books_religion
 - books_history
 - books_computers_technology
 - books_educational
 - books_cooking
 - books_sport
 - books_other
 - games_windows
 - games_linux
 - games_xbox
 - games_wii
 - games_handheld
 - games_playstation
 - games_other
 - movies_3d_movies
 - movies_hd
 - movies_screener
 - movies_ultrahd
 - movies_dubbed_movies
 - movies_asian_bollywood
 - movies_animation
 - movies_documentary
 - movies_other
 - movies_blu_ray_iso
 - movies_cam
 - movies_dvd_iso
 - music_mp3
 - music_lossless
 - music_radio_shows
 - music_aac
 - music_transcode
 - music_soundtrack
 - music_karaoke
 - music_videos_concerts
 - music_other
 - other_subtitles
 - other_pictures
 - other_other
 - other_tutorials
 - other_wordpress
 - other_dazposer
 - tv_dvd_iso
 - tv_blu_ray_iso
 - tv_hd
 - tv_documentary
 - tv_sport
 - tv_other
 - tv_ultra_hd
 - xxx_videos
 - xxx_hd
 - xxx_ultrahd
 - xxx_pictures
 - xxx_magazines
 - xxx_books
 - xxx_hentai
 - xxx_xxx_games

### Languages
 - all
 - english
 - bengali
 - chinese
 - dutch
 - french
 - german
 - greek
 - hindi
 - italian
 - japanese
 - korean
 - russian
 - spanish
 - tamil
 - telegu
 - turkish
 - unknown

### Sort
 - id
 - name
 - comments
 - size
 - completed
 - seeders
 - leechers

### Order
 - asc
 - desc

# License

MIT License

Copyright (c) 2017 - kat-api-pt - Released under the MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the 'Software'), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
