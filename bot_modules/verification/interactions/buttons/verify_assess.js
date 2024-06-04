const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, PermissionsBitField } = require("discord.js");

module.exports = {
    data: {
        name: "verifyAssess",
    },
    /**
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    async execute(interaction) {
        const assessEmbed = new EmbedBuilder()
            .setTitle("Verification Assessment Menu")
            .setDescription("By clicking the buttons below, you as a moderator have the right to either approve or deny the membership ticket.")
            .setColor("#ffd100")
            .setFooter({ text: "©️ FaithChatt Forum" });
        const notStaffEmbed = new EmbedBuilder()
            .setTitle("You are not allowed to use this button.")
            .setColor("#ff0000")
            .setFooter({ text: "©️ FaithChatt Forum" });
        const approveButton = new ButtonBuilder()
            .setCustomId("verifyApprove")
            .setLabel("Approve the verification")
            .setStyle(ButtonStyle.Success)
            .setEmoji("✅");
        const denyButton = new ButtonBuilder()
            .setCustomId("verifyDeny")
            .setLabel("Deny the verification")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("🛑");
        const forceCloseButton = new ButtonBuilder()
            .setCustomId("verifyForceClose")
            .setLabel("Force close the ticket (ADMIN ONLY)")
            .setStyle(ButtonStyle.Danger)
            .setEmoji("🔐");
        const row = new ActionRowBuilder().addComponents(approveButton, denyButton, forceCloseButton);

        const perms = PermissionsBitField.Flags;
        const staffPerms = perms.BanMembers || perms.KickMembers;

        if (!interaction.member.permissions.has(staffPerms)) return interaction.reply({ embeds: [notStaffEmbed], ephemeral: true });
        await interaction.reply({ embeds: [assessEmbed], components: [row], ephemeral: true });
    },
};
