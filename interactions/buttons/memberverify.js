const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, ChannelType, PermissionsBitField } = require('discord.js')
const faithchatt = require('../../utils/variables')
const ticketschema = require('../../model/ticket.js')
const configschema = require('../../model/botconfig.js')
const perms = PermissionsBitField.Flags

module.exports = {
    data: {
        name: 'verifyStart'
    },
    async execute(interaction) {
        {
            const moderatorrole = interaction.guild.roles.cache.get(faithchatt.rolesId.staff)
            const unverified = interaction.guild.roles.cache.get(faithchatt.rolesId.unverified)
            const regular = interaction.guild.roles.cache.get(faithchatt.rolesId.regular)
            const memberrole = interaction.guild.roles.cache.get(faithchatt.rolesId.member)
            const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone")

            let ticketdata = await ticketschema.findOne({ userId: interaction.user.id });
            let configdata = await configschema.findOne({ guildId: interaction.guild.id });

            async function startVerifyTicket() {
                try {
                    const ticketembed = new EmbedBuilder()
                        .setTitle('Welcome! Please answer the questions properly to gain server entry.  A minimum of one sentence will do. One-worders for each question will not be accepted.')
                        .setDescription(`1. What made you come to the server?\n2. Where did you find the invite link?\n3. What is your age and gender?\n4. Who is Jesus, what has He done, and what does that mean to you?\n5. Have you been on FaithChatt Forum in the past?\n6. If done, ping a staff member. We will reach out to you as soon as possible.\n\n**NOTE:** We only allow incoming members of 13 years old and above, as prescribed by Discord's Terms of Service, for the safety of our brothers and sisters online.`)
                        .setThumbnail('https://i.imgur.com/xO46ifo.png')
                        .setColor("#ffd100")
                        .setFooter({ text: "© FaithChatt Forum" })
                    const buttonrow = new ActionRowBuilder().addComponents(
                        new ButtonBuilder()
                            .setCustomId('verifyAssess')
                            .setLabel('Assess the verification (staff only)')
                            .setEmoji('📋')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(false),
                    );
                    
                    let ticketname = interaction.user.tag;

                    if(!ticketdata) {
                        let verifychannel = await interaction.guild.channels.create({
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
                                { id: everyone.id, deny: [perms.ViewChannel] }
                            ]
                        })
                        ticketdata = await ticketschema.create({ 
                            userId: interaction.user.id, 
                            userName: ticketname,
                            channelId: verifychannel.id
                        });
                        verifychannel.send({ content: `${interaction.user}`, embeds: [ticketembed], components: [buttonrow] }).catch(e=>{})
                        return interaction.reply({ content: `Ticket created! Please check ${verifychannel}`, ephemeral: true }).catch(e=>{})
                    } else {
                        if (!interaction.guild.channels.cache.has(ticketdata.channelId)) {
                            let verifychannel = await interaction.guild.channels.create(ticketname, {
                                type: ChannelType.GuildText,
                                parent: faithchatt.parentId.verification,
                                topic: interaction.user.id,
                                permissionOverwrites: [
                                    { id: interaction.user.id, allow: [perms.ViewChannel, perms.ReadMessageHistory, perms.SendMessages], deny: [perms.ManageChannels, perms.EmbedLinks, perms.AttachFiles, perms.CreatePublicThreads, perms.CreatePrivateThreads, perms.CreateInstantInvite, perms.SendMessagesInThreads, perms.ManageThreads, perms.ManageMessages, perms.UseExternalEmojis, perms.UseExternalStickers, perms.UseApplicationCommands, perms.ManageWebhooks, perms.ManageRoles, perms.SendTTSMessages] },
                                    { id: regular.id, deny: [perms.EmbedLinks, perms.AttachFiles] },
                                    { id: memberrole.id, deny: [perms.ViewChannel] },
                                    { id: unverified.id, deny: [perms.ViewChannel] },
                                    { id: moderatorrole.id, allow: [perms.ViewChannel, perms.SendMessages, perms.ReadMessageHistory] },
                                    { id: everyone.id, deny: [perms.ViewChannel] }
                                ]
                            })
                            ticketdata.channelId = verifychannel.id;
                            await ticketdata.save();
                            await verifychannel.send({ content: `${interaction.user}`, embeds: [ticketembed] }).catch(e=>{})
                            return interaction.reply({ content: `Ticket created! Please check ${verifychannel}`, ephemeral: true }).catch(e=>{})
                        }
                        return interaction.reply({ content: "You have already created a ticket! If you have problems, immediately contact/DM the moderators.", ephemeral: true }).catch(e=>{})
                    } 
                } catch (err) {
                    console.log(err)
                }
            }

            if(!configdata) configdata = await configschema.create({ guildId: interaction.guild.id });
            if(configdata.verifyLock === true) { 
                return interaction.reply({ 
                embeds: [
                    new EmbedBuilder()
                    .setTitle("Verification is currently locked.")
                    .setDescription("Due to the unexpected circumstances happening in our server, the verification channel is locked until further notice. Please contact a staff member for questions and details.")
                    .setFooter({ text: "© FaithChatt Forum" })
                    .setColor("#ff0000")
                ],
                ephemeral: true 
            })} else if (configdata.verifyLock === false) {
                await startVerifyTicket()
            } else {
                // Only works IF the verification channel is set up for the first time
                configdata.verifyLock = false
                configdata.verifyAutoClose = true
                configdata.save()
                await startVerifyTicket()
            }
        }
    }
}