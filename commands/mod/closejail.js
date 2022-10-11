const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('closejail')
		.setDescription('Closes the jail ticket manually'),
	async execute(interaction) {
        // code goes here
	},
};