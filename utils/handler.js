const { Collection } = require('discord.js')
const client = require('../index.js').client;
const express = require('express');
const path = require('node:path');
const fetchFiles = require('./fetchFiles.js');

client.commandsArray = [];
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

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
	} catch (e) {
		console.error(e);
	}
}

// Interaction Components (Buttons and Modals)
const buttonsPath = path.join(__dirname, '..', 'interactions', 'buttons');
const buttonFiles = fetchFiles(buttonsPath, ['.js'], new RegExp('^-'));

for (const file of buttonFiles) {
	try {
		const filePath = path.join(buttonsPath, file);
		const button = require(filePath);

		client.buttons.set(button.data.name, button)
	} catch (e) {
		console.error(e);
	}
}

const modalsPath = path.join(__dirname, '..', 'interactions', 'modalResponses');
const modalFiles = fetchFiles(modalsPath, ['.js'], new RegExp('^-'));

for (const file of modalFiles) {
	try {
		const filePath = path.join(modalsPath, file);
		const modal = require(filePath);

		client.modals.set(modal.data.name, modal)
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