'use strict';

describe('Filter: truncateByWords', function () {

  // load the filter's module
  beforeEach(module('bulbsCmsApp'));

  // initialize a new instance of the filter before each test
  var truncateByWords;
  beforeEach(inject(function ($filter) {
    truncateByWords = $filter('truncateByWords');
  }));

  it('should return the input prefixed with "truncateByWords filter:"', function () {
    var text = 'angularjs';
    expect(truncateByWords(text)).toBe('truncateByWords filter: ' + text);
  });

});
