const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong and miliseconds!"),
    async execute(interaction) {
        await interaction.reply(`Pong! You have ${interaction.client.ws.ping} ms.`);
    },
};