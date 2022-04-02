const { MessageEmbed } = require('discord.js');
const settings = require("../settings.json");

module.exports.run = async (Discord, command, args, channel, message) => {
    
    //Create embed message
    const EmbeddedMessage = new MessageEmbed()
    .setThumbnail('https://cdn.discordapp.com/avatars/546306608511057920/5f4f94b3e6859c3cad891416aab96744.png?size=1024')
    .setColor(settings.color)
    .setTitle('Installatie instructies')
    .setDescription(`
    1. Installeer de [Tampermonkey browserextensie](https://www.tampermonkey.net/).
    *Selecteer de browser die je gebruikt en download Tampermonkey (Stable).*
    2. Installeer het [meest recente script](https://github.com/PlaceNL/Bot/raw/master/placenlbot.user.js). 
    *Als het goed is zal Tampermonkey je aanbieden om een userscript te installeren. Klik op Install/installeren.*
    3. Herlaad je r/place tabblad. 
    *Als alles goed is gegaan, zie je "Accesstoken ophalen..." rechtsbovenin je scherm. De bot is nu actief, en zal je via deze meldingen rechtsbovenin je scherm op de hoogte houden van wat 'ie doet.*
    `)
    .setTimestamp()
    .setFooter({text: 'Template made by picocode'});
        
    message.channel.send({ 
        embeds: [EmbeddedMessage] 
    });
    
};

module.exports.help = {
    name: __filename.slice(__dirname.length + 1, -3),
    description: "Gives a quick guide to scripting"
}