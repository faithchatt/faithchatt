const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('lock')
		.setDescription('Locks the text channel'),
	async execute(interaction) {
        // code goes here
	},
};