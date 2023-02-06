require('dotenv').config()
// ==== Node js  ====
const path = require('node:path')
const fs = require('node:fs')
// ==== Discord js  ====
const { Client, GatewayIntentBits, Collection } = require('discord.js')

const { DISCORD_TOKEN } = process.env

// Create a new client instance

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessageReactions,
	],
})

// Load the events files on startup
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs
	.readdirSync(eventsPath)
	.filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file)

	const event = require(filePath)

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args))
	} else {
		client.on(event.name, (...args) => event.execute(...args))
	}
}

// Load the commands file on startup
const commandsPath = path.join(__dirname, 'commands')

client.commands = new Collection()
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file)
	console.log('File path', filePath)
	const command = require(filePath)

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command)
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property`
		)
	}
}

client.login(DISCORD_TOKEN)
