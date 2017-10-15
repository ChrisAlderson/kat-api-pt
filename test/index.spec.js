// Import the necessary modules.
/* eslint-disable no-unused-expressions */
const { expect } = require('chai')

const KatApi = require('..')

/** @test {KatApi} */
describe('KatApi', () => {
  /**
   * The KatApi instance.
   * @type {KatApi}
   */
  let kat

  /**
   * Hook for setting up the KatApi tests
   * @type {Function}
   */
  before(() => {
    kat = new KatApi()
  })

  /**
   * Test the attributes of a response object.
   * @param {Response} response - The response object to test.
   * @returns {undefined}
   */
  function testResponse(response) {
    expect(response).to.be.an('object')
    expect(response.response_time).to.be.a('number')
    expect(response.page).to.be.a('number')
    expect(response.total_results).to.be.a('number')
    expect(response.total_pages).to.be.a('number')
    expect(response.results).to.be.an('array')
  }

  /**
   * Test the array of torrents.
   * @param {Array<Torrent>} results - The torrent array to test.
   * @returns {undefined}
   */
  function testTorrentResults(results) {
    const random = Math.floor(Math.random() * results.length)

    const toTest = results[random]

    expect(toTest.title).to.be.a('string')
    expect(toTest.category).to.be.a('string')
    expect(toTest.link).to.be.a('string')
    expect(toTest.verified).to.be.a('boolean')
    expect(toTest.comments).to.be.a('number')
    expect(toTest.torrentLink).to.be.a('string')
    expect(toTest.fileSize).to.be.a('string')
    expect(toTest.size).to.be.a('number')
    expect(toTest.seeds).to.be.a('number')
    expect(toTest.leechs).to.be.a('number')
    expect(toTest.peers).to.be.a('number')
  }

  /** @test {KatApi#search} */
  it('Should get results with a simple search', done => {
    kat.search('Westworld').then(res => {
      testResponse(res)
      testTorrentResults(res.results)

      done()
    }).catch(err => done(err))
  })

  /** @test {KatApi#search} */
  it('Should get results with an advanced search', done => {
    kat.search({
      query: 'Westworld',
      category: 'tv_other',
      sortBy: 'seeders',
      orderBy: 'desc',
      language: 'english',
      page: 1
    }).then(res => {
      testResponse(res)
      testTorrentResults(res.results)

      done()
    }).catch(err => done(err))
  })

  /** @test {KatApi#search} */
  it('Should get results with an advanced search', done => {
    kat.search({
      query: '"this probably won\'t return any results"',
      category: 'tv_other',
      sortBy: 'seeders',
      orderBy: 'desc',
      language: 'english',
      page: 1
    }).then(res => {
      testResponse(res)
      expect(res.results.length).to.equal(0)

      done()
    }).catch(err => done(err))
  })
  /** @test {KatApi#search} */
  it('should reject the promise to search with an undefined as a parameter', done => {
    kat.search(undefined).then(done)
      .catch(err => {
        expect(err).to.be.an('Error')
        done()
      })
  })

  /**
   * Helper function to test an incorrect query.
   * @param {!string} key - The key to reject the promise.
   * @return {undefined}
   */
  function testRejecting(key) {
    /** @test {KatApi#search} */
    it('should reject the promise to search with a faulty query', done => {
      kat.search({
        [key]: 'faulty'
      }).then(done)
        .catch(err => {
          expect(err).to.be.an('Error')
          done()
        })
    })
  }

  // The keys to reject the promises.
  const keys = [
    'category',
    'language',
    'sortBy',
    'orderBy'
  ]

  // Execute the tests.
  keys.map(testRejecting)
})
