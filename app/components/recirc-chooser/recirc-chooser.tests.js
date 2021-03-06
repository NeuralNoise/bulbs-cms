'use strict';

describe('Directive: recircChooser', function () {

  var $httpBackend;
  var $parentScope;
  var CmsConfig;
  var digest;
  var sandbox;
  var testData;
  var uuid4;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();

    module('bulbs.cms.recircChooser');
    module('jsTemplates');

    inject(function (_$httpBackend_, _CmsConfig_, _uuid4_, $compile,
        $rootScope, $sce) {

      $httpBackend = _$httpBackend_;
      $parentScope = $rootScope.$new();
      CmsConfig = _CmsConfig_;
      uuid4 = _uuid4_;

      digest = window.testHelper.directiveBuilderWithDynamicHtml(
        $compile,
        $parentScope
      );

      testData = {
        article1: {
          id: 420,
          title: $sce.trustAsHtml('Article 1'),
          recirc_query: {}
        },
        article2: {
          id: 666,
          title: $sce.trustAsHtml('Article 2'),
          recirc_query: {}
        },
        article3: {
          id: 789,
          title: $sce.trustAsHtml('Article 3'),
          recirc_query: {}
        },
        article4: {
          id: 123,
          title: $sce.trustAsHtml('Article 4'),
          recirc_query: {}
        }
      };
    });
  });

  afterEach(function () {
    sandbox.restore();
  });

  context('input id', function () {

    it('should be customizable property', function () {
      $parentScope.article = testData.article1;
      $parentScope.customInputId = 'myCustomInputId';
      var element = digest(
        '<recirc-chooser ' +
            'ng-model="article.recirc_query.included_ids" ' +
            'input-id="{{ customInputId }}" ' +
            '></recirc-chooser>'
      );
      var scope = element.scope();

      scope.$digest();

      expect(element.find('content-search[input-id="' + $parentScope.customInputId + '"]').length)
          .to.equal(1);
    });

    it('should default to a uuid', function () {
      $parentScope.article = testData.article1;
      var mockUuid = 'this-is-a-uuid';
      sandbox.stub(uuid4, 'generate').returns(mockUuid);
      var element = digest(
        '<recirc-chooser ' +
            'ng-model="article.recirc_query.included_ids" ' +
            '></recirc-chooser>'
      );
      var scope = element.scope();

      scope.$digest();

      expect(element.find('content-search[input-id="' + mockUuid + '"]').length).to.equal(1);
    });
  });

  context('dealing with recirc', function () {

    it('should request for existing ids', function () {
      $parentScope.article = testData.article1;
      $parentScope.article.recirc_query.included_ids = [
        testData.article2.id,
        testData.article3.id
      ];
      $httpBackend
        .expectGET(CmsConfig.buildApiUrlRoot('content', testData.article2.id))
        .respond(testData.article2);
      $httpBackend
        .expectGET(CmsConfig.buildApiUrlRoot('content', testData.article3.id))
        .respond(testData.article3);
      var element = digest(
        '<recirc-chooser ' +
            'ng-model="article.recirc_query.included_ids" ' +
            '></recirc-chooser>'
      );
      var scope = element.scope();

      scope.$digest();
      $httpBackend.flush();

      var recircEntries = element.find('.recirc-chooser-content-list li');
      expect(recircEntries.length).to.equal(2);
      expect(recircEntries.eq(0).html()).to.have.string(testData.article2.id);
      expect(recircEntries.eq(0).html()).to.have.string(testData.article2.title);
      expect(recircEntries.eq(1).html()).to.have.string(testData.article3.id);
      expect(recircEntries.eq(1).html()).to.have.string(testData.article3.title);
    });

    it('should allow adding new ones', function () {
      $parentScope.article = testData.article1;
      $parentScope.article.recirc_query.included_ids = [];
      $httpBackend
        .expectGET(CmsConfig.buildApiUrlRoot('content', testData.article2.id))
        .respond(testData.article2);
      var element = digest(
        '<recirc-chooser ' +
            'ng-model="article.recirc_query.included_ids" ' +
            '></recirc-chooser>'
      );
      var scope = element.scope();

      scope.$digest();
      element.isolateScope().includeRecirc(testData.article2.id);
      $httpBackend.flush();

      var recircEntries = element.find('.recirc-chooser-content-list li');
      expect($parentScope.article.recirc_query.included_ids).to.eql([testData.article2.id]);
      expect(recircEntries.length).to.equal(1);
      expect(recircEntries.eq(0).html()).to.have.string(testData.article2.id);
      expect(recircEntries.eq(0).html()).to.have.string(testData.article2.title);
    });

    it('should allow removing existing ones', function () {
      $parentScope.article = testData.article1;
      $parentScope.article.recirc_query.included_ids = [
        testData.article2.id
      ];
      $httpBackend
        .expectGET(CmsConfig.buildApiUrlRoot('content', testData.article2.id))
        .respond(testData.article2);
      var element = digest(
        '<recirc-chooser ' +
            'ng-model="article.recirc_query.included_ids" ' +
            '></recirc-chooser>'
      );
      var scope = element.scope();

      scope.$digest();
      element.isolateScope().removeRecirc(0);

      var recircEntries = element.find('.super-features-edit-recirc-list li');
      expect($parentScope.article.recirc_query.included_ids).to.eql([]);
      expect(recircEntries.length).to.equal(0);
    });

    it('should only allow adding up to 3 items by default', function () {
      $parentScope.article = testData.article1;
      $parentScope.article.recirc_query.included_ids = [
        testData.article2.id,
        testData.article3.id
      ];
      $httpBackend
        .expectGET(CmsConfig.buildApiUrlRoot('content', testData.article2.id))
        .respond(testData.article2);
      $httpBackend
        .expectGET(CmsConfig.buildApiUrlRoot('content', testData.article3.id))
        .respond(testData.article3);
      $httpBackend
        .expectGET(CmsConfig.buildApiUrlRoot('content', testData.article4.id))
        .respond(testData.article4);
      var element = digest(
        '<recirc-chooser ' +
            'ng-model="article.recirc_query.included_ids" ' +
            '></recirc-chooser>'
      );
      var scope = element.scope();

      scope.$digest();
      element.isolateScope().includeRecirc(testData.article4.id);
      $httpBackend.flush();

      expect(element.find('content-search').attr('disabled')).to.equal('disabled');
    });

    it('should allow a custom maximum number of items', function () {
      $parentScope.article = testData.article1;
      $parentScope.article.recirc_query.included_ids = [
        testData.article2.id,
        testData.article3.id
      ];
      $httpBackend
        .expectGET(CmsConfig.buildApiUrlRoot('content', testData.article2.id))
        .respond(testData.article2);
      $httpBackend
        .expectGET(CmsConfig.buildApiUrlRoot('content', testData.article3.id))
        .respond(testData.article3);
      var element = digest(
        '<recirc-chooser ' +
            'ng-model="article.recirc_query.included_ids" ' +
            'max-recirc-items="2" ' +
            '></recirc-chooser>'
      );
      var scope = element.scope();

      scope.$digest();
      $httpBackend.flush();

      expect(element.find('content-search').attr('disabled')).to.equal('disabled');
    });
  });
});

