# kat-api-pt

A KickassTorrents api wrapper heavily based on the [kat-api](https://github.com/paulhobbel/kat-api) module of [paulhobbel](https://github.com/paulhobbel).

## Simple search

Example of a simple search:

```javascript
katApi.search("Anger Management")
  .then(res => console.log(res))
  .catch(err => console.err(err));
```

## Advanced search

Example of an advanced search:

```javascript
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
```

## Response

Example of a response:

```js
{
	response_time: 1066,
	page: 1,
	totalResults: 487,
	totalPages: "20",
	results: [...]
}
```

## Results

Example of one object from the `results` array:

```js
{
	title: "Anger Management (2003) 720p BrRip x264 - 650MB - YIFY",
	category: "Highres Movies",
	link: "/anger-management-2003-720p-brrip-x264-650mb-yify-t6490832.html",
	guid: "/anger-management-2003-720p-brrip-x264-650mb-yify-t6490832.html",
	verified: 1,
	comments: 106,
	magnet: "magnet:?xt=urn:btih:108C481959274F982AB442F3A83CCEA684519801&dn=anger+management+2003+720p+brrip+x264+650mb+yify&tr=udp%3A%2F%2Ftracker.publicbt.com%2Fannounce&tr=udp%3A%2F%2Fglotorrents.pw%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce",
	torrentLink: "//torcache.net/torrent/108C481959274F982AB442F3A83CCEA684519801.torrent?title=[kat.cr]anger.management.2003.720p.brrip.x264.650mb.yify",
	fileSize: "650.44 MB",
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
 - uploader
 - min_seeds
 - age
 - min_files
 - imdb
 - tvrage
 - isbn
 - language
 - adult_filter
 - verified
 - season
 - episode
 - platform_id
 - page
 - sort_by
 - order


## Languages and Platforms
Look inside the `katLanguageMap` and `katPlatformMap` to find the corresponding code for the language of platform you want to search for.

# License

MIT License

Copyright (c) 2016 - kat-api-pt - Released under the MIT license.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
