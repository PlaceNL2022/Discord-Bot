const { Client, Intents, MessageEmbed } = require('discord.js');
const settings = require("../settings.json");
const fs = require('fs')

//Custom error function with red text.
console.err = function(text){
	return console.log("\x1b[31mERROR\x1b[0m:", text)
}

module.exports.run = async (Discord, command, args, channel, message) => {
    var all_commands = []
    var prefix = settings.prefix
    fs.readdir('./commands/', (error, files) => {
        if(error) console.err(error);
      
		//Array of javascipt files in ./commands/
		let FileArray = files.filter(files => files.split('.').pop() === 'js')
		if (FileArray.length <= 0)  {
			return message.channel.send("Could not find any commands."); 
		}

		//Check for each file for description, arguments and name
        FileArray.forEach(file =>{
            let props = require(`./${file}`);

			//If we do not have any arguments
			if (!props.help.arguments){
				all_commands.push(`${prefix}${file.slice(0, -3)} [**${props.help.description}**]`)
			}
			else
			{
				all_commands.push(`${prefix}${file.slice(0, -3)} _\`${props.help.arguments}\`_ [**${props.help.description}**]`)	
			}
        });

		//Create embed message
        const EmbeddedMessage = new MessageEmbed()
        .setThumbnail('https://cdn.discordapp.com/avatars/546306608511057920/5f4f94b3e6859c3cad891416aab96744.png?size=1024')
        .setColor(settings.color)
        .setDescription(`
			My prefix is **${prefix}**

            **Commands**:

			${all_commands.join(" \n")}
		`)
		.setTimestamp()
        .setFooter({text: 'Template made by picocode'});
			
        message.channel.send({ 
			embeds: [EmbeddedMessage] 
		});
    });
};

module.exports.help = {
    name: __filename.slice(__dirname.length + 1, -3),
    description: "Shows all supported commands"
}