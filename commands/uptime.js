//Define date once, so we don't update this value on every command
var date = new Date();

module.exports.run = async (Discord, command, args, channel, message) => {
    message.channel.send("De bot is online sinds " + date.toLocaleString());
};

module.exports.help = {
    name: __filename.slice(__dirname.length + 1, -3),
    description: "Displays bot online time"
}