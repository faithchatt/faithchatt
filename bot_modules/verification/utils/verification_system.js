const moment = require("moment");
const { Collection, AttachmentBuilder } = require("discord.js");
const { textId } = require("../../../utils/variables.js");
const embedFactory = require("../../../utils/embedFactory.js");

const verificationSystem = {
    /**
     * Logs the content and result of a verification ticket.
     *
     * @param {import("discord.js").ButtonInteraction} interaction - The interaction object.
     * @param {import("discord.js").GuildMember} targetMember - The target member.
     * @param {embedFactory.VerificationEmbedType} verificationEmbedType - The type of verification embed.
     */
    async logAction(interaction, targetMember, verificationEmbedType) {
        let messageCollection = new Collection();

        let channelMessages = await interaction.channel.messages.fetch({ limit: 100 }).catch(err => console.log(err));
        messageCollection = await messageCollection.concat(channelMessages);
        while (channelMessages.size === 100) {
            const lastMessageId = await channelMessages.lastKey();
            channelMessages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err));
            if (channelMessages) {
                messageCollection = await messageCollection.concat(channelMessages);
            }
        }

        const msgs = await messageCollection.filter(msg => !msg.length).reverse();
        const text = await msgs.map(m => `${m.author.tag}: ${m.content}`).join("\n");
        const logChannel = interaction.client.channels.cache.get(textId.verifyLog);

        const successEmbed = embedFactory.createVerificationEmbed(verificationEmbedType, targetMember);

        if (text.length >= 2000) {
            const timestamp = await moment().format("M-D-YYYY, HH:mm");
            const fileAttach = new AttachmentBuilder(Buffer.from(text), {
                name: `VerifyLog - ${timestamp}.txt`,
            });
            await logChannel.send({
                content: "Channel is over 2000 characters. Thus, a generated file.",
                embeds: [successEmbed],
                files: [fileAttach],
            });
        }
        else {
            await logChannel.send({
                content: `\`\`\`\n${text}\`\`\``,
                embeds: [successEmbed],
            });
        }
    },
};

module.exports = verificationSystem;
