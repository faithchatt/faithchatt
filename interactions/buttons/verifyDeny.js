const { Collection, AttachmentBuilder, EmbedBuilder, PermissionsBitField } = require("discord.js");
const { textId } = require("../../utils/variables");
const ticketschema = require("../../model/ticket.js");
const moment = require("moment");

module.exports = {
    data: {
        name: "verifyDeny",
    },
    async execute(interaction) {
        const ticketdata = await ticketschema.findOne({ channelId: interaction.channel.id });
        const targetmember = await interaction.guild.members.cache.get(ticketdata.userId);
        const perms = PermissionsBitField.Flags;
        const staff = perms.BanMembers || perms.KickMembers;

        const embed_notstaff = new EmbedBuilder()
            .setTitle("You are not allowed to use this button.")
            .setColor("#ff0000")
            .setFooter({ text: "©️ FaithChatt Forum" });

        if (!ticketdata) {
            return interaction.reply({
                content: "**The ticket is not on the database.**",
                ephemeral: true,
            });
        }
        if (!interaction.guild.members.cache.has(ticketdata.userId)) {
            return interaction.reply({
                content: "**The member does not exist anymore.**",
                ephemeral: true,
            });
        }
        if (!interaction.member.permissions.has(staff)) return interaction.reply({ embeds: [embed_notstaff], ephemeral: true });

        async function logAction() {
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
            const denyEmbed = new EmbedBuilder()
                .setColor("#ff0000")
                .setDescription(`👤 **User:** \`${targetmember.user.tag}\`\n📜 **ID:** \`${targetmember.user.id}\`\n\nUnverified member was disqualified during vetting.`)
                .setThumbnail(targetmember.displayAvatarURL());
            if (text.length >= 2000) {
                const timestamp = await moment().format("M-D-YYYY, HH:mm");
                const fileAttach = new AttachmentBuilder(Buffer.from(text), {
                    name: `VerifyLog - ${timestamp}.txt`,
                });
                await logChannel.send({
                    content: "Channel is over 2000 characters. Thus, a generated file.",
                    embeds: [denyEmbed],
                    files: [fileAttach],
                });
            }
            else {
                await logChannel.send({
                    content: `\`\`\`\n${text}\`\`\``,
                    embeds: [denyEmbed],
                });
            }
        }

        async function verifyDenyTicket() {
            await interaction.deferUpdate();
            await targetmember.send({ embeds: [
                new EmbedBuilder()
                    .setColor("#ff0000")
                    .setTitle("Sorry, but you're ineligible to be verified at this point. Please try again later.")
                    .setDescription("The reasons are among the following:\n- Answers remain unclear after several additional questions are supplemented by the staff team.\n- Using of alts are unauthorized without approval of the staff\n- Un-Christlike behavior as reflected by violating the server rules\n\nIf you have any questions or concerns not mentioned above, please contact us admins/moderators. Thank you for joining FaithChatt Forum.")
                    .setFooter({ text: "©️ FaithChatt Forum" }),
            ] });
            await interaction.channel.send({ content: `**Verification ticket closes in five seconds.**` });
            try {
                await ticketschema.findOne({ userId: targetmember.user.id }).then(async () => {
                    await ticketdata.deleteOne({ userId: targetmember.user.id });
                });
            }
            catch (error) {
                console.log(error);
            }
            setTimeout(async () => interaction.channel.delete(), 5000);
        }

        try {
            await logAction();
            await verifyDenyTicket();
        }
        catch (error) {
            console.error(error);
        }
    },
};
