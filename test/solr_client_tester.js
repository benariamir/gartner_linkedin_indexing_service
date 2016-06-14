'use strict';

class SolrClientTester {

	constructor() {
		this.docs = {};
		log.trace('SolrClientTester has been constructed.');
	}

	pingAsync() {
		log.info('SolrClientTester: ping!');
		return {"ping":true};
	}

	addAsync(doc) {
		log.info('SolrClientTester: adding doc.');
		this.docs[doc.id] = doc;
		log.info('SolrClientTester: doc added');
		return {'added':true};
	}

	commitAsync() {
		log.info('SolrClientTester: Commited.');
		return {'commited':true};
	}

}
module.exports = SolrClientTester;
