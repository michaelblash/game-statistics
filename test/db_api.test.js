const assert = require('assert');
const db = require('db');

describe('Check the database API sufficiency', function() {
  it('getServer()', function() {
    assert.ok(db.getServer);
  });

  it('putServer()', function() {
    assert.ok(db.putServer);
  });

  it('getServers()', function() {
    assert.ok(db.getServers);
  });

  it('getMatch()', function() {
    assert.ok(db.getMatch);
  });

  it('putMatch()', function() {
    assert.ok(db.putMatch);
  });

  it('getServerStats()', function() {
    assert.ok(db.getServerStats);
  });

  it('getPlayerStats()', function() {
    assert.ok(db.getPlayerStats);
  });
});