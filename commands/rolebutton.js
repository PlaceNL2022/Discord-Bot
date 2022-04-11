const modRoleId = '958751634089967727'

const settings = require("../settings.json");
module.exports.run = async (Discord, command, args, channel, message) => {
    if (message.guild == null) {
        return;
    }

    if (!message.member.roles.cache.some(r => r.id == modRoleId)) {
        return message.channel.send({content: "Only moderators can use this command."});
    }

    if (!args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }

    const role = await message.guid.roles.fetch(args[0]);
    if (role == null) {
        return message.reply(`Unknown role with id '${args[0]}'`);
    }

	// //Get rid of prefix and say text by getting length of command and length of prefix
    // var messages = message.content.substring(command.length + settings.prefix.length);
    iconUrl = role.iconUrl()

    const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .stCustomId(`role_${role.id}`)
                .setLabel(`${iconUrl ? `${iconUrl} ` : ''}**${role.name}**`)
                .setStyle('PRIMARY'));

    message.channel.send({
                            content: `Klik op de knop voor de rol **${role.name}**`,
                            components: [row],
                        });
}

module.exports.help = {
    name: __filename.slice(__dirname.length + 1, -3),
    description: "Moderator command for creating button that gives a role.",
	arguments: "role id"
}