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

  /** @test {KatApi#search} */
  it('Should get results with a simple search', done => {
    kat.search('Westworld').then(res => {
      expect(res).to.be.an('object')
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
      expect(res).to.be.an('object')
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
      expect(res).to.be.an('object')
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
