const { PermissionsBitField, ChannelType } = require("discord.js");
const { parentId, rolesId } = require("./variables");
const perm = PermissionsBitField.Flags;

const jailSystem = {
    /**
    * Creates a jail channel for a member in a specific guild.
    *
    * @param {import("discord.js").Guild} guild - The guild on which the channel will be created.
    * @param {import("discord.js").GuildMember} jailedMember - The member who will be jailed.
    * @return {Promise<import("discord.js").TextChannel>} A promise that resolves when the channel is created.
    */
    createJailChannel(guild, jailedMember) {
        const memberRole = guild.roles.cache.get(rolesId.member);
        const mutedRole = guild.roles.cache.get(rolesId.muted);
        const moderatorRole = guild.roles.cache.get(rolesId.moderator);
        const everyone = guild.roles.cache.find(r => r.name === "@everyone");

        return guild.channels.create({
            name: `jail-${jailedMember.user.tag}`,
            type: ChannelType.GuildText,
            parent: parentId.jail,
            topic: jailedMember.user.id,
            permissionOverwrites: [
                { id: jailedMember.user.id, allow: [perm.ViewChannel, perm.ReadMessageHistory, perm.SendMessages], deny: [perm.ManageChannels, perm.EmbedLinks, perm.AttachFiles, perm.CreatePublicThreads, perm.CreatePrivateThreads, perm.CreateInstantInvite, perm.SendMessagesInThreads, perm.ManageThreads, perm.ManageMessages, perm.UseExternalEmojis, perm.UseExternalStickers, perm.UseApplicationCommands, perm.ManageWebhooks, perm.ManageRoles, perm.SendTTSMessages] },
                { id: mutedRole.id, deny: [perm.EmbedLinks, perm.AttachFiles] },
                { id: memberRole.id, deny: [perm.ViewChannel] },
                { id: moderatorRole.id, allow: [perm.ViewChannel, perm.SendMessages, perm.ReadMessageHistory] },
                { id: everyone.id, deny: [perm.ViewChannel] },
            ],
        });
    },

    /**
    * Removes roles from a guild member. Adds muted role.
    *
    * @param {import("discord.js").Guild} guild - The guild from which to remove roles.
    * @param {import("discord.js").GuildMember} jailedMember - The member whose roles are to be removed.
    * @return {Promise<void>} A promise that resolves when the roles are removed.
    */
    async removeRoles(guild, jailedMember) {
        const unverifiedRole = guild.roles.cache.get(rolesId.unverified);
        const mutedRole = guild.roles.cache.get(rolesId.muted);

        const userRoles = jailedMember.roles.cache.filter(role => role.id !== mutedRole.id && role.id !== unverifiedRole.id && role.managed !== true);

        await jailedMember.roles.add(mutedRole);
        await jailedMember.roles.remove(userRoles);
    },
};

module.exports = jailSystem;
