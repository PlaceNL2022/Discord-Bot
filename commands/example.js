//This is where your code will run
module.exports.run = async (Discord, command, args, channel, message) => {
 console.log(`New message! ${message} ${args}`)
 message.channel.send(`Command: "${command}" arguments: "${args}" channel: "${channel}"`);
};

//Here you define the description of the command, the name of the command and the arguments.
//The name of the command is the name of the file.
module.exports.help = {
 name: __filename.slice(__dirname.length + 1, -3),
 description: "Example command",
 arguments: "example argument"
}