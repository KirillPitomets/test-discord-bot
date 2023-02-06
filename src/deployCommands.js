require('dotenv').config()
// ==== Discord js  ====
const { REST, Routes } = require('discord.js')
const { GUILD_ID, CLIENT_ID, DISCORD_TOKEN } = process.env
// ==== NodeJS ====
const fs = require('node:fs')
const path = require('node:path')

const commands = []

// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
	.readdirSync(path.join(__dirname, 'commands'))
	.filter(file => file.endsWith('.js'))

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deploy

for (const file of commandFiles) {
	const command = require(path.join(__dirname, 'commands', file))
	commands.push(command.data.toJSON())
}

// Construct and prepare an instance of the REST module

const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN) // And deploy your commands

;(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands`
		)

		// The put method is used ti fully refresh all commands in the guild with
		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands }
		)

		console.log(`Successfully reloaded ${data.length} application (/) commands`)
	} catch (err) {
		console.log(err)
	}
})()