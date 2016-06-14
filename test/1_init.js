require('./../config/conf')

var chai = require('chai')
global.expect = chai.expect
global.co = require('co')
global.sinon = require('sinon')
chai.use(require('sinon-chai'))
global.conf = require('../config/appsettings');
