'use strict';
var concurrentFetches = global.conf.fetch_settings.concurrentFetches || 10;
var linkedinPrefix = global.conf.linkedin_parsing.http_prefix;
var asyncPackage = require('async');
var co = require('co');

class ProfileDownloadManager {

	constructor(downloadClient) {
		this.fetchQueue = asyncPackage.queue( (task,callback) => {
			this.executeFetch(task.profileId,task.onDone,task.onFailed).then( () => callback() );
		}, concurrentFetches);
		this.downloadClient = downloadClient;
	}

	fetchProfile(profileId,onDone,onFailed) {
		this.fetchQueue.push({profileId:profileId,onDone:onDone,onFailed:onFailed}, function(err) {
			if (err) {
				log.error(err,"Failed to perform task on fetch url.");
			}
		});
	}

	executeFetch(profileId,onDone,onFailed) {
		var fullLinkedInHttpUrl = linkedinPrefix + profileId;
		return co(function* () {
			log.info(`Fetching URL ${fullLinkedInHttpUrl}`);
			var html = yield this.downloadClient.doGet(fullLinkedInHttpUrl);
			log.info(`Fetchin of ${fullLinkedInHttpUrl} complete. Html length is ${html.length}`);
			onDone({profileId:profileId,html:html});
		}.bind(this))
		.catch(function(err) {
			log.error(err);
			onFailed(err);
		});
	}

}

module.exports = ProfileDownloadManager;
