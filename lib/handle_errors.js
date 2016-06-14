// error handling middleware for Koa
module.exports = function* handleErrors(next) {
	try {
		yield next;
	}
	catch (err) {
		log.error(`Error handling request to ${this.path}`,{err:err, req:this.request,body:this.request.body});
		this.body = err.message;
		this.status = err.statusCode || 500;
	}

};
