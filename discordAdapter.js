var QuantumAdapter = require('./QuantumAdapter.js');
var Discord = require('discord.js');
var bot = new Discord.Client();

bot.login("MjY1Mjk2MTE3NTg2MDY3NDY4.C0tD-Q.hINq3xMkct7MLgaX6bNC6-2GI8w");
var adapter = new QuantumAdapter();
adapter.subscribeInput();

var currentChannel;

bot.on('ready', () => {
	console.log('Discord Connected');
});

bot.on('message', msg => {
	currentChannel = msg.channel;
	adapter.send(msg.content);
});

function pushServer(msg, sender, channel) {
	var jsonMsg = {'sender':sender, 'type': 'input', 'chan':'discord', 'schan':channel, 'msg': msg};
	pub.publish(channelName, JSON.stringify(jsonMsg));	
}

adapter.on('message', function(message) {
	if(currentChannel) {
		currentChannel.sendMessage(message);
	}
});



