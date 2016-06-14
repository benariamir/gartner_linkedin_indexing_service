'use strict';

var bunyan = require('bunyan');
var mkdirp = require('mkdirp');

var logsDir = `${__dirname}/../logs`;
mkdirp.sync(logsDir);

var process = require('process');
var config = require('./config');

var bunyanStreams = [
	{ path: `${logsDir}/svc.log` },
	{ stream: process.stdout }
];

global.log = bunyan.createLogger({
	name: 'linekding_indexing_service',
	level: config.log_level,
	serializers: bunyan.stdSerializers,
	streams: bunyanStreams
});
