//Requirements
const {Client} = require('discord.js');
const Discord = require('discord.js');
const fs = require('fs')
const https = require('https')
const WebSocket = require('ws')

const ip = 'placenl.noahvdaa.me'
const reconnect_time = 5


// Websocket connect
function connect() {
	const ws = new WebSocket(`wss://${ip}/api/ws`, {
		headers: {
			Origin: ip,
			'User-Agent': 'DISCORD_BOT',
		}
	})

	ws.on('open', function () {
		template_channel = bot.channels.cache.get('959940846587887636');


		console.log('Connected.')
		setInterval(()=>{
			ws.send(JSON.stringify({
				type: 'ping' 
			}))
		}, 10000)

	})

	ws.on('close', function () {
		console.log(`Lost connection, reconnecting in ${reconnect_time} second(s).`)
		setTimeout(function () {
			connect();
		}, reconnect_time * 1000);
	})

	ws.on('message', function (d) {
		try {
			var json = JSON.parse(String(d));
			if (json.type == 'map') {
				console.log(json)
				// {"type":"map","data":"1648937116990.png","reason":"Tijdelijk geen master chief"}
				const EmbeddedMessage = new MessageEmbed()
				.setThumbnail(`https://placenl.noahvdaa.me/maps/${json.data}`)
				.setColor(settings.color)
				.setTitle(`Reden: ${json.reason}`)
				.setDescription(`[Link of image](https://placenl.noahvdaa.me/maps/${json.data})`)
				.setTimestamp()
				.setFooter({text: 'Template made by github.com/picocode1'});
					
				template_channel.send({ 
					embeds: [EmbeddedMessage] 
				});
				return
			}
		} catch (error) {
			console.err(error)
		}
	})

	ws.on('error', function (e) {
		console.err(e)
	})
}



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
	if (message.channelId == "959328150427435023"){
		message.react('✅');
		message.react('❌');
	}

	if (!message.content.startsWith(settings.prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();
	
	if (message.content == prefix) {
		message.channel.send('Please specify a command.');
	}
	
	let commandfile = bot.commands.get(command);
	
	if (commandfile) {
		console.log(`Running command: ${command}, in channel: ${message.channel.name} message: ${message}`);
		commandfile.run(Discord, command, args, message.channel, message);
	}
});

process.on('uncaughtException', function (exception) {
	console.err(exception);
});


bot.on('ready', async (message) => {
	console.log(`Logged in as ${bot.user.tag} current prefix: ${settings.prefix}`);

 	//Connect with websocket
 	connect()

	setInterval(() => {
		try {
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
		} catch (error) {
			console.err(error)
		}
	}, 6000) // Every 6 seconds update discord status
});

bot.login(settings.token);
