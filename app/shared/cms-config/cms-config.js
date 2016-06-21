'use strict';

angular.module('bulbs.cms.config', [
  'bulbs.cms.utils',
  'lodash'
])
  .provider('CmsConfig', [
    '_', 'UtilsProvider',
    function (_, Utils) {

      var CmsConfigError = BulbsCmsConfigError.build('CmsConfig');
      var checkOrError = function (value, test, errorMsg) {
        if (test(value)) {
          return value;
        }
        throw new CmsConfigError(errorMsg);
      };
      var pathBuilder = function (start, errorMsg) {
        return function () {
          return Utils.path.join(checkOrError(
            arguments,
            function (args) {
              return _.every(args, _.isString);
            },
            errorMsg
          ));
        }.bind(null, start);
      };

      // true to automatically add current user to author list when creating content
      var autoAddAuthor = false;
      // path to components
      var componentPath = '';
      // path to edit pages for specific types of content, maps to ctype
      var contentPartialsPath = '';
      // path to directives from backend
      // TODO : remove once apps are pulled into here
      var directivePartialsPath = '';
      // name of CMS to display in title and in interface
      var cmsName = '';
      // url for external links, those that are accessible to the public
      var externalUrl = '';
      // max number of states to store in an article's history
      var firebaseMaxArticleHistory = 25;
      // path to site root in firebase instance
      var firebaseSiteRoot = '';
      // url of firebase instance to use
      var firebaseUrl = '';
      // url of image api
      var imageApiUrl = '';
      // key to access image api
      var imageApiKey = '';
      // url for internal links, those that are not accessible to the public
      var internalUrl = '';
      // path to inline editor buttons configuration
      var inlineObjectsPath = '';
      // path to cms logo static asset
      var navLogoPath = '';
      // path to shared directory
      // TODO : remove once app is fully in pods
      var sharedPath  = '';
      // name of timezone for to use for times in the cms
      var timezoneName = 'America/Chicago';
      // mappings for top bar templates
      var topBarMappings = {};
      // path from internal url that points to an endpoint for unpublished content
      var unpublishedPath = '';
      // path to video embeds
      var videoPath = '';
      // thumbnail for inline video uploads
      var videoThumbnailUrl = '';

      this.setAutoAddAuthor = function (value) {
        autoAddAuthor = checkOrError(
          value, _.isBoolean,
          'auto add author must be a boolean!'
        );
        return this;
      };

      this.setComponentPath = function (value) {
        componentPath = checkOrError(
          value, _.isString,
          'component path must be a string!'
        );
        return this;
      };

      this.setContentPartialsPath = function (value) {
        contentPartialsPath = checkOrError(
          value, _.isString,
          'content partials path must be a string!'
        );
        return this;
      };

      this.setDirectivePartialsPath = function (value) {
        directivePartialsPath = checkOrError(
          value, _.isString,
          'directive partials path must be a string!'
        );
        return this;
      };

      this.setCmsName = function (value) {
        cmsName = checkOrError(
          value, _.isString,
          'cms name must be a string!'
        );
        return this;
      };

      this.setExternalUrl = function (value) {
        externalUrl = checkOrError(
          value, _.isString,
          'external url must be a string!'
        );
        return this;
      };

      this.setFirebaseMaxArticleHistory = function (value) {
        firebaseMaxArticleHistory = checkOrError(
          value, _.isNumber,
          'firebase max article history must be a number!'
        );
        return this;
      };

      this.setFirebaseSiteRoot = function (value) {
        firebaseSiteRoot = checkOrError(
          value, _.isString,
          'firebase site url must be a string!'
        );
        return this;
      };

      this.setFirebaseUrl = function (value) {
        firebaseUrl = checkOrError(
          value, _.isString,
          'firebase url must be a string!'
        );
        return this;
      };

      this.setInlineObjectsPath = function (value) {
        inlineObjectsPath = checkOrError(
          value, _.isString,
          'inline objects path must be a string!'
        );
        return this;
      };

      this.setImageApiUrl = function (value) {
        imageApiUrl = checkOrError(
          value, _.isString,
          'image api url must be a string!'
        );
        window.BC_ADMIN_URL = imageApiUrl;
        return this;
      };

      this.setImageApiKey = function (value) {
        imageApiKey = checkOrError(
          value, _.isString,
          'image api key must be a string!'
        );
        window.BC_API_KEY = imageApiKey;
        return this;
      };

      this.setInternalUrl = function (value) {
        internalUrl = checkOrError(
          value, _.isString,
          'internal url must be a string!'
        );
        return this;
      };

      this.setNavLogoPath = function (value) {
        navLogoPath = checkOrError(
          value, _.isString,
          'nav logo path must be a string!'
        );
        return this;
      };

      this.setSharedPath = function (value) {
        sharedPath = checkOrError(
          value, _.isString,
          'shared path must be a string!'
        );
        return this;
      };

      this.setTimezoneName = function (name) {
        timezoneName = checkOrError(
          name, moment.tz.zone,
          'given timezone name "' + name + '" is not a valid timezone!'
        );
        return this;
      };

      this.setTopBarMapping = function (name, template) {
        var key = checkOrError(
          name, _.isString,
          'top bar mapping name must be a string!'
        );
        var value = checkOrError(
          template, _.isString,
          'top bar mapping template must be a string!'
        );
        topBarMappings[key] = value;
        return this;
      };

      this.setUnpublishedPath = function (value) {
        unpublishedPath = checkOrError(
          value, _.isString,
          'unpublished path must be a string!'
        );
        return this;
      };

      this.setVideoPath = function (value) {
        videoPath = checkOrError(
          value, _.isString,
          'video path must be a string!'
        );
        return this;
      };

      this.setVideoThumbnailUrl = function (value) {
        videoThumbnailUrl = checkOrError(
          value, _.isString,
          'video thumbnail url must be a string!'
        );
        return this;
      };

      this.$get = [
        function () {
          return {
            buildComponentPath: pathBuilder(
              componentPath,
              'value given to component path build must be a string!'
            ),
            buildContentPartialsPath: pathBuilder(
              contentPartialsPath,
              'value given to content partials path build must be a string!'
            ),
            buildDirectivePartialsPath: pathBuilder(
              directivePartialsPath,
              'value given to directive partials path build must be a string!'
            ),
            buildExternalUrl: pathBuilder(
              externalUrl,
              'value given to external url build must be a string!'
            ),
            buildFirebaseUrl: pathBuilder(
              firebaseUrl,
              'value given to firebase url build must be a string!'
            ),
            buildFirebaseSiteUrl: pathBuilder(
              Utils.path.join(firebaseUrl, firebaseSiteRoot),
              'value given to firebase site url build must be a string!'
            ),
            buildImageApiUrl: pathBuilder(
              imageApiUrl,
              'value given to image api url build must be a string!'
            ),
            buildInternalUrl: pathBuilder(
              internalUrl,
              'value given to internal url build must be a string!'
            ),
            buildSharedPath: pathBuilder(
              sharedPath,
              'value given to shared path build must be a string!'
            ),
            buildUnpublishedUrl: pathBuilder(
              Utils.path.join(internalUrl, unpublishedPath),
              'value given to unpublished url build must be a string!'
            ),
            buildVideoUrl: pathBuilder(
              Utils.path.join(externalUrl, videoPath),
              'value given to video url build must be a string!'
            ),
            buildVideoThumbnailUrl: pathBuilder(
              videoThumbnailUrl,
              'value given to video thumbnail url build must be a string!'
            ),
            getAutoAddAuthor: _.constant(autoAddAuthor),
            getCmsName: _.constant(cmsName),
            getFirebaseMaxArticleHistory: _.constant(firebaseMaxArticleHistory),
            getImageApiKey: _.constant(imageApiKey),
            getInlineObjecsPath: _.constant(inlineObjectsPath),
            getNavLogoPath: _.constant(navLogoPath),
            getTimezoneName: _.constant(timezoneName),
            getTopBarMapping: function (name) {
              if (_.has(topBarMappings, name)) {
                return topBarMappings[name];
              }
              throw new CmsConfigError('no top bar mapping exists for name "' + name + '"!');
            }
          };
        }
      ];

      return this;
    }
  ]);