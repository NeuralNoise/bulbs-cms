'use strict';

angular.module('specialCoverage.edit.videos.directive', [
  'autocompleteBasic',
  'jquery',
  'specialCoverage.edit.videos.video.directive',
  'ui.sortable',
  'utils',
  'VideohubClient.api',
  'VideohubClient.settings'
])
  .directive('specialCoverageEditVideos', function ($, routes) {
    return {
      controller: function (_, $scope, Utils, Video, VIDEOHUB_DEFAULT_CHANNEL) {

        $scope.videoChannel = VIDEOHUB_DEFAULT_CHANNEL;

        $scope.moveUp = function (index) {
          Utils.moveTo($scope.videos, index, index - 1);
          $scope.onUpdate();
        };

        $scope.moveDown = function (index) {
          Utils.moveTo($scope.videos, index, index + 1);
          $scope.onUpdate();
        };

        $scope.delete = function (index) {
          Utils.removeFrom($scope.videos, index);
          $scope.onUpdate();
        };

        $scope.addVideo = function (video) {
          $scope.addVideoCallback({video: video});
          $scope.onUpdate();
        };

        $scope.searchVideos = function (query) {
          return Video.$postSearch({
            query: query,
            channel: VIDEOHUB_DEFAULT_CHANNEL
          });
        };

      },
      link: function (scope, element, attr) {

        scope.sortableOptions = {
          beforeStop: function (e, ui) {
            ui.helper.css('margin-top', 0);
          },
          change: function (e, ui) {
            ui.helper.css('margin-top', $(window).scrollTop());
          },
          containment: 'special-coverage-edit-videos',
          distance: 3,
          opacity: 0.75,
          placeholder: 'dropzone',
          start: function (e, ui) {
            ui.helper.css('margin-top', $(window).scrollTop());
          }
        };
      },
      restrict: 'E',
      scope: {
        addVideoCallback: '&addVideo',
        videos: '=',
        onUpdate: '&'
      },
      templateUrl: routes.COMPONENTS_URL + 'special-coverage/special-coverage-edit/special-coverage-edit-videos/special-coverage-edit-videos.html'
    };
  });
