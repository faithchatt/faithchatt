const dedent = require("dedent");
const { EmbedBuilder } = require("discord.js");
const { textId } = require("../utils/variables");

const JailEmbedType = {
    JailBeingSetup: 1,
    JailedUserFacing: 2,
    JailChannelIntroduction: 3,
    JailedModLog: 4,
    JailCreated: 5,
    JailedUserLeft: 6,
    JailedUserRejoined: 7,
};
const VerificationEmbedType = {
    UserDenied: 1,
    UserVerified: 2,
    UserDeniedLog: 3,
    UserVerifiedLog: 4,
    UserAlreadyVerified: 5,
    ForceClosedLog: 6,
    VerificationLocked: 7,
};

exports.JailEmbedType = JailEmbedType;
exports.VerificationEmbedType = VerificationEmbedType;
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

exports.createVerificationEmbed = (embedType, targetMember) => {
    switch (embedType) {
    case VerificationEmbedType.UserDenied:
        return new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle("Sorry, but you're ineligible to be verified at this point. Please try again later.")
            .setDescription("The reasons are among the following:\n- Answers remain unclear after several additional questions are supplemented by the staff team.\n- Using of alts are unauthorized without approval of the staff\n- Un-Christlike behavior as reflected by violating the server rules\n\nIf you have any questions or concerns not mentioned above, please contact us admins/moderators. Thank you for joining FaithChatt Forum.")
            .setFooter({ text: "©️ FaithChatt Forum" });
    case VerificationEmbedType.UserVerified:
        return new EmbedBuilder()
            .setColor("#ffd100")
            .setTitle(`Welcome to FaithChatt!`)
            .setDescription(
                dedent(
                    `Be sure to check out our <#${textId.roles}> and review our <#${textId.confidentiality}> as you begin working with us. It gives you access to specific channels, a new color, and important reminders pings.
                    
                    You may also want to review our <#${textId.introduction}> and share a little bit about yourself. We make it easy and even provide a template to follow. Thanks for joining.`,
                ),
            )
            .setThumbnail(targetMember.user.displayAvatarURL({ dynamic: true }))
            .setFooter({ text: `UID: ${targetMember.user.id}` })
            .setTimestamp();
    case VerificationEmbedType.UserDeniedLog:
        return new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(
                dedent(
                    `👤 **User:** \`${targetMember.user.tag}\`
                    📜 **ID:** \`${targetMember.user.id}\`
                    
                    Unverified member was disqualified during vetting.`,
                ),
            )
            .setThumbnail(targetMember.displayAvatarURL());
    case VerificationEmbedType.UserVerifiedLog:
        return new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription(
                dedent(
                    `👤 **User:** \`${targetMember.user.tag}\`
                    📜 **ID:** \`${targetMember.user.id}\`
                    
                    Verification successful.`,
                ),
            )
            .setThumbnail(targetMember.displayAvatarURL());
    case VerificationEmbedType.UserAlreadyVerified:
        return new EmbedBuilder()
            .setColor("#00FF00")
            .setDescription(
                dedent(
                    `👤 **User:** \`${targetMember.user.tag}\`
                    📜 **ID:** \`${targetMember.user.id}\`\
                    
                    Member was already verified. The bot was experiencing errors then the staff initially added the role for him/her.`,
                ),
            )
            .setThumbnail(targetMember.displayAvatarURL());
    case VerificationEmbedType.ForceClosedLog:
        return new EmbedBuilder()
            .setColor("#ff0000")
            .setDescription(
                dedent(
                    `👤 **User:** \`${targetMember.user.tag}\`
                    📜 **ID:** \`${targetMember.user.id}\`
                    
                    An admin has force closed the ticket.`,
                ),
            )
            .setThumbnail(targetMember.displayAvatarURL());
    case VerificationEmbedType.VerificationLocked:
        return new EmbedBuilder()
            .setTitle("Verification is currently locked.")
            .setDescription("Due to the unexpected circumstances happening in our server, the verification channel is locked until further notice. Please contact a staff member for questions and details.")
            .setFooter({ text: "© FaithChatt Forum" })
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
