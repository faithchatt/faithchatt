const { PermissionsBitField } = require("discord.js");
const jailModel = require("../model/jailsystem.js");
const jailSystem = require("../utils/jailSystem.js");
const embedFactory = require("../utils/embedFactory.js");
const perm = PermissionsBitField.Flags;

module.exports = {
    once: false,
    name: "guildMemberAdd",
    async execute(member) {
        console.log(member.user.username + " joined the server");

        const jailData = await jailModel.findOne({ userId: member.user.id });

        if (jailData) {
            /**
             * Get the jail channel
             * @type {import("discord.js").TextChannel}
             */
            const jailChannel = member.guild.channels.cache.get(jailData.textChannel);

            jailSystem.removeRoles(member.guild, member);
            jailChannel.permissionOverwrites.set([
                {
                    id: member.user.id,
                    allow: [perm.ViewChannel, perm.ReadMessageHistory, perm.SendMessages],
                    deny: [perm.ManageChannels, perm.EmbedLinks, perm.AttachFiles, perm.CreatePublicThreads, perm.CreatePrivateThreads, perm.CreateInstantInvite, perm.SendMessagesInThreads, perm.ManageThreads, perm.ManageMessages, perm.UseExternalEmojis, perm.UseExternalStickers, perm.UseApplicationCommands, perm.ManageWebhooks, perm.ManageRoles, perm.SendTTSMessages],
                },
            ], "Previously jailed user rejoined the server.");
            // Send embed in jailChannel
            jailChannel.send({
                embeds: [
                    embedFactory.createJailEmbed(embedFactory.JailEmbedType.JailedUserRejoined, null, member, null, jailChannel),
                ],
            });
        }
    },
};
