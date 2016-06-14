'use strict';
var fs = require('fs');

class DownloadClientTester {

	constructor() {
		log.trace('DownloadClientTester has been constructed.')
	}

	*doGet(url) {
		log.info('DownloadClientTester: doGet!');
		var html = fs.readFileSync('test/testprofile.html').toString();
		log.trace(html);
		return html;
	}

}
module.exports = DownloadClientTester;
