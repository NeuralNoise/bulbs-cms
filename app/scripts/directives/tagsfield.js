'use strict';

angular.module('bulbsCmsApp')
  .directive('tagsField', function (routes, _, IfExistsElse, ContentApi) {
    return {
      templateUrl: routes.PARTIALS_URL + 'taglike-autocomplete-field.html',
      restrict: 'E',
      scope: {
        article: '='
      },
      replace: true,
      link: function postLink(scope, element, attrs) {
        scope.name = 'tag';
        scope.label = 'Tags';
        scope.placeholder = 'Enter a tag';
        scope.resourceUrl = '/cms/api/v1/tag/?ordering=name&types=content_tag&search=';
        scope.display = function (o) {
          return o.name;
        };

        scope.$watch('article.tags', function(){
          scope.objects = _.where(article.tags, {type: 'content_tag'});
        }, true);

        scope.add = function (o, input, freeForm) {
          var tagVal = freeForm ? o : o.name;
          IfExistsElse.ifExistsElse(
            ContentApi.all('tag').getList({
              ordering: 'name',
              search: tagVal
            }),
            {name: tagVal},
            function (tag) { scope.article.tags.push(tag); },
            function (value) { scope.article.tags.push({name: value.name, type: 'content_tag', new: true}); },
            function (data, status) { if (status === 403) { Login.showLoginModal(); } }
          );
          $(input).val('');
        };

        scope.delete = function (e) {
          var tag = $(e.target).parents('[data-taglikeobject]').data('taglikeobject');
          var name = tag.name;
          var newtags = [];
          for (var i in scope.article.tags) {
            if (scope.article.tags[i].name !== name) {
              newtags.push(scope.article.tags[i]);
            }
          }
          scope.article.tags = newtags;
        };

        scope.h1classes = 'h6 col-xs-12';
        scope.div2classes = 'col-sm-4 form-group';
        scope.div3classes = 'col-sm-8';

      }
    };
  });