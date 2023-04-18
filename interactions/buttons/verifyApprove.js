const { Collection, AttachmentBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js')
const {textId, rolesId} = require('../../utils/variables')
const ticketschema = require('../../model/ticket.js')

module.exports = {
    data: {
        name: 'verifyApprove'
    },
    async execute(interaction) {
        let ticketdata = await ticketschema.findOne({ channelId: interaction.channel.id })
        const targetmember = await interaction.guild.members.cache.get(ticketdata.userId)
        const perms = PermissionsBitField.Flags
        const staff = perms.BanMembers || perms.KickMembers
        const memberrole = interaction.guild.roles.cache.get(rolesId.member)
        const unverified = interaction.guild.roles.cache.get(rolesId.unverified)

        const embed_notstaff = new EmbedBuilder()
            .setTitle('You are not allowed to use this button.')
            .setColor('#ff0000')
            .setFooter({ text: '©️ FaithChatt Forum' })

        if(!ticketdata) return interaction.reply({
            content: "**The ticket is not on the database.**",
            ephemeral: true
        })
        if(!interaction.guild.members.cache.has(ticketdata.userId)) return interaction.reply({
            content: "**The member does not exist anymore.**",
            ephemeral: true
        })
        if(!interaction.member.permissions.has(staff)) return interaction.reply({ embeds: [embed_notstaff], ephemeral: true })

        async function logAction() {
            let messageCollection = new Collection();
            let channelMessages = await interaction.channel.messages.fetch({ limit: 100 }).catch(err => console.log(err));
            messageCollection = await messageCollection.concat(channelMessages);
            while (channelMessages.size === 100) {
                let lastMessageId = await channelMessages.lastKey();
                channelMessages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err));
                if (channelMessages) {
                    messageCollection = await messageCollection.concat(channelMessages);
                };
            };
            let msgs = await messageCollection.filter(msg => !msg.length).reverse();
            const text = await msgs.map(m=>`${m.author.tag}: ${m.content}`).join("\n")
            const logChannel = interaction.client.channels.cache.get(textId.verifyLog)
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setDescription(`👤 **User:** \`${targetmember.user.tag}\`\n📜 **ID:** \`${targetmember.user.id}\`\n\nVerification successful.`)
                .setThumbnail(targetmember.displayAvatarURL())
            if(text.length >= 2000) {
                const timestamp = await moment().format("M-D-YYYY, HH:mm")
                const fileAttach = new AttachmentBuilder(Buffer.from(text), {
                    name: `VerifyLog - ${timestamp}.txt`
                })
                await logChannel.send({ 
                    content: "Channel is over 2000 characters. Thus, a generated file.",
                    embeds: [successEmbed],
                    files: [fileAttach] 
                })
            } else {
                await logChannel.send({ 
                    content: `\`\`\`\n${text}\`\`\`` ,
                    embeds: [successEmbed]
                })
            }
        }

        async function verifySuccess() {
            await interaction.deferUpdate()
            await interaction.channel.send({ content: `${targetmember} is now verified!\n**The channel will be closed in five seconds.**` })
            try {
                await ticketschema.findOne({ userId: targetmember.user.id }).then(async() => {
                    await ticketdata.deleteOne({ userId: targetmember.user.id })
                });
            } catch (error) {
                console.log(error);
            }
            setTimeout(async() => {
                targetmember.roles.remove(unverified).catch(() => {})
                targetmember.roles.add(memberrole).catch(() => {})
                const welcome = new EmbedBuilder()
                    .setColor("#ffd100")
                    .setTitle(`Welcome to FaithChatt!`)
                    .setDescription(`Be sure to check out our <#${textId.roles}> and review our <#${textId.confidentiality}> as you begin working with us. It gives you access to specific channels, a new color, and important reminders pings.\n\nYou may also want to review our <#${textId.introduction}> and share a little bit about yourself. We make it easy and even provide a template to follow. Thanks for joining.`)
                    .setThumbnail(targetmember.user.displayAvatarURL({ dynamic: true }))
                    .setFooter({text: `UID: ${targetmember.user.id}`})
                    .setTimestamp()
                interaction.client.channels.cache.get(textId.general).send({ content: `${targetmember} has arrived!`, embeds: [welcome] }).catch(()=>{});
                interaction.channel.delete()
            }, 5000)
        }

        async function alreadyExists() {
            let messageCollection = new Collection();
            let channelMessages = await interaction.channel.messages.fetch({ limit: 100 }).catch(err => console.log(err));
            messageCollection = await messageCollection.concat(channelMessages);
            while (channelMessages.size === 100) {
                let lastMessageId = await channelMessages.lastKey();
                channelMessages = await interaction.channel.messages.fetch({ limit: 100, before: lastMessageId }).catch(err => console.log(err));
                if (channelMessages) {
                    messageCollection = await messageCollection.concat(channelMessages);
                };
            };
            let msgs = await messageCollection.filter(msg => !msg.length).reverse();
            const text = await msgs.map(m=>`${m.author.tag}: ${m.content}`).join("\n")
            const logChannel = interaction.client.channels.cache.get(textId.verifyLog)
            const successEmbed = new EmbedBuilder()
                .setColor('#00FF00')
                .setDescription(`👤 **User:** \`${targetmember.user.tag}\`\n📜 **ID:** \`${targetmember.user.id}\`\n\nMember was already verified. The bot was experiencing errors then the staff initially added the role for him/her.`)
                .setThumbnail(targetmember.displayAvatarURL())
            if(text.length >= 2000) {
                const timestamp = await moment().format("M-D-YYYY, HH:mm")
                const fileAttach = new AttachmentBuilder(Buffer.from(text), {
                    name: `VerifyLog - ${timestamp}.txt`
                })
                await logChannel.send({ 
                    content: "Channel is over 2000 characters. Thus, a generated file.",
                    embeds: [successEmbed],
                    files: [fileAttach] 
                })
            } else {
                await logChannel.send({ 
                    content: `\`\`\`\n${text}\`\`\`` ,
                    embeds: [successEmbed]
                })
            }

            await interaction.deferUpdate()
            await interaction.channel.send({ content: `${targetmember} was already verified by the staff member!\n**The channel will be closed in five seconds.**` })
            try {
                await ticketschema.findOne({ userId: targetmember.user.id }).then(async() => {
                    await ticketdata.deleteOne({ userId: targetmember.user.id })
                });
            } catch (error) {
                console.log(error);
            }
            setTimeout(async() => {
                interaction.channel.delete()
            }, 5000)
        }

        try {
            if(targetmember.roles.cache.has(rolesId.member)) return alreadyExists()
            await logAction()
            await verifySuccess()
        } catch (error) {
            console.error(error)
        }
    }
}