const { Collection, EmbedBuilder, AttachmentBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { textId, parentId, rolesId } = require('../../utils/variables')
const permflag = PermissionsBitField.Flags
const schema = require('../../model/jailsystem')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unjail')
		.setDescription('Unjails a member')
        .addUserOption(option => option.setName('user').setDescription('User to be unjailed').setRequired(true)),
	async execute(interaction) {
        const member = await interaction.options.get('user').member
        if(!interaction.member.permissions.has(permflag.BanMembers || permflag.KickMembers)) return interaction.reply({
            embeds: [new EmbedBuilder()
            .setDescription("❌ | You are not a staff member authorized to use this command.")
            .setColor("#ff0000")],
            ephemeral: true
        }) 
        if(interaction.channel.parent.id === parentId.jail) {
            await interaction.reply(`\*\*${member.user.tag}\*\* has been unjailed`)
        } else return interaction.reply({
            embeds: [new EmbedBuilder()
            .setDescription("❌ | You are not allowed to execute outside the jail category.")
            .setColor("#ff0000")],
            ephemeral: true
        }) 
	},
};