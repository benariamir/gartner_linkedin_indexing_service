'use strict';

var LinkedInParsingManager = require('../lib/linkedin_parsing');
var RequsetHandler = require('../lib/request_handler');
var ProfileDownloadManager = require('../lib/download_manager');
var IndexingClient = require('../lib/solr_indexing');
var SolrClientTester = require('./solr_client_tester');
var DownloadClientTester = require('./download_client_tester');
var Bluebird = require('bluebird');


describe('End to end test',function() {
	it ('End to end test using client testers',function*() {
		this.timeout(20000);
		var downloadClientTester = new DownloadClientTester();
		var downloadManager = new ProfileDownloadManager(downloadClientTester);
		var solrClientTester = new SolrClientTester();
		var indexingClient = new IndexingClient(solrClientTester);
		yield indexingClient.initialize();
		var linkedInParsingManager = new LinkedInParsingManager(indexingClient);
		var requestHandler = new RequsetHandler(downloadManager,linkedInParsingManager);
		var testProfileId = 'yuvalkaufman';
		log.info(`Perfomrming test request with profileId = ${testProfileId}`);
		yield requestHandler.getProfile(testProfileId);

		yield Bluebird.delay(2000);
		expect(solrClientTester.docs[testProfileId]).be.not.null;
		var indexedDoc = solrClientTester.docs[testProfileId];
		expect(indexedDoc.id).to.eq(testProfileId);
		expect(indexedDoc.personName).to.eq(`Yuval Kaufman`);
		expect(indexedDoc.personSummary.length).to.eq(258);
		expect(indexedDoc.personSkills.length).to.eq(16);
		expect(indexedDoc.personExperience.length).to.eq(3);
		expect(indexedDoc.personEducation.length).to.eq(2);

	});
});
