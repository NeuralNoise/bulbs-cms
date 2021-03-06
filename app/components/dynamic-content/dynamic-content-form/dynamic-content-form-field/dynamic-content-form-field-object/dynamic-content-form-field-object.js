'use strict';

angular.module('bulbs.cms.dynamicContent.form.field.object', [
  'bulbs.cms.dynamicContent.form.field.boolean',
  'bulbs.cms.dynamicContent.form.field.color',
  'bulbs.cms.dynamicContent.form.field.contentReferences',
  'bulbs.cms.dynamicContent.form.field.dateTime',
  'bulbs.cms.dynamicContent.form.field.image',
  'bulbs.cms.dynamicContent.form.field.list',
  'bulbs.cms.dynamicContent.form.field.integer',
  'bulbs.cms.dynamicContent.form.field.invalid',
  'bulbs.cms.dynamicContent.form.field.richtext',
  'bulbs.cms.dynamicContent.form.field.text',
  'bulbs.cms.dynamicContent.form.input.label',
  'bulbs.cms.dynamicContent.form.types',
  'bulbs.cms.site.config',
  'lodash',
  'uuid4'
])
  .directive('dynamicContentFormFieldObject', [
    '_', '$compile', 'CmsConfig', 'FIELD_TYPES_META', 'uuid4',
    function (_, $compile, CmsConfig, FIELD_TYPES_META, uuid4) {

      return {
        link: function (scope, element, attrs) {
          var $form = element.find('ng-form');

          scope.hideLabel = 'hideLabel' in attrs;

          scope.$watch('form.$valid', function (isValid) {
            scope.onValidityChange({
              isValid: isValid,
              internalForm: scope.form
            });
          });

          scope.$watch('schema', function () {
            if (_.has(scope.schema, 'fields')) {
              var fieldKeys = Object.keys(scope.schema.fields);
              var includeOnlyProvided = _.isArray(scope.includeOnly);
              var hideOnlyChildLabel = false;

              if (includeOnlyProvided) {
                fieldKeys = _.intersection(fieldKeys, scope.includeOnly);

                if (scope.includeOnly.length === 1) {
                  hideOnlyChildLabel = true;
                }
              }

              fieldKeys.forEach(function (id) {
                var fieldSchema = scope.schema.fields[id];
                var fieldMeta = FIELD_TYPES_META[fieldSchema.type];

                if (_.isUndefined(fieldMeta)) {
                  if (_.has(fieldSchema, 'fields')) {
                    fieldMeta = FIELD_TYPES_META.object;
                  } else {
                    fieldMeta = FIELD_TYPES_META.invalid;
                  }
                }

                var tagName = fieldMeta.tagName;
                var html = angular.element('<' + tagName + '></' + tagName + '>');

                html.attr('uuid', uuid4.generate());
                html.attr('name', id);
                html.attr('schema', 'schema.fields.' + id);
                html.attr('class', 'dynamic-content-form-field');

                if (hideOnlyChildLabel) {
                  html.attr('hide-label', 'true');
                }

                // NOTE : Angular is not able to bind primitives properly when
                //  passed into isolate scopes. See
                //  https://github.com/angular/angular.js/issues/1924. The
                //  parent object is passed in in its entirety and the child
                //  directive is responsible for accessing the key it needs to
                //  be able to modify.
                if (_.isString(scope.name)) {
                  // when we're at a nested object, scope.name will be defined
                  html.attr('ng-model', 'ngModel[name]');
                } else {
                  html.attr('ng-model', 'ngModel');
                }

                $form.append(html);
                $compile(html)(scope);
              });
            }
          }, true);
        },
        require: 'ngModel',
        restrict: 'E',
        scope: {
          name: '@',
          schema: '=',
          ngModel: '=',
          onValidityChange: '&',
          includeOnly: '='
        },
        templateUrl: CmsConfig.buildComponentPath(
          'dynamic-content',
          'dynamic-content-form',
          'dynamic-content-form-field',
          'dynamic-content-form-field-object',
          'dynamic-content-form-field-object.html'
        )
      };
    }
  ]);
