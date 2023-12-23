const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { parentId, errorMessages } = require("../../utils/variables");
const perm = PermissionsBitField.Flags;
const jailSchema = require("../../model/jailsystem.js");

/**
* @param {CommandInteraction} interaction
* @param {string | import("discord.js").InteractionReplyOptions | import("discord.js").MessagePayload} messageContent
*/
function ephemeralReply(interaction, messageContent) {
    return interaction.reply({ content: messageContent, ephemeral: true });
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unjail")
        .setDescription("Unjails a member")
        .addUserOption(option => option.setName("user").setDescription("User to be unjailed").setRequired(true)),

    /**
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        if (!interaction.member.permissions.has(perm.BanMembers || perm.KickMembers)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(errorMessages.notAuthorized)
                    .setColor("#ff0000")],
                ephemeral: true,
            });
        }

        if (interaction.channel.parent.id === parentId.jail) {
            try {
                const jailedMember = await interaction.options.get("user").member;
                const jailedUserData = await jailSchema.findOne({ userId: jailedMember.user.id });
                const userAvail = jailedMember.user.id == jailedUserData.userId;
                const channelAvail = interaction.channel.id == jailedUserData.textChannel;

                if (!userAvail) return ephemeralReply(interaction, errorMessages.userNoData);
                if (!channelAvail) return ephemeralReply(interaction, errorMessages.channelNotExist);

                await ephemeralReply(interaction, "✅ | Successfully unjailed the user.");
                await jailedUserData.deleteOne({ userId: jailedMember.user.id });
            }
            catch (err) {
                console.error(err);
                await ephemeralReply(interaction, errorMessages.userNotExist);
            }
        }
        else {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(errorMessages.notAllowedOutsideJail)
                    .setColor("#ff0000")],
                ephemeral: true,
            });
        }
    },
};
