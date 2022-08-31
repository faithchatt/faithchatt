const config = require('../config.json');
const { Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');

module.exports = {
	once: true,
	name: 'ready',
	execute(client) {
		console.log(`Bot is ready and logged in as ${client.user.tag}`);
		loadCommands(client);
	}
}

async function loadCommands(client) {
	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

	try {
		console.log('Started refreshing application (/) commands.');
	
		await rest.put(
			Routes.applicationGuildCommands(config.clientId, config.guildId),
			{ body: client.commandsArray },
		);
		
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
}