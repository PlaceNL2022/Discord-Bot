const settings = require("../settings.json");
module.exports.run = async (Discord, command, args, channel, message) => {
    if (!args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }
	
	//Get rid of prefix and say text by getting length of command and length of prefix
    var messages = message.content.substring(command.length + settings.prefix.length);

    message.channel.send(messages.split('@everyone').join('[@]everyone').split('@here').join('[@]here'));
	message.content.includes(`${command} `) && ("dm" === message.channel.type || message.delete({timeout:500}));
}

module.exports.help = {
    name: __filename.slice(__dirname.length + 1, -3),
    description: "Repeats user's message",
	arguments: "message"
}