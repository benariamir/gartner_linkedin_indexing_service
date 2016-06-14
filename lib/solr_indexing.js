'use strict';
var co = require('co');

// class to handle indexing to solrClient
class SolrIndexing {

	// gets a solr client, mainly for testing purposes
	constructor(solrClient) {
		this.client = solrClient;
	}

	// initialize
	*initialize() {
		var metadataConfig = global.conf.linkedin_parsing.metadata;
		// schema matching is done to correctly transofrm extracted metadata to the storage's (Solr) schema, thus making them independent and indifferent so which storage I use.
		var schemaMatching = {};
		for (var metadataDefinition of metadataConfig) {
			schemaMatching[metadataDefinition.metadataName] = metadataDefinition;
		}
		this.schemaMatching = schemaMatching;
		log.trace({schemaMatching:schemaMatching});
		this.client.autoCommit = true;

		// health check
		var ping = yield this.client.pingAsync();

		log.debug({ping:ping});
		return ping;
	}

	// index extractedMetadata to storage (Solr)
	index(extractedMetadata) {
		return co(function* () {
			log.debug('Transforming.');
			// transform from extracted metadata to Solr doc matching its schema.
			var docToIndex = this.transform(extractedMetadata);
			log.debug('Indexing to Solr.');
			yield this.client.addAsync(docToIndex);
			log.debug('Indexed to Solr.');
			// there's shouldn't be a commit every 1 document, but batch adding and commiting... but this is a home test :)
			yield this.client.commitAsync();
			log.debug('Commited.');
		}.bind(this))
		.catch(function(err) {
			  // this is error handling but should report to the Dev Team of such failures.
				// there's A LOT of error handling when it comes to Solr to better promise a correct index.
				log.error(err);
		});
	}


	transform(extractedMetadata) {
		var doc = {};

		Object.keys(extractedMetadata).forEach((key) => {
			log.trace(key);
			var extractedMetadataValue = extractedMetadata[key];
			if (this.schemaMatching[key]) {
				var matchedMetadataDefinition = this.schemaMatching[key];
				var schemaFieldName = matchedMetadataDefinition.schemaFieldName;
				// mutliValued is to decide wether to use a String or an Array on Solr doc.
				var multiValued = matchedMetadataDefinition.multiValued || false;
				if (multiValued) {
					doc[schemaFieldName] = extractedMetadataValue;
				}
				else {
					doc[schemaFieldName] = extractedMetadataValue[0];
				}
			}
			else {
				log.error(`Failed to find field ${key}.`);
				return;
			}

		});
		log.debug({transformedDoc:doc});
		return doc;
	}

}

module.exports = SolrIndexing;
