const { Collection, EmbedBuilder, AttachmentBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { textId, parentId, rolesId } = require('../../utils/variables')
const perm = PermissionsBitField.Flags
const schema = require('../../model/jailsystem.js')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unjail')
		.setDescription('Unjails a member')
        .addUserOption(option => option.setName('user').setDescription('User to be unjailed').setRequired(true)),
	async execute(interaction) {
        const member = await interaction.options.get('user').member
        if(!interaction.member.permissions.has(perm.BanMembers || perm.KickMembers)) return interaction.reply({
            embeds: [new EmbedBuilder()
            .setDescription("❌ | You are not a staff member authorized to use this command.")
            .setColor("#ff0000")],
            ephemeral: true
        }) 
        if(interaction.channel.parent.id === parentId.jail) {
            if(!member.user) {
                await interaction.reply(`**The member is no longer available. Closing the channel.**`)
                try {
                    let data = await schema.findOne({ userId: member.user.id });
                    if(data.userId !== member.user.id) return await data.deleteOne({ userId });
                } catch (error) {
                    console.log(error);
                }
            } else if (member.user === interaction.user) {
                await interaction.reply(`**You cannot unjail yourself.**`)
            } else {
                await interaction.reply(`\*\*${member.user.tag}\*\* has been unjailed.\n**The channel closes in five seconds.**`)
                try {
                    let data = await schema.findOne({ userId: member.user.id });
                    if(data.userId !== member.user.id) return await data.deleteOne({ userId: member.user.id });
                } catch (error) {
                    console.log(error);
                }
            }
        } else return interaction.reply({
            embeds: [new EmbedBuilder()
            .setDescription("❌ | You are not allowed to execute outside the jail category.")
            .setColor("#ff0000")],
            ephemeral: true
        }) 
	},
};