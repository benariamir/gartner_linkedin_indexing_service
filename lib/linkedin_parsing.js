'use strict';

var metadataConfig = global.conf.linkedin_parsing.metadata;
var cheerio = require('cheerio');
class LinkedInParsingManager {

	constructor(indexingClient) {
		this.indexingClient = indexingClient;
	}

	parseLinkedInHtml(parseResult) {
		log.debug('Parsing.');
		var extractedMetadata = {
			profileId:[parseResult.profileId]
		};
		var $ = cheerio.load(parseResult.html);
		for (var metadata of metadataConfig) {
			if (metadata.cssSelector) {
				extractedMetadata[metadata.metadataName] = [];
				var extracted = $(metadata.cssSelector);
				extracted.each(function() {
					try {
						var text = $(this).text();
						log.trace(text);
						if (text !== undefined && text.length > 0) {
							extractedMetadata[metadata.metadataName].push(text.trim());
						}
					}
					catch (err) {
						log.warn(`Failed to extract text from ${metadata.cssSelector}`);
					}
				});
			}
		}
		log.debug({extractedMetadata:extractedMetadata});
		/*extractedMetadata = extractedMetadata.filter( (metadata) => {

		});*/

		this.indexingClient.index(extractedMetadata);
	}

}

module.exports = LinkedInParsingManager;
