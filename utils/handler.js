const { Collection } = require("discord.js");
const client = require("../index.js").client;
const express = require("express");
const path = require("node:path");
const fetchFiles = require("./fetchFiles.js");
const fs = require("fs");

const fileIgnoreRegex = new RegExp("^-");
client.commandsArray = [];
client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();

// Commands
// Load commands from the specified directory path
/**
 * Load commands from the specified directory path
 * @param {string} commandsPath - The path to the directory containing command files
 */
function loadCommands(commandsPath) {
    const commandFiles = fetchFiles(commandsPath, [".js"], fileIgnoreRegex);

    for (const commandPath of commandFiles) {
        try {
            const commandFilePath = path.join(commandsPath, commandPath);
            const command = require(commandFilePath);

            client.commands.set(command.data.name, command);
            client.commandsArray.push(command.data.toJSON());

            console.debug("command " + command.data.name + " loaded from " + commandFilePath);
        }
        catch (e) {
            console.error(e);
        }
    }
}
{
    // Scoped constant
    const commandsPath = path.join(__dirname, "..", "commands");
    loadCommands(commandsPath);
}

// Get Events
/**
 * Load events from the specified directory path.
 * @param {string} eventsPath - The path to the directory containing event files.
 */
function loadEvents(eventsPath) {
    const eventFiles = fetchFiles(eventsPath, [".js"], fileIgnoreRegex);

    for (const file of eventFiles) {
        try {
            const filePath = path.join(eventsPath, file);
            const event = require(filePath);

            if (event.once) client.once(event.name, (...args) => event.execute(...args));
            else client.on(event.name, (...args) => event.execute(...args));

            console.debug("event " + event.name + " loaded from " + filePath);
        }
        catch (e) {
            console.error(e);
        }
    }
}
{
    // Scoped constant
    const eventsPath = path.join(__dirname, "..", "events");
    loadEvents(eventsPath);
}

// Interaction Components (Buttons and Modals)
/**
 * Load interactions (buttons and modals) from the specified directory path.
 * @param {string} interactionsPath - The path to the directory containing the buttons and modal_responses folders
 */
function loadInteractions(interactionsPath) {
    const buttonsPath = path.join(interactionsPath, "buttons");

    if (fs.existsSync(buttonsPath) && fs.statSync(buttonsPath).isDirectory()) {
        const buttonFiles = fetchFiles(buttonsPath, [".js"], fileIgnoreRegex);

        for (const file of buttonFiles) {
            try {
                const filePath = path.join(buttonsPath, file);
                const button = require(filePath);

                client.buttons.set(button.data.name, button);
                console.debug("button " + button.data.name + " loaded from " + filePath);
            }
            catch (e) {
                console.error(e);
            }
        }
    }

    const modalsPath = path.join(interactionsPath, "modal_responses");

    if (fs.existsSync(modalsPath) && fs.statSync(modalsPath).isDirectory()) {
        const modalFiles = fetchFiles(modalsPath, [".js"], fileIgnoreRegex);

        for (const file of modalFiles) {
            try {
                const filePath = path.join(modalsPath, file);
                const modal = require(filePath);

                client.modals.set(modal.data.name, modal);
                console.debug("modal " + modal.data.name + " loaded from " + filePath);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}
{
    // Scoped constant
    const interactionsPath = path.join(__dirname, "..", "interactions");
    loadInteractions(interactionsPath);
}

// Load bot modules
const botModulesPath = path.join(__dirname, "..", "./bot_modules");
const botModules = fs.readdirSync(botModulesPath);

for (const i in botModules) {
    const moduleName = botModules[i];
    const modulePath = path.join(botModulesPath, moduleName);
    const commandsPath = path.join(modulePath, "commands");
    const eventsPath = path.join(modulePath, "events");
    const interactionsPath = path.join(modulePath, "interactions");
    // const modelsPath = path.join(modulePath, "models");

    console.log(`Loading module "${moduleName}".`);
    if (fs.existsSync(commandsPath) && fs.statSync(commandsPath).isDirectory()) {
        loadCommands(commandsPath);
    }
    if (fs.existsSync(eventsPath) && fs.statSync(eventsPath).isDirectory()) {
        loadEvents(eventsPath);
    }
    if (fs.existsSync(interactionsPath) && fs.statSync(interactionsPath).isDirectory()) {
        loadInteractions(interactionsPath);
    }
}

// Webapp generator
try {
    const server = express();
    server.all("/", (req, res) => {
        res.send("Bot is running!");
    });

    server.listen(3123, () => {
        console.log("Server is ready.");
    });
}
catch (error) {
    console.log(error);
}
