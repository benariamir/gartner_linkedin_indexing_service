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
var RequsetHandler = require('./lib/request_handler');

class App {
	constructor(requestHandler) {
		this.requestHandler = requestHandler;
	}
	*run() {
		this.app = koa();
		this.app.use(bodyParser());
		this.app.use(handleErrors);
		this.app.use(apiV1Routes(this.requestHandler));

		log.info('Listening to port 3000');
		this.app.listen(3000);
	}

}

co(function*() {
	var downloadClient = new DownloadClient();
	var indexingClient = new IndexingClient();
	var linkedInParsingManager = new LinkedInParsingManager(indexingClient);
	var requestHandler = new RequsetHandler(downloadClient,linkedInParsingManager);
	var app = new App(requestHandler);

	yield app.run();
}).catch(function(err) {
	log.error(err);
	process.abort();
});
