const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType } = require("discord.js");
const { textId, parentId, rolesId, errorMessages } = require("../../utils/variables");
const jailModel = require("../../model/jailsystem.js");
const perm = PermissionsBitField.Flags;

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jail")
        .setDescription("Jails a member breaking the rules")
        .addUserOption(option => option.setName("user").setDescription("User to be jailed").setRequired(true))
        .addStringOption(option => option.setName("reason").setDescription("Reason for user to be jailed").setRequired(true)),
    /**
    * @param {import("discord.js").ChatInputCommandInteraction} interaction
    * @returns
    */
    async execute(interaction) {
        const member = await interaction.options.get("user").member;
        const reason = await interaction.options.get("reason").value;

        const modPerms = interaction.member.permissions.has(perm.BanMembers || perm.KickMembers);
        if (!modPerms) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription(errorMessages.notAuthorized)
                    .setColor("#ff0000")],
                ephemeral: true,
            });
        }

        const memberRole = interaction.guild.roles.cache.get(rolesId.member);

        const unverifiedRole = interaction.guild.roles.cache.get(rolesId.unverified);
        const mutedRole = interaction.guild.roles.cache.get(rolesId.muted);
        const moderatorRole = interaction.guild.roles.cache.get(rolesId.moderator);
        const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone");

        const modLogChannel = interaction.guild.channels.cache.get(textId.modLog);

        // Get all roles from user except muted
        const userRoles = member.roles.cache.filter(role => role.id !== mutedRole.id && role.id !== unverifiedRole.id);

        const jailData = await jailModel.findOne({ userId: member.user.id });
        if (!jailData) {
            await interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setDescription(`🔒 **${member.user.tag}** has been jailed!\nPlease wait as the channel is being set up.`)
                    .setFooter({ text: `UID: ${member.user.id}` })
                    .setColor("#ff0000"),
            ], ephemeral: true });

            await member.roles.add(mutedRole).catch(err => console.error(err));
            await member.roles.remove(userRoles).catch(err => console.error(err));

            const ticketName = member.user.tag;
            const jailChannel = await interaction.guild.channels.create({
                name: "jail-" + ticketName,
                type: ChannelType.GuildText,
                parent: parentId.jail,
                topic: member.user.id,
                permissionOverwrites: [
                    { id: member.user.id, allow: [perm.ViewChannel, perm.ReadMessageHistory, perm.SendMessages], deny: [perm.ManageChannels, perm.EmbedLinks, perm.AttachFiles, perm.CreatePublicThreads, perm.CreatePrivateThreads, perm.CreateInstantInvite, perm.SendMessagesInThreads, perm.ManageThreads, perm.ManageMessages, perm.UseExternalEmojis, perm.UseExternalStickers, perm.UseApplicationCommands, perm.ManageWebhooks, perm.ManageRoles, perm.SendTTSMessages] },
                    { id: mutedRole.id, deny: [perm.EmbedLinks, perm.AttachFiles] },
                    { id: memberRole.id, deny: [perm.ViewChannel] },
                    { id: moderatorRole.id, allow: [perm.ViewChannel, perm.SendMessages, perm.ReadMessageHistory] },
                    { id: everyone.id, deny: [perm.ViewChannel] },
                ],
            });

            const newJailData = await jailModel.create({
                userId: member.user.id,
                userName: member.user.tag,
                textChannel: jailChannel.id,
            });
            newJailData.save();

            console.log(`🚨 Member has been jailed:\nMember: ${member.user.tag}\nReason: ${reason}`);
            const channelEmbed = new EmbedBuilder()
                .setTitle("You have been jailed!")
                .setDescription(`👤 **User:** \`${member.user.tag}\`\n🔒 **Reason:** \`${reason}\`\n\nYou have been restricted access to all channels as of the moment. Leaving and rejoining the server to bypass the mute will result into a permanent sanction.`)
                .setFooter({ text: `UID: ${member.user.id}` })
                .setColor("#ff0000");

            try {
                await modLogChannel.send({ embeds: [
                    new EmbedBuilder()
                        .setDescription(`👤 **User:** \`${member.user.tag}\`\n\`${member.user.id}\`\n🔒 **Reason:** \`${reason}\`\n\n👮‍♂️ **Moderator**: \`${interaction.user.tag}\``)
                        .setFooter({ text: `Moderator UID: ${interaction.user.id}` })
                        .setColor("#ff0000"),
                ] });

                await member.send({ embeds: [
                    new EmbedBuilder()
                        .setTitle("You have been jailed!")
                        .setDescription(`👤 **User:** \`${member.user.tag}\`\n🔒 **Reason:** \`${reason}\`\n\nYou have been restricted access to all channels as of the moment. Leaving and rejoining the server to bypass the mute will result into a permanent sanction. ${jailChannel}`)
                        .setFooter({ text: `UID: ${member.user.id}` })
                        .setColor("#ff0000"),
                ] });

                await jailChannel.send({ content: `${member}`, embeds: [channelEmbed] }).catch(err => console.error(err));
                await jailChannel.send({ content: `${interaction.user}` }).then(msg => {
                    setTimeout(() => msg.delete().catch(err => console.error(err)), 3000);
                });
            }
            catch (err) {
                console.error(err);
            }
        }
    },
};
