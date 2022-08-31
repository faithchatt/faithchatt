const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Replies with interaction user with tag!'),
	async execute(interaction) {
		await interaction.reply(interaction.user.tag);
	},
};