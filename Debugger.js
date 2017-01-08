var QuantumAdapter = require('./QuantumAdapter.js');

var adapter = new QuantumAdapter();
adapter.subscribeProc();

var showLog = false;
var relay 

adapter.on('message', function(message) {
	var msg = message.toLowerCase().trim();
	if(msg.startsWith('/')) {
		console.log('received: ' + message);
		var cmd = msg.substr(1, msg.length-1).split(' ');
		if(cmd.length >= 1) {
			command(cmd);
		}
	}
});

adapter.on('raw message', function(message) {
	if(showLog) {
		adapter.send(message);
	}
});

adapter.on('connect', function() {
	adapter.sendDebug('Debugger Module Connected.');
});

adapter.on('disconnect', function() {
	adapter.sendDebug('Debugger Module disconnect.');
});

function command(params) {
	if(params[0] == 'show') {
		if(params[1] == 'log') {
			showLog = true;
			adapter.send('Printing Log to output');
		}
	} 
	else if(params[0] == 'hide') {
		if(params[1] == 'log') {
			showLog = false;
			adapter.send('Hiding log');
		}
	}
	else if(params[0] == 'ping') {
		adapter.send('pong');
	}
	else if(params[0] == 'echo') {
		params.shift();
		adapter.send(params.join(' '));
	}
}