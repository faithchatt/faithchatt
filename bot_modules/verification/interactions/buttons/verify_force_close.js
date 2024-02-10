const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const ticketModel = require("../../../../model/ticket.js");
const embedFactory = require("../../../../utils/embedFactory.js");
const verificationSystem = require("../../utils/verification_system.js");

/**
 * Force closes a verification ticket.
 *
 * @param {import("discord.js").ButtonInteraction} interaction - The interaction object.
 * @param {import("discord.js").GuildMember} targetMember - The target member.
 * @param {ticketModel} ticketData - The ticket data.
 * @return {Promise<void>} Returns nothing.
 */
async function verifyForceCloseTicket(interaction, targetMember, ticketData) {
    await interaction.deferUpdate();
    await interaction.channel.send({ content: `**Verification ticket closes in five seconds.**` });
    try {
        await ticketModel.findOne({ userId: targetMember.user.id }).then(async () => {
            await ticketData.deleteOne({ userId: targetMember.user.id });
        });
    }
    catch (error) {
        console.log(error);
    }
    setTimeout(async () => interaction.channel.delete(), 5000);
}

module.exports = {
    data: {
        name: "verifyForceClose",
    },
    /**
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    async execute(interaction) {
        const ticketData = await ticketModel.findOne({ channelId: interaction.channel.id });
        const targetMember = await interaction.guild.members.cache.get(ticketData.userId);
        const perms = PermissionsBitField.Flags;
        const staffPerms = perms.Administrator;

        const notStaffEmbed = new EmbedBuilder()
            .setTitle("ADMIN ONLY | You are not allowed to use this button.")
            .setColor("#ff0000")
            .setFooter({ text: "©️ FaithChatt Forum" });
        if (!interaction.member.permissions.has(staffPerms)) return interaction.reply({ embeds: [notStaffEmbed], ephemeral: true });

        try {
            await verificationSystem.logAction(interaction, targetMember, embedFactory.VerificationEmbedType.ForceClosedLog);
            await verifyForceCloseTicket(interaction, targetMember, ticketData);
        }
        catch (error) {
            console.error(error);
        }
    },
};
