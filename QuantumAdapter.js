var inherits = require('util').inherits;
var redis = require('redis');
const EventEmitter = require('events').EventEmitter;

class QuantumAdapter extends EventEmitter {
	constructor() {
		super();
		this.sub = redis.createClient();
		this.pub = redis.createClient();

		this.inputChannel = 'quantum_input';
		this.procChannel = 'quantum_output';

		/*	Subscriber id	*/
		this.id = Math.floor((Math.random() * 10000) + 1);

		/*	Inter-process Channels	*/
		this.activeChannel = '';

		this.receiveType = '';
		this.sendType = '';
		this.adapter;

		EventEmitter.call(this);

		var self = this;
		/*	Redis Events 	*/
		this.sub.on('subscribe', function(channel, count) {
			self.emit('connect');
		});
		this.sub.on('unsubscribe', function(channel, count) {
			self.emit('disconnect');
		});
		this.sub.on('message', function(channel, message) {
			var msg = JSON.parse(message);
			if(channel != self.activeChannel) { 
				return;
			} else if(msg.id == self.id || msg.type == self.sendType) {
				return;
			} else if(msg.mode == 'd') {
				self.emit('debug', msg.msg);
				self.emit('raw message', message);
			} else {
				self.emit('message', msg.msg);
				self.emit('raw message', message);
			}
		});
		this.sub.on('error', function(err) {
			console.log('Error: ' + err);
		});
		this.pub.on('error', function(err) {
			console.log('Error: ' + err);
		});
	}
	
	subscribeInput() {
		this.sub.subscribe(this.inputChannel);
		this.activeChannel = this.inputChannel;
		this.receiveType = 'in';
		this.sendType = 'proc';
	}

	subscribeProc() {
		this.sub.subscribe(this.procChannel);
		this.activeChannel = this.procChannel;
		this.receiveType = 'proc';
		this.sendType = 'in';
	}

	disconnect() {
		this.sub.unsubscribe();
		this.sub.quit();
		this.pub.quit();
	}

	send(message) {
		var msg = {id: this.id, type: this.sendType, mode: '', msg: message}
		this.pub.publish(this.activeChannel, JSON.stringify(msg));
	}

	sendDebug(message) {
		var msg = {id: this.id, type: this.sendType, mode: 'd', msg: message}
		this.pub.publish(this.activeChannel, JSON.stringify(msg));
	}

	sendDebugRaw(message) {
		var msg = JSON.parse(message);
		msg.id = this.id;
		this.pub.publish(this.activeChannel, JSON.stringify(msg));

		this.pub.publish(this.activeChannel, message);
	}

	sendRaw(message) {
		var msg = JSON.parse(message);
		msg.id = this.id;
		this.pub.publish(this.activeChannel, JSON.stringify(msg));
	}

	setType(recType, senType) {
		this.receiveType = recType;
		this.sendType = senType;
	}
}

module.exports = QuantumAdapter;