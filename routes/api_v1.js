'use strict';

var router = require('koa-router')({ prefix: '/api_v1' });

module.exports = function routes(requestHandler) {

	router.put('/profile/:id',function*() {
		var linkedInProfileId = this.params.id;
		log.trace(`LinkedIdProfile = ${linkedInProfileId}`);
		if (linkedInProfileId === undefined) {
			throw new Error('No LinkedIn profile Id has been given.');
		}
		yield requestHandler.getProfile(linkedInProfileId);
		this.status = 204;
	});

	return router.routes();

};
