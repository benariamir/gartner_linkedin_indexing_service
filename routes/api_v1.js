'use strict';

var router = require('koa-router')({ prefix: '/api_v1' });
var linkedinPrefix = global.conf.linkedin_parsing.http_prefix;

module.exports = function routes(downloadClient,parsingMangager) {

	router.put('/profile/:id',function*() {
		var linkedInProfileId = this.params.id;
		log.trace(`LinkedIdProfile = ${linkedInProfileId}`);
		if (linkedInProfileId === undefined) {
			throw new Error('No LinkedIn profile Id has been given.');
		}
		var fullLinkedInHttpUrl = linkedinPrefix + linkedInProfileId;
		log.trace(`Sending ${fullLinkedInHttpUrl} for future download and parsing.`);
		downloadClient.fetchUrl(fullLinkedInHttpUrl,parsingMangager.parseLinkedInHtml.bind(parsingMangager));
		this.status = 204;
	});

	return router.routes();

};
