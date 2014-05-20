'use strict';

angular.module('bulbsCmsApp')
  .directive('createContent', function ($http, $window, $, IfExistsElse, Login, ContentApi, routes, AUTO_ADD_AUTHOR) {
    return {
      restrict: 'E',
      templateUrl:  routes.DIRECTIVE_PARTIALS_URL + 'create-content.html',
      controller: function ($scope) {
        $scope.gotTags = false;
        $scope.gotUser = false;
        $scope.gotSave = false;
        $scope.$watch(function () {
          return $scope.gotTags && $scope.gotUser && $scope.gotSave;
        }, function (val) {
          if (val) {
            saveArticle($scope.init);
          }
        });

        $scope.newArticle = function () {
          var init = {'title': $scope.newTitle};
          angular.extend($scope.init, init);

          if ($scope.tag) {
            IfExistsElse.ifExistsElse(
              ContentApi.all('tag').getList({
                ordering: 'name',
                search: $scope.tag
              }),
              {slug: $scope.tag},
              function (tag) { $scope.init.tags = [tag]; $scope.gotTags = true; },
              function (value) { console.log('couldnt find tag ' + value.slug + ' for initial value'); },
              function (data, status, headers, config) { if (status === 403) { Login.showLoginModal(); } }
            );
          } else {
            $scope.gotTags = true;
          }

          if(AUTO_ADD_AUTHOR){
            $http.get('/users/me/').then(function(data){
              $scope.init.authors = [data.data];
              $scope.gotUser = true;
            });
          }else{
            $scope.gotUser = true;
          }

          $scope.gotSave = true;
        };

        function saveArticle() {
          $('button.go').html('<i class="fa fa-refresh fa-spin"></i> Going');
          $http({
            url: '/cms/api/v1/content/?doctype=' + $scope.contentType,
            method: 'POST',
            data: $scope.init
          }).success(function (resp) {
            var new_id = resp.id;
            var new_path = '/cms/app/edit/' + new_id + '/';
            if ($scope.rating_type) {
              new_path += '?rating_type=' + $scope.rating_type;
            }
            $window.location.href = $window.location.origin + new_path;
          }).error(function (data, status, headers, config) {
            if (status === 403) {
              $('button.go')
                .html('<i class="fa fa-frown-o" style="color:red"></i> Please Login');
            } else {
              $('button.go').html('<i class="fa fa-frown-o" style="color:red"></i> Error!');
            }
            $scope.gotSave = false;
          });
        }


      },
      link: function (scope, element, attrs) {
        //HEY THIS SUCKS
        //TODO: This sucks!
        scope.panel = 1;

        angular.element('#content-title .editor').bind('input', function () {
          scope.$apply(function(){
            scope.newTitle = angular.element('#content-title .editor').html();
          });
        });

        scope.$watch('newTitle', function(newTitle){
          var tmp = document.createElement("DIV");
          tmp.innerHTML = scope.newTitle || "";
          scope.newTitleText = (tmp.textContent || tmp.innerText || "").replace(/^\s+|\s+$/g, '');
        });

        $(element).find('a.create-content').on('click', function (e) {
          $('a.create-content.active').removeClass('active');
          $(this).addClass('active');
        });

        $(element).find('a.create-content').on('click', function (e) {
          scope.contentTypeLabel = $(this).text();
          scope.contentType = $(this).data('content_type') || null;
          scope.init = $(this).data('init') || {};
          scope.tag = $(this).data('tag') || null;
          scope.rating_type = $(this).data('rating_type') || null;

          scope.$apply();

          if ($(this).hasClass('go-next')) {
            $('#create button.next-pane').click();
          }

          return true;
        });

        $('button.next-pane:not(.hide)').on('click', function (e) {
          scope.panel = 2;
          $('.new-title').focus();
        });

        $(element).find('.editor').on('keydown', function (e) {
          if (e.keyCode === 13 && scope.newTitleText) {
            $(element).find('.go').click();
          }
        });

        $('#create').on('hidden.bs.modal', function(){
          $("#create #content-title .editor").html("<p><br></p>");
          scope.newTitle = "";
          scope.panel = 1;
        });

      }

    };
  });
