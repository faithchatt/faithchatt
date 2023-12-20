const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("membercount")
        .setDescription("Server members"),
    async execute(interaction) {
        await interaction.reply(`Pong! You have ${interaction.client.ws.ping} ms.`);
    },
};