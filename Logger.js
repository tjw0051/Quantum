var fs = require('fs');

function Logger() {
	if (! (this instanceof Logger)){
		logger = new Logger();
		return logger;
	} 
}

Logger.prototype.log = function log(tag, msg) {
	fs.appendFile('quantum.log','[' + getTimestamp() + '] ' + tag + ': ' + msg + '\n', function(err) {
	});
}

function getTimestamp() {
	return new Date().toISOString().
  replace(/T/, ' ').      // replace T with a space
  replace(/\..+/, '');     // delete the dot and everything after
}

module.exports = Logger;