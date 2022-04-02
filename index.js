//Requirements
const {Client} = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs')
const https = require('https')

//Getting prefix, token from settings.json
const settings = require('./settings.json');

//Initializing discord bot with intents
const bot = new Client({
	intents: Object.values(Discord.Intents.FLAGS)
});

//Creating new collection for bot commands
bot.commands = new Discord.Collection();

//Setting prefix
let prefix = settings.prefix;


// Request for getting the connection count
const options = {
	hostname: 'placenl.noahvdaa.me',
	port: 443,
	path: '/api/stats',
	method: 'GET',
	headers: { 'User-Agent': 'DISCORD_BOT' }
}


fs.readdir('./commands/', (error, files) => {
	if (error) console.err(error);

	//Array of javascipt files in ./commands/
	let jsfile = files.filter(files => files.split('.').pop() === 'js')
	if (jsfile.length <= 0)  {
		console.err("Could not find any commands."); 
		return process.exit(1)
	}
	
	//For every javascript file in ./commands/ add it to the collection.
	jsfile.forEach((files) => {
		//Require the module
		let module = require(`./commands/${files}`);
		console.log(`${files.slice(0, -3)} loaded - ${module.help.description}`);
		bot.commands.set(module.help.name, module);
	});
});

//Command Manager
bot.on('messageCreate', async message => {
	if (!message.content.startsWith(settings.prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	
	if (message.content == prefix) {
		message.channel.send('Please specify a command.');
	}
	
	let commandfile = bot.commands.get(command);
	
	if (commandfile) {
		console.log(`Running command: ${command}, in channel: ${message.channel.name}`);
		commandfile.run(Discord, command, args, message.channel, message);
	}
});

bot.on('ready', async (message) => {
	console.log(`Logged in as ${bot.user.tag} current prefix: ${settings.prefix}`);

	setInterval(() => {
		https.get(options, (res) => {
			let data = '';

			res.on('data', (chunk) => {
				data += chunk;
			});
			
			res.on('end', () => {
				var json = JSON.parse(data)
				bot.user.setPresence({		
					activities: [{
						name: `${json.connectionCount} gebruikers`,
						type: "WATCHING" // PLAYING STREAMING LISTENING WATCHING COMPETING
					}],
					status: 'online'
				})
			});
		}).on('error', (err) => {
			console.log("Error: " + err.message);
		});
	}, 6000) // Every 6 seconds update discord status
});

bot.login(settings.token);
