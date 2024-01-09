const { EmbedBuilder } = require("discord.js");
const dedent = require("dedent");

const JailEmbedType = {
    JailBeingSetup: 1,
    JailedUserFacing: 2,
    JailChannelIntroduction: 3,
    JailedModLog: 4,
    JailCreated: 5,
    JailedUserLeft: 6,
    JailedUserRejoined: 7,
};

exports.JailEmbedType = JailEmbedType;
/**
 * @param {JailEmbedType} embedType
 * @param {import("discord.js").User} staffUser
 * @param {import("discord.js").GuildMember} jailedMember
 * @param {string} reason
 * @param {import("discord.js").TextChannel} jailChannel
 *
 * @returns {import("discord.js").EmbedBuilder}
 */
exports.createJailEmbed = (embedType, staffUser, jailedMember, reason, jailChannel) => {
    switch (embedType) {
    case JailEmbedType.JailBeingSetup:
        return new EmbedBuilder()
            .setDescription(`🔒 **${jailedMember.user.tag}** has been jailed!\nPlease wait as the channel is being set up.`)
            .setFooter({ text: `UID: ${jailedMember.user.id}` })
            .setColor("#ff0000");

    case JailEmbedType.JailedUserFacing:
        return new EmbedBuilder()
            .setTitle("You have been jailed!")
            .setDescription(
                dedent(
                    `👤 **User:** \`${jailedMember.user.tag}\`
                    🔒 **Reason:** \`${reason}\`
                    
                    You have been restricted access to all channels as of the moment. Leaving and rejoining the server to bypass the mute will result into a permanent sanction. ${jailChannel}`,
                ))
            .setFooter({ text: `UID: ${jailedMember.user.id}` })
            .setColor("#ff0000");

    case JailEmbedType.JailChannelIntroduction:
        return new EmbedBuilder()
            .setTitle("You have been jailed!")
            .setDescription(
                dedent(
                    `👤 **User:** \`${jailedMember.user.tag}\`
                    🔒 **Reason:** \`${reason}\`
                    
                    You have been restricted access to all channels as of the moment. Leaving and rejoining the server to bypass the mute will result into a permanent sanction.`,
                ))
            .setFooter({ text: `UID: ${jailedMember.user.id}` })
            .setColor("#ff0000");

    case JailEmbedType.JailedModLog:
        return new EmbedBuilder()
            .setDescription(
                dedent(
                    `👤 **User:** \`${jailedMember.user.tag}\`
                    \`${jailedMember.user.id}\`
                    🔒 **Reason:** \`${reason}\`
                    
                    👮‍♂️ **Moderator**: \`${staffUser.tag}\``,
                ))
            .setFooter({ text: `Moderator UID: ${staffUser.id}` })
            .setColor("#ff0000");

    case JailEmbedType.JailCreated:
        return new EmbedBuilder()
            .setDescription(
                dedent(
                    `🔒 **${jailedMember.user.tag}** has been jailed!
                    
                    ${jailChannel}`,
                ),
            )
            .setFooter({ text: `UID: ${jailedMember.user.id}` })
            .setColor("#ff0000");

    case JailEmbedType.JailedUserLeft:
        return new EmbedBuilder()
            .setDescription(
                dedent(
                    `👤 **${jailedMember.user.tag}** left the server!
                    
                    They will be automatically jailed if they rejoin. Use the \`/closejail\` command to erase the database record and delete this channel.`,
                ),
            )
            .setFooter({ text: `UID: ${jailedMember.user.id}` })
            .setColor("#ff0000");

    case JailEmbedType.JailedUserRejoined:
        return new EmbedBuilder()
            .setDescription(
                dedent(
                    `👤 **${jailedMember.user.tag}** rejoined the server!`,
                ),
            )
            .setFooter({ text: `UID: ${jailedMember.user.id}` })
            .setColor("#ff0000");

    }
};

exports.createWarningEmbed = (description, footerText) => {
    return new EmbedBuilder()
        .setTitle("Warning")
        .setDescription(description)
        .setFooter({ text: footerText })
        .setColor("#ffff00");
};

exports.createErrorEmbed = (description) => {
    return new EmbedBuilder()
        .setTitle("Error")
        .setDescription(description)
        .setColor("#ff0000");
};

exports.createSuccessEmbed = (description) => {
    return new EmbedBuilder()
        .setTitle("Success")
        .setDescription(description)
        .setColor("#00ff00");
};
