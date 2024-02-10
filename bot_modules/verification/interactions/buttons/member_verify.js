const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require("discord.js");
const configModel = require("../../../../model/botconfig.js");
const embedFactory = require("../../../../utils/embedFactory.js");

module.exports = {
    data: {
        name: "verifyStart",
    },
    /**
     * @param {import("discord.js").ButtonInteraction} interaction
     */
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

            let configData = await configModel.findOne({ guildId: interaction.guild.id });

            if (!configData) configData = await configModel.create({ guildId: interaction.guild.id });
            if (configData.verifyLock === true) {
                return interaction.reply({
                    embeds: [
                        embedFactory.createVerificationEmbed(embedFactory.VerificationEmbedType.VerificationLocked, null),
                    ],
                    ephemeral: true,
                });
            }
            else if (configData.verifyLock === false) {
                await interaction.showModal(modal);
            }
            else {
                // Only works IF the verification channel is set up for the first time
                configData.verifyLock = false;
                configData.verifyAutoClose = true;
                configData.save();
                await interaction.showModal(modal);
            }
        }
    },
};
