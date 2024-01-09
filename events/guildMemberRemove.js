const jailModel = require("../model/jailsystem.js");
const embedFactory = require("../utils/embedFactory.js");

module.exports = {
    once: false,
    name: "guildMemberRemove",
    async execute(member) {
        console.log(member.user.username + " left the server");

        const jailData = await jailModel.findOne({ userId: member.user.id });

        if (jailData) {
            const jailChannel = member.guild.channels.cache.get(jailData.textChannel);

            // Send embed in jailChannel
            jailChannel.send({
                embeds: [
                    embedFactory.createJailEmbed(embedFactory.JailEmbedType.JailedUserLeft, null, member, null, jailChannel),
                ],
            });
        }
    },
};
