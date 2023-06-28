const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whois')
		.setDescription('Replies with interaction user with tag!')
		.addUserOption(option => option.setName('user').setDescription('User to be unjailed').setRequired(true)),
	async execute(interaction) {
		const member = await interaction.options.get('user').member;
		await interaction.reply({ content: `${member.user.tag}\n${member.user.id}`});
	},
};