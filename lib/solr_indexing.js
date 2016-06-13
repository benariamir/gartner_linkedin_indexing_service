'use strict';


class SolrIndexing {

	*initialize() {
		var metadataConfig = global.conf.linkedin_parsing.metadata;
		var schemaMatching = {};
		for (var metadataDefinition of metadataConfig) {
			schemaMatching[metadataDefinition.metadataName] = metadataDefinition;
		}
		this.schemaMatching = schemaMatching;
		log.trace({schemaMatching:schemaMatching});
	}

	index(extractedMetadata) {
		log.trace('Indexing.');
		var docToIndex = this.transform(extractedMetadata);
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
