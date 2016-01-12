'use strict';

angular.module('apiServices.specialCoverage.factory', [
  'apiServices',
  'apiServices.campaign.factory',
  'apiServices.mixins.fieldDisplay',
  'filters.moment',
  'VideohubClient.api'
])
  .factory('SpecialCoverage', function (_, $parse, restmod, Video) {
    var ACTIVE_STATES = {
      INACTIVE: 'Inactive',
      PROMOTED: 'Pin to HP'
    };

    return restmod.model('special-coverage').mix('FieldDisplay', 'NestedDirtyModel', {
      $config: {
        name: 'Special Coverage',
        plural: 'Special Coverages',
        primaryKey: 'id',
        fieldDisplays: [{
          title: 'List Title',
          value: 'record.name',
          sorts: 'name'
        }, {
          title: 'Sponsor',
          value: 'record.campaign.sponsorName || "--"',
          sorts: 'campaign__sponsor_name'
        }, {
          title: 'Campaign',
          value: 'record.campaign.campaignLabel || "--"',
          sorts: 'campaign__campaign_label'
        }, {
          title: 'Start Date',
          value: 'record.startDate.format("MM/DD/YY") || "--"',
          sorts: 'start_date'
        }, {
          title: 'End Date',
          value: 'record.endDate.format("MM/DD/YY") || "--"',
          sorts: 'end_date'
        }, {
          title: 'Status',
          value: 'record.$activeState()',
          sorts: function (direction) {
            var sorting;
            if (direction === 'asc') {
              sorting = 'promoted,active';
            } else {
              sorting = '-promoted,-active';
            }
            return sorting;
          }
        }]
      },

      // fields from frontend to backend
      end_date: {
        encode: 'moment_to_date_string',
      },
      start_date: {
        encode: 'moment_to_date_string',
      },

      // fields from backend to frontend
      endDate: {
        decode: 'date_string_to_moment',
      },
      startDate: {
        decode: 'date_string_to_moment'
      },

      campaign: {
        belongsTo: 'Campaign',
        prefetch: true,
        key: 'campaign'
      },
      listUrl: {
        mask: 'CU'
      },
      query: {
        init: {}
      },
      videos: {
        belongsToMany: 'Video',
        keys: 'videos'
      },
      active: {
        init: true
      },
      promoted: {
        init: false
      },

      $hooks: {
        'after-fetch': function () {
          // auto fetch all video records when first fetching
          this.$loadVideosData();
        },
        'after-save': function () {
          // auto fetch all video records when saving/updating
          this.$loadVideosData();
        }
      },

      $extend: {
        Record: {
          /**
           * Load video data by filling in video models listed in videos property.
           */
          $loadVideosData: function () {
            _.each(this.videos, function (video) {
              video.$fetch();
            });
          },
          /**
           * Add a video by id.
           *
           * @param {Number} id - id of video to add.
           * @returns {Boolean} true if video was added, false otherwise.
           */
          addVideo: function (video) {
            var added = false;

            // check that video is not already in list
            var existingVideo = _.find(this.videos, function (existingVideo) {
              return video.id === existingVideo.id;
            });

            if (!existingVideo) {
              // not in list, add it to list
              this.videos.push(video);
              added = true;
            }

            return added;
          },
          /**
           * Getter/setter for active state, a front end standin for the active
           *  and promoted flags.
           *
           * @param {String} [activeState] - set this value when using as setter.
           * @returns {String} current activeState.
           */
          $activeState: function (activeState) {
            if (_.isString(activeState)) {
              if (activeState === ACTIVE_STATES.ACTIVE) {
                this.active = true;
                this.promoted = false;
              } else if (activeState === ACTIVE_STATES.PROMOTED) {
                this.active = true;
                this.promoted = true;
              } else {
                this.active = false;
                this.promoted = false;
              }
            } else {
              activeState = ACTIVE_STATES.INACTIVE;
              if (this.active && this.promoted) {
                activeState = ACTIVE_STATES.PROMOTED;
              } else if (this.active) {
                activeState = ACTIVE_STATES.ACTIVE;
              }
            }
            return activeState;
          }
        },
        Model: {
          ACTIVE_STATES: _.clone(ACTIVE_STATES)
        }
      },
    });
  });
