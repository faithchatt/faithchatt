const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("A small documentation for FaithChatt Utilities slash commands"),
    async execute(interaction) {
        const commands = await interaction.client.guilds.cache.get("839708279973478430").commands.fetch();
        const helpcmd = commands.find(cmd => cmd.name === "help").id;
        const pingcmd = commands.find(cmd => cmd.name === "ping").id;

        const embed = new EmbedBuilder()
            .setColor("#ffd100")
            .setTitle("The setlist of commands")
            .setDescription(`**GENERAL**\n</help:${helpcmd}> - This list\n</ping:${pingcmd}> - Server ping\n\`/membercount\` - Human member count\n\`/invite\` - Server invite\n\`/form\` - Application forms for staff membership on FaithChatt\n\n\`/pray\` - Submit a prayer request`)
            .setFooter({ text:"© FaithChatt Forum" });
        await interaction.reply({ embeds: [embed] });
    },
};