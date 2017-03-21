# kat-api-pt

[![Build Status](https://travis-ci.org/ChrisAlderson/kat-api-pt.svg?branch=master)](https://travis-ci.org/ChrisAlderson/kat-api-pt)
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
const KAT = require('kat-api-pt');

const kat = new KAT({[baseUrl, debug]});
```

### Example usage

#### Simple search
```js
kat.search('ettv')
  .then(res => console.log(res))
  .catch(err => console.err(err));
```

#### Advanced search
```js
kat.search({
  query: 'ettv',
  category: 'tv',
  sort_by: 'seeders',
  order: 'desc',
  language: 'en'
}).then(res => console.log(res))
  .catch(err => console.error(err));
```

## Response

Example of a response:

```js
{
	response_time: 1066,
	page: 1,
	total_results: 487,
	total_pages: '20',
	results: [...]
}
```

## Results

Example of one object from the `results` array:

```js
{
	title: 'Anger Management (2003) 720p BrRip x264 - 650MB - YIFY',
	category: 'Highres Movies',
	link: '/anger-management-2003-720p-brrip-x264-650mb-yify-t6490832.html',
	verified: 1,
	comments: 106,
	torrentLink: '//torcache.net/torrent/108C481959274F982AB442F3A83CCEA684519801.torrent?title=[kat.cr]anger.management.2003.720p.brrip.x264.650mb.yify',
	fileSize: '650.44 MB',
	size: 682035773,
	files: 3,
	pubDate: 1341724680000,
	seeds: 57,
	leechs: 6,
	peers: 63
}
```

## Parameters

These are the parameters available for the advanced search:

 - query
 - category
 - language
 - page
 - sort_by
 - order
 - incldead
 - freeleech
 - inclexternal

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
