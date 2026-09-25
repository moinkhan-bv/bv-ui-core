/**
 * @fileOverview
 * Unit tests for the global module.
 */

// Includes.
var global = require('../../../lib/global');

describe('lib/global', function () {

  it('should export window', function () {
    // If we have access to the window object, compare against it.
    if (typeof window !== 'undefined') {
      expect(global).to.eql(window);
    }
  });

  it('should export window with default pointing to windows if __esModule is set', function () {
    // If we have access to the window object, compare against it.
    if (typeof window !== 'undefined') {
      window.__esModule = true
      var global = require('../../../lib/global')
      expect(global).to.eql(window);
    }
  });

  it('should wrap window in a Proxy when __esModule is set, even when globalObj is window', function () {
    if (typeof window !== 'undefined') {
      window.__esModule = true;
      var result = require('../../../lib/global');
      // The Proxy is needed so that native/branded methods (e.g.
      // getComputedStyle) can be bound back to the real window before
      // being returned, and so that `.default` interop lookups keep working.
      expect(result).to.not.equal(window);
      expect(result).to.eql(window);
      delete window.__esModule;
    }
  });

  it('should bind functions read off the Proxy to the real window so native methods work', function () {
    if (typeof window !== 'undefined') {
      window.__esModule = true;
      var result = require('../../../lib/global');
      // Calling a native/branded method via the Proxy receiver would
      // otherwise throw "TypeError: Illegal invocation".
      expect(function () {
        result.getComputedStyle(document.body);
      }).to.not.throw();
      delete window.__esModule;
    }
  });

  it('should return the real target for the "default" property (esModule interop)', function () {
    if (typeof window !== 'undefined') {
      window.__esModule = true;
      var result = require('../../../lib/global');
      expect(result.default).to.equal(window);
      delete window.__esModule;
    }
  });

  it('should return the global object directly when __esModule is not set', function () {
    if (typeof window !== 'undefined') {
      delete window.__esModule;
      var result = require('../../../lib/global');
      expect(result).to.equal(window);
    }
  });

});
