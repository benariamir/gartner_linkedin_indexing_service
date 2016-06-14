'use strict';

// class to handle requests
class RequestHandler {

	constructor(downloadClient,parsingMangager) {
		this.downloadClient = downloadClient;
		this.parsingMangager = parsingMangager;
	}

	*getProfile(profileId) {
		this.downloadClient.fetchProfile(profileId,this.sucessfulFetch.bind(this),this.failedLinked.bind(this));
	}

	// this is error handling fired when an async fetch is done. There's no definition to business logic what to do with it
	// but basically there should be a way to notify the user that is has failed
	failedLinked(err) {
		log.error(err);
	}

	// fired upon sucessfulFetch and sent to parsing.
	sucessfulFetch(html) {
		this.parsingMangager.parseLinkedInHtml(html);
	}

}

module.exports = RequestHandler;
