'use strict';
var request = require('request-promise');
var asyncPackage = require('async');
var co = require('co');

var concurrentFetches = global.conf.fetch_settings.concurrentFetches || 10;
var linkedinPrefix = global.conf.linkedin_parsing.http_prefix;


class DownloadClient {

	constructor() {
		this.fetchQueue = asyncPackage.queue( (task,callback) => {
			this.doGet(task.url,task.profileId,task.onDone,task.onFailed).then( () => callback() );
		}, concurrentFetches);
	}

	fetchUrl(profileId,onDone,onFailed) {
		var fullLinkedInHttpUrl = linkedinPrefix + profileId;
		this.fetchQueue.push({url:fullLinkedInHttpUrl,onDone:onDone,onFailed:onFailed,profileId:profileId}, function(err) {
			if (err) {
				log.error(err,"Failed to perform task on fetch url.");
			}
		});

		/*co(function*() {
			var html;
			try {
				html = yield this.doGet(url);
			}
			catch (err) {
				yield onFailed(err);
			}
			yield onDone(html);
		}.bind(this));*/
	}

	doGet(url,profileId,onDone,onFailed) {
		return co(function*() {
			try {
				log.info(`Fetching URL ${url}`);
				var options = {
					method:'GET',
					uri:url,
					resolveWithFullResponse: false,
					forever:true,
					timeout:60000
				};
				var html = yield request(options);
				log.info(`Fetching done for ${url}, html length = ${html.length}`);
				onDone({profileId:profileId,html:html});
			}
			catch (err) {
				onFailed(err);
			}
		}.bind(this));


	}
}

module.exports = DownloadClient;
