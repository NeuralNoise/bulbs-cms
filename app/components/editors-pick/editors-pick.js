'use strict';

angular.module('EditorsPick', [
  'bulbs.cms.site.config',
  'customSearch'
])
  .config(function ($injector, $routeProvider, CmsConfigProvider) {
    var CmsConfig = $injector.invoke(CmsConfigProvider.$get);

    $routeProvider
      .when('/cms/app/sod/', {
        controller: function ($scope, $window) {

          $window.document.title = CmsConfig.getCmsName() + ' | SoD';

          $scope.$watch('queryData', function () { console.log(arguments); });

          $scope.queryData = {};
          $scope.updateQueryData = function () {
            $scope.queryData = {
              groups: [{
                conditions: [{
                  field: 'content-type',
                  type: 'all',
                  values: [{
                    name: 'for display',
                    value: 'actually-use-this-value-123'
                  }]
                }],
                time: '1 day'
              }],
              included_ids: [1],
              excluded_ids: [2],
              pinned_ids: [3],
              page: 1,
  	          query: 'query balh blah blahb'
            };
          };

          $scope.updateConditionData = function () {
            $scope.queryData.groups[0].conditions = [{
              field: 'content-type',
              type: 'all',
              values: [{
                name: 'ANOTHER THIGN',
                value: 'actually-use-this-value-123'
              }]
            }];
          };

        },
        templateUrl: CmsConfig.buildComponentPath('editors-pick/editors-pick.html'),
        reloadOnSearch: false
      });
  });
