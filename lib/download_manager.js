'use strict';
var concurrentFetches = global.conf.fetch_settings.concurrentFetches || 10;
var linkedinPrefix = global.conf.linkedin_parsing.http_prefix;
var asyncPackage = require('async');
var co = require('co');

// class to handle LinkedIn profile fetching
class ProfileDownloadManager {

	// constructor gets a download client, mainly for testing purposes
	constructor(downloadClient) {
		// as fetching is done concurrently and throttled an async queue is needed to perform future tasks.
		this.fetchQueue = asyncPackage.queue( (task,callback) => {
			this.executeFetch(task.profileId,task.onDone,task.onFailed).then( () => callback() );
		}, concurrentFetches);
		this.downloadClient = downloadClient;
	}

	// function to call when a profile fetch is needed.
	fetchProfile(profileId,onDone,onFailed) {
		// push task to queue with all the parameters.
		this.fetchQueue.push({profileId:profileId,onDone:onDone,onFailed:onFailed}, function(err) {
			if (err) {
				log.error(err,"Failed to perform task on fetch url.");
			}
		});
	}

	// function is fired when task is taken from the async fetchQueue
	executeFetch(profileId,onDone,onFailed) {
		// create a full link to fetch from the profileId.
		var fullLinkedInHttpUrl = linkedinPrefix + profileId;
		// a co is needed as doGet is a generator function which returns a promise.
		return co(function* () {
			log.info(`Fetching URL ${fullLinkedInHttpUrl}`);
			var html = yield this.downloadClient.doGet(fullLinkedInHttpUrl);
			log.info(`Fetchin of ${fullLinkedInHttpUrl} complete. Html length is ${html.length}`);
			// an onDone/onFailed function is required here as fetching is done asynchornously and results may be transferred to different entities (currently there's only one parsing manager)
			onDone({profileId:profileId,html:html});
		}.bind(this))
		.catch(function(err) {
			log.error(err);
			onFailed(err);
		});
	}

}

module.exports = ProfileDownloadManager;
