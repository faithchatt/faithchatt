const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { parentId, errorMessages } = require("../../utils/variables");
const perm = PermissionsBitField.Flags;
const jailModel = require("../../model/jailsystem.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("closejail")
        .setDescription("Closes the jail ticket manually"),
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

        // If we are in the jail category
        if (interaction.channel.parent.id === parentId.jail) {
            await interaction.reply(`**The channel closes in five seconds.**`);
            try {
                const jailData = await jailModel.findOne({ "textChannel": interaction.channel.id });
                await jailData.deleteOne({ "textChannel": interaction.channel.id });
            }
            catch (err) {
                console.log(err);
            }
            // reserve the five second timeout then delete
            setTimeout(() => {
                interaction.channel.delete(`Jail closed by ${interaction.member.nickname} (${interaction.member.user.id}).`);
            }, 5000);
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
