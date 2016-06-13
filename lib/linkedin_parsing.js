'use strict';

var metadataConfig = global.conf.linkedin_parsing.metadata;
var cheerio = require('cheerio');
class LinkedInParsingManager {

	constructor(indexingClient) {
		this.indexingClient = indexingClient;
	}

	parseLinkedInHtml(html) {
		var test = {title:'test'};
		log.trace(`Parsing.`);

		var extractedMetadata = {};

		var $ = cheerio.load(html);
		for (var metadata of metadataConfig) {
			extractedMetadata[metadata.name] = [];
			var extracted = $(metadata.cssSelector);
			extracted.each(function() {
				var text = $(this).text();
				log.trace(text);
				extractedMetadata[metadata.name].push(text);
			});
		}
		log.trace(extractedMetadata);

		try {
			this.indexingClient.index(extractedMetadata);
		}
		catch (err) {
			log.error(err);
		}
	}

}

module.exports = LinkedInParsingManager;
