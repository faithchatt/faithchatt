const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Locks the text channel"),
    async execute(interaction) {
        await interaction.reply(`**Channel is locked. Please wait until the staff lifts the timeout.**`);
        await interaction.channel.permissions.edit(interaction.guild.id, {
            SendMessages: false,
        });
    },
};
