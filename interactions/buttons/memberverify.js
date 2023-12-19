const { ActionRowBuilder, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const configschema = require("../../model/botconfig.js");

module.exports = {
    data: {
        name: "verifyStart",
    },
    async execute(interaction) {
        {
            const modal = new ModalBuilder()
                .setCustomId("verify-modal-builder")
                .setTitle("Member Verification Form");
            const component = new TextInputBuilder()
                .setCustomId("verify-modal-1")
                .setLabel("Reasons to join the server")
                .setPlaceholder("What made you come to the server?")
                .setRequired(true)
                .setMinLength(10)
                .setStyle(TextInputStyle.Paragraph);
            const component2 = new TextInputBuilder()
                .setCustomId("verify-modal-2")
                .setLabel("Server invite link referral")
                .setPlaceholder("Where did you find/who sent the invite link?")
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const component3 = new TextInputBuilder()
                .setCustomId("verify-modal-3")
                .setLabel("Age and gender")
                .setPlaceholder("What is your age and gender?")
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const component4 = new TextInputBuilder()
                .setCustomId("verify-modal-4")
                .setLabel("Confession of faith")
                .setPlaceholder("Do you accept Jesus as your Lord and Savior? If not, why?")
                .setRequired(true)
                .setStyle(TextInputStyle.Paragraph);
            const component5 = new TextInputBuilder()
                .setCustomId("verify-modal-5")
                .setLabel("Are you a former FaithChatt Forum member?")
                .setPlaceholder("Have you been on FaithChatt Forum in the past?")
                .setRequired(true)
                .setStyle(TextInputStyle.Short);
            const row1 = new ActionRowBuilder().addComponents(component);
            const row2 = new ActionRowBuilder().addComponents(component2);
            const row3 = new ActionRowBuilder().addComponents(component3);
            const row4 = new ActionRowBuilder().addComponents(component4);
            const row5 = new ActionRowBuilder().addComponents(component5);
            modal.addComponents(row1, row2, row3, row4, row5);

            let configdata = await configschema.findOne({ guildId: interaction.guild.id });

            if (!configdata) configdata = await configschema.create({ guildId: interaction.guild.id });
            if (configdata.verifyLock === true) {
                return interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setTitle("Verification is currently locked.")
                            .setDescription("Due to the unexpected circumstances happening in our server, the verification channel is locked until further notice. Please contact a staff member for questions and details.")
                            .setFooter({ text: "© FaithChatt Forum" })
                            .setColor("#ff0000"),
                    ],
                    ephemeral: true,
                });
            }
            else if (configdata.verifyLock === false) {
                await interaction.showModal(modal);
            }
            else {
                // Only works IF the verification channel is set up for the first time
                configdata.verifyLock = false;
                configdata.verifyAutoClose = true;
                configdata.save();
                await interaction.showModal(modal);
            }
        }
    },
};
