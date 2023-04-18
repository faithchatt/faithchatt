const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require('discord.js')

module.exports = {
    data: {
        name: 'verifyAssess'
    },
    async execute(interaction) {
        const embed_assess = new EmbedBuilder()
            .setTitle('Verification Assessment Menu')
            .setDescription('By clicking the buttons below, you as a moderator have the right to either approve or deny the membership ticket.')
            .setColor('#ffd100')
            .setFooter({ text: '©️ FaithChatt Forum' })
        const embed_notstaff = new EmbedBuilder()
            .setTitle('You are not allowed to use this button.')
            .setColor('#ff0000')
            .setFooter({ text: '©️ FaithChatt Forum' })
        const approvebutton = new ButtonBuilder()
            .setCustomId('verifyApprove')
            .setLabel('Approve the verification')
            .setStyle(ButtonStyle.Success)
            .setEmoji('✅')
        const denybutton = new ButtonBuilder()
            .setCustomId('verifyDeny')
            .setLabel('Deny the verification')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🛑')
        const forceclosebutton = new ButtonBuilder()
            .setCustomId('verifyForceClose')
            .setLabel('Force close the ticket (ADMIN ONLY)')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('🔐')
        const row = new ActionRowBuilder().addComponents(approvebutton, denybutton, forceclosebutton)

        const perms = PermissionsBitField.Flags
        const staff = perms.BanMembers || perms.KickMembers

        if(!interaction.member.permissions.has(staff)) return interaction.reply({ embeds: [embed_notstaff], ephemeral: true })
        await interaction.reply({ embeds: [embed_assess], components: [row], ephemeral: true })
    }
}