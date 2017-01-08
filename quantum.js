var redis = require('redis');
var colors = require('colors');
var Logger = require('./Logger.js');
var QuantumAdapter = require('./QuantumAdapter.js');

var log = new Logger();

var inputAdapter = new QuantumAdapter();
var procAdapter = new QuantumAdapter();


inputAdapter.subscribeInput();
inputAdapter.setType('proc', 'in');
procAdapter.subscribeProc();
procAdapter.setType('in', 'proc');

console.log('\n--- Quantum Bot Online ---\n'.green);

/*	Input adapter 	*/
inputAdapter.on('connect', function() {
});
inputAdapter.on('disconnect', function() {
});

inputAdapter.on('raw message', function(message) {
	console.log("input: " + message);
	log.log(message);
	procAdapter.sendRaw(message);
});

inputAdapter.on('debug', function(message) {
});


/*	Proc adapter 	*/

procAdapter.on('connect', function() {
});
procAdapter.on('disconnect', function() {
});

procAdapter.on('raw message', function(message) {
	console.log("proc: " + message);
	log.log(message);
	inputAdapter.sendRaw(message);
	//mediate(message, 'proc');
});

procAdapter.on('debug', function(message) {
});




