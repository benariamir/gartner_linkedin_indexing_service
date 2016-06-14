'use strict';

var metadataConfig = global.conf.linkedin_parsing.metadata;
var cheerio = require('cheerio');

// class to handle linkedin profle parsing
class LinkedInParsingManager {

	// constructor gets an indexing client which is to where to store to extracted metadata
	constructor(indexingClient) {
		this.indexingClient = indexingClient;
	}

	// this is the class onDone function which is called when the download handler has done fetching.
	// parseResult is an object that contains both the profileId and the fetched Html.
	parseLinkedInHtml(parseResult) {
		log.debug('Parsing.');
		var extractedMetadata = {
			profileId:[parseResult.profileId]
		};
		// use cheerio to extract metadata with CSS selectors
		var $ = cheerio.load(parseResult.html);
		// go through the defined metadata and their CSS selectors in the appsettings
		// no need to change code only to change settings to add/remove metadata or fix their CSS selectors due to layout change
		// to do: CSS selector is suppose to be an array with fallbacks, not a single one.
		for (var metadata of metadataConfig) {
			if (metadata.cssSelector) {
				extractedMetadata[metadata.metadataName] = [];
				var extracted = $(metadata.cssSelector);
				// to do: this should be recursive and support nested elements.
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

		// send extractedMetadata to indexing.
		this.indexingClient.index(extractedMetadata);
	}

}

module.exports = LinkedInParsingManager;
