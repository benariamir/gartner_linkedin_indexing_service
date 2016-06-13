'use strict';

var metadataConfig = global.conf.linkedin_parsing.metadata;
var cheerio = require('cheerio');
class LinkedInParsingManager {

	constructor(indexingClient) {
		this.indexingClient = indexingClient;
	}

	parseLinkedInHtml(html) {
		log.trace(`Parsing.`);

		var extractedMetadata = {};

		var $ = cheerio.load(html);
		for (var metadata of metadataConfig) {
			extractedMetadata[metadata.name] = [];
			var extracted = $(metadata.cssSelector);
			extracted.each(function() {
				try {
					var text = $(this).text();
					log.trace(text);
					if (text !== undefined && text.length > 0) {
						extractedMetadata[metadata.name].push(text.trim());
					}
				}
				catch (err) {
					log.warn(`Failed to extract text from ${metadata.cssSelector}`);
				}
			});
		}
		log.trace(extractedMetadata);

		this.indexingClient.index(extractedMetadata);
	}

}

module.exports = LinkedInParsingManager;
