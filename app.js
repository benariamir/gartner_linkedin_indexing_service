'use strict';

require('./config/conf');
global.conf = require('./config/appsettings');
var koa = require('koa');
var bodyParser = require('koa-bodyparser');
var co = require('co');
var apiV1Routes = require('./routes/api_v1');
var handleErrors = require('./lib/handle_errors');
var DownloadClient = require('./lib/download_client');
var LinkedInParsingManager = require('./lib/linkedin_parsing');
var IndexingClient = require('./lib/solr_indexing');

class App {
	constructor(downloadClient,linkedInParsingManager) {
		this.downloadClient = downloadClient;
		this.linkedInParsingManager = linkedInParsingManager;
	}
	*run() {
		this.app = koa();
		this.app.use(bodyParser());
		this.app.use(handleErrors);
		this.app.use(apiV1Routes(this.downloadClient,this.linkedInParsingManager));

		log.info('Listening to port 3000');
		this.app.listen(3000);
	}

}

co(function*() {
	var downloadClient = new DownloadClient();
	var indexingClient = new IndexingClient();
	var linkedInParsingManager = new LinkedInParsingManager(indexingClient);
	var app = new App(downloadClient,linkedInParsingManager);

	yield app.run();
}).catch(function(err) {
	log.error(err);
	process.abort();
});
