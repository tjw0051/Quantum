var colors = require('colors');
var QuantumAdapter = require('./QuantumAdapter.js');
const readline = require('readline');

var adapter = new QuantumAdapter();
adapter.subscribeInput();

console.log('\n--- Quantum Console Interface ---\n'.green);

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.on('line', (input) => {
	var lowerInput = input.toLowerCase();
	if(lowerInput == 'connect') {
		adapter.subscribeInput();
	}
	else if(lowerInput == 'disconnect') {
		adapter.disconnect();
	}
	else {
		adapter.send(input);
	}
});

adapter.on('message', function(message) {
	console.log(message);
});

adapter.on('connect', function() {
	console.log('Quantum adapter plugged in.'.yellow);
	adapter.sendDebug('ConsoleInput Module Connected.');
});

adapter.on('disconnect', function() {
	console.log('Quantum adapter unplugged.'.yellow);
	adapter.sendDebug('ConsoleInput Module disconnect.');
});