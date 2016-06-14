'use strict';
var request = require('request-promise');

// class do handle URL Fetching
class DownloadClient {

	// returns a promise once done returns an HTML.
	*doGet(url) {
		log.info(`Fetching URL ${url}`);
		var options = {
			method:'GET',
			uri:url,
			resolveWithFullResponse: false,
			forever:true,
			timeout:60000
		};
		return request(options);
	}
}

module.exports = DownloadClient;
