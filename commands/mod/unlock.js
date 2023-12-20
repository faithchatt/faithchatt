const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlocks the text channel"),
    async execute(interaction) {
        await interaction.reply(`**Channel is now unlocked. Thank you for your patience.**`);
        await interaction.channel.permissions.edit(interaction.guild.id, {
            SendMessages: true,
        });
    },
};
