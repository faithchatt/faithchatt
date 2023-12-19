const { ModalBuilder, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require("discord.js");
const permflag = PermissionsBitField.Flags;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("modsuggest")
        .setDescription("Opens a suggestion window for server-related concerns among staff"),
    async execute(interaction) {
        if (!interaction.member.permissions.has(permflag.KickMembers || permflag.BanMembers)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("❌ | You are not a staff member authorized to use this command.")
                    .setColor("#ff0000")],
                ephemeral: true,
            });
        }

        const modal = new ModalBuilder()
            .setCustomId("modsuggest-modal")
            .setTitle("Suggest anything here!");
        const component = new TextInputBuilder()
            .setCustomId("modsuggest-modal-input")
            .setLabel("Enter your queries here.")
            .setMaxLength(1000)
            .setRequired(true)
            .setStyle(TextInputStyle.Paragraph);
        const row1 = new ActionRowBuilder().addComponents(component);
        modal.addComponents(row1);

        await interaction.showModal(modal);
    },
};
