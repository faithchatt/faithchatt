const { Collection, EmbedBuilder, AttachmentBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { textId, parentId, rolesId } = require('../../utils/variables')
const permflag = PermissionsBitField.Flags
const schema = require('../../model/jailsystem')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modnick')
		.setDescription('Changes a randomized nickname for user')
        .addUserOption(option => option.setName('user').setDescription('User to be unjailed').setRequired(true)),
	async execute(interaction) {
        const member = await interaction.options.get('user').member
        if(!interaction.member.permissions.has(permflag.ChangeNickname)) return interaction.reply({
            embeds: [new EmbedBuilder()
            .setDescription("❌ | You are not a staff member authorized to use this command.")
            .setColor("#ff0000")],
            ephemeral: true
        })

        // code goes here
	},
};