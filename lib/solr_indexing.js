'use strict';
var co = require('co');

class SolrIndexing {

	constructor(solrClient) {
		this.client = solrClient;
	}

	*initialize() {
		var metadataConfig = global.conf.linkedin_parsing.metadata;
		var schemaMatching = {};
		for (var metadataDefinition of metadataConfig) {
			schemaMatching[metadataDefinition.metadataName] = metadataDefinition;
		}
		this.schemaMatching = schemaMatching;
		log.trace({schemaMatching:schemaMatching});
		this.client.autoCommit = true;

		var ping = yield this.client.pingAsync();
		log.debug({ping:ping});
		return ping;
	}

	index(extractedMetadata) {
		return co(function* () {
			log.debug('Transforming.');
			var docToIndex = this.transform(extractedMetadata);
			log.debug('Indexing to Solr.');
			yield this.client.addAsync(docToIndex);
			log.debug('Indexed to Solr.');
			yield this.client.commitAsync();
			log.debug('Commited.');
		}.bind(this))
		.catch(function(err) {
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
