'use strict';

class RequestHandler {

	constructor(downloadClient,parsingMangager) {
		this.downloadClient = downloadClient;
		this.parsingMangager = parsingMangager;
	}

	*getProfile(profileId) {
		this.downloadClient.fetchUrl(profileId,this.sucessfulFetch.bind(this),this.failedLinked.bind(this));
	}

	failedLinked(err) {
		log.error(err);
	}

	sucessfulFetch(html) {
		this.parsingMangager.parseLinkedInHtml(html);
	}

}

module.exports = RequestHandler;
