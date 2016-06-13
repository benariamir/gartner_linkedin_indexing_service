'use strict';
var linkedinPrefix = global.conf.linkedin_parsing.http_prefix;

class RequestHandler {

	constructor(downloadClient,parsingMangager) {
		this.downloadClient = downloadClient;
		this.parsingMangager = parsingMangager;
	}

	*getProfile(profileId) {
		var fullLinkedInHttpUrl = linkedinPrefix + profileId;
		this.downloadClient.fetchUrl(fullLinkedInHttpUrl,this.parsingMangager.parseLinkedInHtml.bind(this.parsingMangager),this.failedLinked.bind(this));
	}

	failedLinked(err) {
		log.error(err);
	}

}

module.exports = RequestHandler;
