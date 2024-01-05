const { SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { parentId, errorMessages } = require("../../utils/variables");
const jailModel = require("../../model/jailsystem.js");
const embedFactory = require("../../utils/embedFactory.js");
const perm = PermissionsBitField.Flags;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("closejail")
        .setDescription("Closes the jail ticket manually"),
    /**
    * @param {import("discord.js").CommandInteraction} interaction
    */
    async execute(interaction) {
        const modPerms = interaction.member.permissions.has(perm.BanMembers || perm.KickMembers);
        if (!modPerms) {
            return interaction.reply({
                embeds: [
                    embedFactory.createErrorEmbed(errorMessages.notAuthorized),
                ],
                ephemeral: true,
            });
        }

        // If we are in the jail category
        if (interaction.channel.parent.id === parentId.jail) {
            try {
                const jailData = await jailModel.findOne({ "textChannel": interaction.channel.id });
                if (jailData) {
                    await jailModel.deleteOne({ "textChannel": interaction.channel.id });
                }
            }
            catch (err) {
                console.log(err);
                return interaction.followUp({
                    embeds: [
                        embedFactory.createErrorEmbed(errorMessages.internalError),
                    ],
                    ephemeral: true,
                });
            }

            await interaction.reply(`**The channel closes in five seconds.**`).catch(err => console.log(err));
            // Reserve the five second timeout then delete
            setTimeout(() => {
                interaction.channel.delete(`Jail closed by ${interaction.member.nickname} (${interaction.member.user.id}).`);
            }, 5000);
        }
        else {
            return interaction.reply({
                embeds: [
                    embedFactory.createErrorEmbed(errorMessages.notAllowedOutsideJail),
                ],
                ephemeral: true,
            });
        }
    },
};
