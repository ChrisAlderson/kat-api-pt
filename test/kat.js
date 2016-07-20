const chai = require('chai');
const assert = chai.assert;
const KAT = require("../kat-api-pt");

describe("KAT", () => {

  let kat;
  before(() => kat = new KAT());

  it("Should get a list of tv shows", done => {
    kat.search("Game of Thrones").then(res => {
        assert.isObject(res);
        done();
      }).catch(err => done(err));
  });

  it("Should get episodes of a tv show", done => {
    kat.search({
        query: "Game of Thrones",
        category: "tv",
        min_seeds: "3",
        uploader: "ettv",
        sort_by: "seeders",
        order: "desc",
        verified: 1,
        language: "en"
      }).then(res => {
        assert.isObject(res);
        done();
      }).catch(err => done(err));
  });

  it("Should get episodes of a tv show", done => {
    kat.search({
        query: "Game of Thrones",
        category: "tv",
        min_seeds: "666",
        uploader: "ettv",
        sort_by: "seeders",
        order: "desc",
        verified: 1,
        language: "en"
      }).then(res => {
        assert.isObject(res);
        done();
      }).catch(err => {
        assert.isOk(err);
        done();
      });
  });

});
