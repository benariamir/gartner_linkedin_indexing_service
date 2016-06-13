'use strict';
var linkedinPrefix = global.conf.linkedin_parsing.http_prefix;

class RequestHandler {

	constructor(downloadClient,parsingMangager) {
		this.downloadClient = downloadClient;
		this.parsingMangager = parsingMangager;
	}

	*getProfile(profileId) {
		var fullLinkedInHttpUrl = linkedinPrefix + profileId;
		this.downloadClient.fetchUrl(fullLinkedInHttpUrl,this.sucessfulFetch.bind(this),this.failedLinked.bind(this));
	}

	failedLinked(err) {
		log.error(err);
	}

	sucessfulFetch(html) {
		this.parsingMangager.parseLinkedInHtml(html);
	}

}

module.exports = RequestHandler;
