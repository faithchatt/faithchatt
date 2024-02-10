const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const { rolesId, textId } = require("../../../..//utils/variables");
const ticketModel = require("../../../../model/ticket.js");
const embedFactory = require("../../../../utils/embedFactory.js");
const verificationSystem = require("../../utils/verification_system.js");

/**
 * Approves a verification ticket.
 *
 * @param {import("discord.js").ButtonInteraction} interaction - The interaction object.
 * @param {import("discord.js").GuildMember} targetMember - The target member.
 * @param {ticketModel} ticketData - The ticket data.
 * @return {Promise<void>} Returns nothing.
 */
async function verifySuccess(interaction, targetMember, ticketData) {
    await interaction.deferUpdate();
    await interaction.channel.send({ content: `${targetMember} is now verified!\n**The channel will be closed in five seconds.**` });
    try {
        await ticketModel.findOne({ userId: targetMember.user.id }).then(async () => {
            await ticketData.deleteOne({ userId: targetMember.user.id });
        });
    }
    catch (error) {
        console.log(error);
    }

    const memberRole = interaction.guild.roles.cache.get(rolesId.member);
    const unverified = interaction.guild.roles.cache.get(rolesId.unverified);
    setTimeout(async () => {
        targetMember.roles.remove(unverified).catch(err => console.error(err));
        targetMember.roles.add(memberRole).catch(err => console.error(err));
        const welcomeEmbed = embedFactory.createVerificationEmbed(embedFactory.VerificationEmbedType.UserVerified, targetMember);
        interaction.client.channels.cache.get(textId.general).send({ content: `${targetMember} has arrived!`, embeds: [welcomeEmbed] }).catch(err => console.error(err));
        interaction.channel.delete();
    }, 5000);
}

module.exports = {
    data: {
        name: "verifyApprove",
    },
    /**
     * @param {import("discord.js").ButtonInteraction} interaction
     */
    async execute(interaction) {
        const ticketData = await ticketModel.findOne({ channelId: interaction.channel.id });
        const targetMember = await interaction.guild.members.cache.get(ticketData.userId);
        const perms = PermissionsBitField.Flags;
        const staffPerms = perms.BanMembers || perms.KickMembers;

        const notStaffEmbed = new EmbedBuilder()
            .setTitle("You are not allowed to use this button.")
            .setColor("#ff0000")
            .setFooter({ text: "©️ FaithChatt Forum" });

        if (!ticketData) {
            return interaction.reply({
                content: "**The ticket is not on the database.**",
                ephemeral: true,
            });
        }
        if (!interaction.guild.members.cache.has(ticketData.userId)) {
            return interaction.reply({
                content: "**The member does not exist anymore.**",
                ephemeral: true,
            });
        }
        if (!interaction.member.permissions.has(staffPerms)) return interaction.reply({ embeds: [notStaffEmbed], ephemeral: true });

        try {
            const alreadyVerified = targetMember.roles.cache.has(rolesId.member);
            await verificationSystem.logAction(
                interaction,
                targetMember,
                alreadyVerified ? embedFactory.VerificationEmbedType.UserAlreadyVerified : embedFactory.VerificationEmbedType.UserVerifiedLog,
            );
            await verifySuccess(interaction, targetMember, ticketData);
        }
        catch (error) {
            console.error(error);
        }
    },
};
