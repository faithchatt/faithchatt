const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { miscValues } = require("../../utils/variables");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("topic")
        .setDescription("Start a new topic that prescribes the Christian faith."),
    async execute(interaction) {
        const topic = miscValues.questions;
        const num = Math.floor(Math.random() * topic.length);
        const embed = new EmbedBuilder()
            .setDescription(`**${topic[num]}**`)
            .setColor("#ffd100")
            .setFooter({ text: "© FaithChatt Forum" })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    },
};