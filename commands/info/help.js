const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('A small documentation for FaithChatt Utilities slash commands'),
	async execute(interaction) {
		await interaction.reply(`Pong! You have ${interaction.client.ws.ping} ms.`);
	},
};