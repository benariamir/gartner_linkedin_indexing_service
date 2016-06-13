'use strict';

class LinkedInParsingManager {

	constructor(indexingClient) {
		this.indexingClient = indexingClient;
	}

	parseLinkedInHtml(html) {
		var test = {title:'test'};
		log.trace(`Parsing.`);
		try {
			this.indexingClient.index(test);
		}
		catch (err) {
			log.error(err);
		}
	}

}

module.exports = LinkedInParsingManager;
