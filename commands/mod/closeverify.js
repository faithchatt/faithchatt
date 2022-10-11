const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('closeverify')
		.setDescription('Closes the pending verification ticket'),
	async execute(interaction) {
        // code goes here
	},
};