'use strict';

describe('Directive: activeNav', function () {

  beforeEach(module('bulbsCmsApp'));

  var element,
    scope,
    compile,
    html,
    $location,
    $browser,
    path;

  path = '/cms/app/list';
  html = '<active-nav href="' + path + '" label="Content"></active-nav>';

  beforeEach(inject(function ($rootScope, $compile) {
    scope = $rootScope.$new();

    $location = angular.scope().$service('$location');
    $browser = angular.scope().$service('$browser');
    $location.path(path);
    $browser.poll();

    element = angular.element($compile(html)(scope));
    scope = element.scope();
    scope.$apply();
  }));

  it('should be cool', function () {
    expect(element.hasClass('active')).toBe(true);
  });

});
