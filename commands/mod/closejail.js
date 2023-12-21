const { SlashCommandBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { parentId } = require("../../utils/variables");
const perm = PermissionsBitField.Flags;
const schema = require("../../model/jailsystem.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("closejail")
        .setDescription("Closes the jail ticket manually"),
    async execute(interaction) {
        if (!interaction.member.permissions.has(perm.BanMembers || perm.KickMembers)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("❌ | You are not a staff member authorized to use this command.")
                    .setColor("#ff0000")],
                ephemeral: true,
            });
        }
        if (interaction.channel.parent.id === parentId.jail) {
            await interaction.reply(`**The channel closes in five seconds.**`);
            try {
                const data = await schema.findOne({userId});
                if (data.userId !== member.user.id) return await data.deleteOne({ userId });
            }
            catch (error) {
                console.log(error);
            }
            // reserve the five second timeout then delete
        }
        else {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("❌ | You are not allowed to execute outside the jail category.")
                    .setColor("#ff0000")],
                ephemeral: true,
            });
        }
    },
};
