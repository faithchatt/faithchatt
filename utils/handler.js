const { Collection } = require('discord.js')
const client = require('../index.js').client;
const express = require('express');
const path = require('node:path');
const fetchFiles = require('./fetchFiles.js');

client.commandsArray = [];
client.commands = new Collection();
// client.events = new Collection();

// Commands
const commandsPath = path.join(__dirname, '..', 'commands');
const commandFiles = fetchFiles(commandsPath, ['.js'], new RegExp('^-'));

for (const commandPath of commandFiles) {
	try {
		const commandFilePath = path.join(commandsPath, commandPath);
		const command = require(commandFilePath);

		client.commands.set(command.data.name, command);
		client.commandsArray.push(command.data.toJSON());
	} catch (e) {
		console.error(e);
	}
}

// Get Events
const eventsPath = path.join(__dirname, '..', 'events');
const eventFiles = fetchFiles(eventsPath, ['.js'], new RegExp('^-'));

for (const file of eventFiles) {
	try {
		const filePath = path.join(eventsPath, file);
		const event = require(filePath);

		if (event.once) client.once(event.name, (...args) => event.execute(...args));
		else client.on(event.name, (...args) => event.execute(...args));
		// client.events.set(event.name, event)
	} catch (e) {
		console.error(e);
	}
}

// Webapp generator
try {
    const server = express();
    server.all("/", (req, res) => {
        res.send("Bot is running!");
    });

    server.listen(3000, () => {
        console.log("Server is ready.");
    });
} catch (error) {
    console.log(error);
}