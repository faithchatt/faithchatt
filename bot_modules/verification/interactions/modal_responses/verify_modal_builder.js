const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const faithchatt = require("../../../../utils/variables.js");
const ticketModel = require("../../../../model/ticket.js");
const perms = PermissionsBitField.Flags;

module.exports = {
    data: {
        name: "verify-modal-builder",
    },
    async execute(interaction) {
        const moderatorRole = interaction.guild.roles.cache.get(faithchatt.rolesId.staff);
        const unverifiedRole = interaction.guild.roles.cache.get(faithchatt.rolesId.unverified);
        const regularRole = interaction.guild.roles.cache.get(faithchatt.rolesId.regular);
        const memberRole = interaction.guild.roles.cache.get(faithchatt.rolesId.member);
        const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone");

        let ticketData = await ticketModel.findOne({ userId: interaction.user.id });

        const textInput1 = await interaction.fields.getTextInputValue("verify-modal-1");
        const textInput2 = await interaction.fields.getTextInputValue("verify-modal-2");
        const textInput3 = await interaction.fields.getTextInputValue("verify-modal-3");
        const textInput4 = await interaction.fields.getTextInputValue("verify-modal-4");
        const textInput5 = await interaction.fields.getTextInputValue("verify-modal-5");

        try {
            const ticketEmbed = new EmbedBuilder()
                .setDescription(`**👤 User:** \`${interaction.user.tag}\`\n**📜 ID:**\`${interaction.user.id}\``)
                .setThumbnail(interaction.user.avatarURL())
                .setColor("#ffd100")
                .setFooter({ text: "© FaithChatt Forum" });
            const ticketContent = `**VERIFICATION FOR ${interaction.user}**\n\n1. ${textInput1}\n\n2. ${textInput2}\n\n3. ${textInput3}\n\n4. ${textInput4}\n\n5. ${textInput5}`;
            const buttonRow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("verifyAssess")
                    .setLabel("Assess the verification (staff only)")
                    .setEmoji("📋")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(false),
            );

            const ticketName = interaction.user.tag;

            if (!ticketData) {
                const verifyChannel = await interaction.guild.channels.create({
                    name: ticketName,
                    type: ChannelType.GuildText,
                    parent: faithchatt.parentId.verification,
                    topic: interaction.user.id,
                    permissionOverwrites: [
                        { id: interaction.user.id, allow: [perms.ViewChannel, perms.ReadMessageHistory, perms.SendMessages], deny: [perms.ManageChannels, perms.EmbedLinks, perms.AttachFiles, perms.CreatePublicThreads, perms.CreatePrivateThreads, perms.CreateInstantInvite, perms.SendMessagesInThreads, perms.ManageThreads, perms.ManageMessages, perms.UseExternalEmojis, perms.UseExternalStickers, perms.UseApplicationCommands, perms.ManageWebhooks, perms.ManageRoles, perms.SendTTSMessages] },
                        { id: regularRole.id, deny: [perms.EmbedLinks, perms.AttachFiles] },
                        { id: memberRole.id, deny: [perms.ViewChannel] },
                        { id: unverifiedRole.id, deny: [perms.ViewChannel] },
                        { id: moderatorRole.id, allow: [perms.ViewChannel, perms.SendMessages, perms.ReadMessageHistory] },
                        { id: everyone.id, deny: [perms.ViewChannel] },
                    ],
                });
                ticketData = await ticketModel.create({
                    userId: interaction.user.id,
                    userName: ticketName,
                    channelId: verifyChannel.id,
                });
                verifyChannel.send({ content: ticketContent, embeds: [ticketEmbed], components: [buttonRow] }).catch(err => console.error(err));
                return interaction.reply({ content: `Ticket created! Please check ${verifyChannel}`, ephemeral: true }).catch(err => console.error(err));
            }
            else {
                if (!interaction.guild.channels.cache.has(ticketData.channelId)) {
                    const verifychannel = await interaction.guild.channels.create(ticketName, {
                        type: ChannelType.GuildText,
                        parent: faithchatt.parentId.verification,
                        topic: interaction.user.id,
                        permissionOverwrites: [
                            { id: interaction.user.id, allow: [perms.ViewChannel, perms.ReadMessageHistory, perms.SendMessages], deny: [perms.ManageChannels, perms.EmbedLinks, perms.AttachFiles, perms.CreatePublicThreads, perms.CreatePrivateThreads, perms.CreateInstantInvite, perms.SendMessagesInThreads, perms.ManageThreads, perms.ManageMessages, perms.UseExternalEmojis, perms.UseExternalStickers, perms.UseApplicationCommands, perms.ManageWebhooks, perms.ManageRoles, perms.SendTTSMessages] },
                            { id: regularRole.id, deny: [perms.EmbedLinks, perms.AttachFiles] },
                            { id: memberRole.id, deny: [perms.ViewChannel] },
                            { id: unverifiedRole.id, deny: [perms.ViewChannel] },
                            { id: moderatorRole.id, allow: [perms.ViewChannel, perms.SendMessages, perms.ReadMessageHistory] },
                            { id: everyone.id, deny: [perms.ViewChannel] },
                        ],
                    });
                    ticketData.channelId = verifychannel.id;
                    await ticketData.save();
                    await verifychannel.send({ content: ticketContent, embeds: [ticketEmbed] }).catch(err => console.error(err));
                    return interaction.reply({ content: `Ticket created! Please check ${verifychannel}`, ephemeral: true }).catch(err => console.error(err));
                }
                return interaction.reply({ content: "You have already created a ticket! If you have problems, immediately contact/DM the moderators.", ephemeral: true }).catch(err => console.error(err));
            }
        }
        catch (err) {
            console.log(err);
        }
    },
};
