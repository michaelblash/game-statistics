const assert = require('assert');
const utils = require('utils');

describe('Check the utils', function() {

  describe('escapeString()', function() {
    it('Escape string with different types of quotation marks', function() {
      assert.strictEqual(
        utils.escapeString("```Helo'`'`'`'WORLD'''''''"),
        "```Helo''`''`''`''WORLD''"
      );
    });
  });

  describe('escapeObject()', function() {
    it('Escape each string in the object with escapeString() function', function() {
      let initial = {
        a: 1,
        b: true,
        c: `\`\`\`'''Hello'`,
        d: {
          d1: {
            d2: '``world\'\'\''
          }
        }
      },

      desired = {
        a: 1,
        b: true,
        c: `\`\`\`''Hello''`,
        d: {
          d1: {
            d2: '``world\'\''
          }
        }
      };

      utils.escapeObject(initial);
      assert.deepStrictEqual(initial, desired);
    });
  });

  describe('parseEndpoint()', function() {
    let endpoint = '122.122.33.1-8080',
        badpoint = '122.121.111.111-919191';

    it(`Parse '${endpoint}'`, function() {
      assert.deepStrictEqual(
        utils.parseEndpoint(endpoint),
        {
          host: '122.122.33.1',
          port: '8080'
        }
      );
    });

    it(`Throw null for '${badpoint}'`, function() {
      assert.strictEqual(utils.parseEndpoint(badpoint), null);
    });
  });

  describe('checkTimestamp()', function() {
    let rightStamp = '2017-01-22T15:17:00Z',
        badStamp = '12017-01-22T15:17:00 Z';

    it(`Parse '${rightStamp}'`, function() {
      assert.strictEqual(utils.checkTimestamp(rightStamp), rightStamp);
    });
    
    it(`Throw null for '${badStamp}'`, function() {
      assert.strictEqual(utils.checkTimestamp(badStamp), null);
    });
  });
});