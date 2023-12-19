const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, EmbedBuilder, PermissionsBitField } = require("discord.js");
const faithchatt = require("../../utils/variables");
const ticketschema = require("../../model/ticket.js");
const perms = PermissionsBitField.Flags;

module.exports = {
    data: {
        name: "verify-modal-builder",
    },
    async execute(interaction) {
        const moderatorrole = interaction.guild.roles.cache.get(faithchatt.rolesId.staff);
        const unverified = interaction.guild.roles.cache.get(faithchatt.rolesId.unverified);
        const regular = interaction.guild.roles.cache.get(faithchatt.rolesId.regular);
        const memberrole = interaction.guild.roles.cache.get(faithchatt.rolesId.member);
        const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone");

        let ticketdata = await ticketschema.findOne({ userId: interaction.user.id });

        const textInput1 = await interaction.fields.getTextInputValue("verify-modal-1");
        const textInput2 = await interaction.fields.getTextInputValue("verify-modal-2");
        const textInput3 = await interaction.fields.getTextInputValue("verify-modal-3");
        const textInput4 = await interaction.fields.getTextInputValue("verify-modal-4");
        const textInput5 = await interaction.fields.getTextInputValue("verify-modal-5");

        try {
            const ticketembed = new EmbedBuilder()
                .setDescription(`**👤 User:** \`${interaction.user.tag}\`\n**📜 ID:**\`${interaction.user.id}\``)
                .setThumbnail(interaction.user.avatarURL())
                .setColor("#ffd100")
                .setFooter({ text: "© FaithChatt Forum" });
            const ticketcontent = `**VERIFICATION FOR ${interaction.user}**\n\n1. ${textInput1}\n\n2. ${textInput2}\n\n3. ${textInput3}\n\n4. ${textInput4}\n\n5. ${textInput5}`;
            const buttonrow = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                    .setCustomId("verifyAssess")
                    .setLabel("Assess the verification (staff only)")
                    .setEmoji("📋")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(false),
            );

            const ticketname = interaction.user.tag;

            if (!ticketdata) {
                const verifychannel = await interaction.guild.channels.create({
                    name: ticketname,
                    type: ChannelType.GuildText,
                    parent: faithchatt.parentId.verification,
                    topic: interaction.user.id,
                    permissionOverwrites: [
                        { id: interaction.user.id, allow: [perms.ViewChannel, perms.ReadMessageHistory, perms.SendMessages], deny: [perms.ManageChannels, perms.EmbedLinks, perms.AttachFiles, perms.CreatePublicThreads, perms.CreatePrivateThreads, perms.CreateInstantInvite, perms.SendMessagesInThreads, perms.ManageThreads, perms.ManageMessages, perms.UseExternalEmojis, perms.UseExternalStickers, perms.UseApplicationCommands, perms.ManageWebhooks, perms.ManageRoles, perms.SendTTSMessages] },
                        { id: regular.id, deny: [perms.EmbedLinks, perms.AttachFiles] },
                        { id: memberrole.id, deny: [perms.ViewChannel] },
                        { id: unverified.id, deny: [perms.ViewChannel] },
                        { id: moderatorrole.id, allow: [perms.ViewChannel, perms.SendMessages, perms.ReadMessageHistory] },
                        { id: everyone.id, deny: [perms.ViewChannel] },
                    ],
                });
                ticketdata = await ticketschema.create({
                    userId: interaction.user.id,
                    userName: ticketname,
                    channelId: verifychannel.id,
                });
                verifychannel.send({ content: ticketcontent, embeds: [ticketembed], components: [buttonrow] }).catch(err => console.error(err));
                return interaction.reply({ content: `Ticket created! Please check ${verifychannel}`, ephemeral: true }).catch(err => console.error(err));
            }
            else {
                if (!interaction.guild.channels.cache.has(ticketdata.channelId)) {
                    const verifychannel = await interaction.guild.channels.create(ticketname, {
                        type: ChannelType.GuildText,
                        parent: faithchatt.parentId.verification,
                        topic: interaction.user.id,
                        permissionOverwrites: [
                            { id: interaction.user.id, allow: [perms.ViewChannel, perms.ReadMessageHistory, perms.SendMessages], deny: [perms.ManageChannels, perms.EmbedLinks, perms.AttachFiles, perms.CreatePublicThreads, perms.CreatePrivateThreads, perms.CreateInstantInvite, perms.SendMessagesInThreads, perms.ManageThreads, perms.ManageMessages, perms.UseExternalEmojis, perms.UseExternalStickers, perms.UseApplicationCommands, perms.ManageWebhooks, perms.ManageRoles, perms.SendTTSMessages] },
                            { id: regular.id, deny: [perms.EmbedLinks, perms.AttachFiles] },
                            { id: memberrole.id, deny: [perms.ViewChannel] },
                            { id: unverified.id, deny: [perms.ViewChannel] },
                            { id: moderatorrole.id, allow: [perms.ViewChannel, perms.SendMessages, perms.ReadMessageHistory] },
                            { id: everyone.id, deny: [perms.ViewChannel] },
                        ],
                    });
                    ticketdata.channelId = verifychannel.id;
                    await ticketdata.save();
                    await verifychannel.send({ content: ticketcontent, embeds: [ticketembed] }).catch(err => console.error(err));
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
