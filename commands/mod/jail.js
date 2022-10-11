const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType } = require('discord.js');
const { textId, parentId, rolesId } = require('../../utils/variables')
const schema = require('../../utils/variables')
const perm = PermissionsBitField.Flags

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jail')
		.setDescription('Jails a member breaking the rules')
        .addUserOption(option => option.setName('user').setDescription('User to be jailed').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Reason for user to be jailed').setRequired(true)),
	async execute(interaction) {
        const member = await interaction.options.get('user').member
        const reason = await interaction.options.get('reason').value
		if(!interaction.member.permissions.has(permflag.BanMembers || permflag.KickMembers)) return interaction.reply({
            embeds: [new EmbedBuilder()
            .setDescription("❌ | You are not a staff member authorized to use this command.")
            .setColor("#ff0000")],
            ephemeral: true
        }) 

        const memberrole = interaction.guild.roles.cache.get(rolesId.member)
        const regularrole = interaction.guild.roles.cache.get(rolesId.regular)
        const usherrole = interaction.guild.roles.cache.get(rolesId.usher)
        const prayerwarrior = interaction.guild.roles.cache.get(rolesId.prayerwarrior)
        const fisherofmen = interaction.guild.roles.cache.get(rolesId.fisherofmen)
        const languagechat = interaction.guild.roles.cache.get(rolesId.chatlanguage)
        const topicchat = interaction.guild.roles.cache.get(rolesId.chattopics)
        const videogameschat = interaction.guild.roles.cache.get(rolesId.chatvideogames)

        const legalrole = interaction.guild.roles.cache.get(rolesId.legal)
        const underagerole = interaction.guild.roles.cache.get(rolesId.underage)
        const malerole = interaction.guild.roles.cache.get(rolesId.male)
        const femalerole = interaction.guild.roles.cache.get(rolesId.female)

        const mutedrole = interaction.guild.roles.cache.get(rolesId.muted)
        const unverified = interaction.guild.roles.cache.get(rolesId.unverified)
        const everyone = interaction.guild.roles.cache.find(r => r.name === "@everyone")
        const modlog = interaction.guild.channels.cache.get(textId.modLog)

        const moderatorrole = interaction.guild.roles.cache.get(rolesId.moderator)
        const modcheck = interaction.member.roles.cache.has(rolesId.moderator)
		
        let data = await schema.findOne({ userId: member.user.id })
        if(!data) {
            await member.roles.add(mutedrole).catch(e=>{})
            await member.roles.remove(unverified).catch(e=>{})
            await member.roles.remove(memberrole).catch(e=>{})
            await member.roles.remove(regularrole).catch(e=>{})
            await member.roles.remove(usherrole).catch(e=>{})
            await member.roles.remove(prayerwarrior).catch(e=>{})
            await member.roles.remove(fisherofmen).catch(e=>{})
            await member.roles.remove(malerole).catch(e=>{})
            await member.roles.remove(femalerole).catch(e=>{})
            await member.roles.remove(legalrole).catch(e=>{})
            await member.roles.remove(underagerole).catch(e=>{})
            await member.roles.remove(languagechat).catch(e=>{})
            await member.roles.remove(topicchat).catch(e=>{})
            await member.roles.remove(videogameschat).catch(e=>{})

            let ticketname = member.user.tag
            let jailchannel = await message.guild.channels.create("jail-"+ticketname, {
                type: ChannelType.GuildText,
                parent: parentId.jail,
                topic: member.user.id,
                permissionOverwrites: [
                    { id: member.user.id, allow: [perm.ViewChannel, perm.ReadMessageHistory, perm.SendMessages], deny: [perm.ManageChannels, perm.EmbedLinks, perm.AttachFiles, perm.CreatePublicThreads, perm.CreatePrivateThreads, perm.CreateInstantInvite, perm.SendMessagesInThreads, perm.ManageThreads, perm.ManageMessages, perm.UseExternalEmojis, perm.UseExternalStickers, perm.UseApplicationCommands, perm.ManageWebhooks, perm.ManageRoles, perm.SendTTSMessages] },
                    { id: mutedrole.id, deny: [perm.EmbedLinks, perm.AttachFiles] },
                    { id: memberrole.id, deny: [perm.ViewChannel] },
                    { id: moderatorrole.id, allow: [perm.ViewChannel, perm.SendMessages, perm.ReadMessageHistory] },
                    { id: everyone.id, deny: [perm.ViewChannel] }
                ]
            })

            data = await schema.create({
                userId: member.user.id,
                userName: member.user.tag,
                textChannel: jailchannel.id
            })

            console.log(`🚨 Member has been jailed:\nMember: ${member.user.tag}\nReason: ${reason}`)
            const channelembed = new EmbedBuilder()
                .setTitle("You have been jailed!")
                .setDescription(`👤 **User:** \`${member.user.tag}\`\n🔒 **Reason:** \`${reason}\`\n\nYou have been restricted access to all channels as of the moment. Leaving and rejoining the server to bypass the mute will result into a permanent sanction.`)
                .setFooter({ text: `UID: ${member.user.id}` })
                .setColor('#ff0000')
            await interaction.react('🔒').then(() => {
                member.send({ embeds: [
                    new EmbedBuilder()
                    .setTitle("You have been jailed!")
                    .setDescription(`👤 **User:** \`${member.user.tag}\`\n🔒 **Reason:** \`${reason}\`\n\nYou have been restricted access to all channels as of the moment. Leaving and rejoining the server to bypass the mute will result into a permanent sanction. ${jailchannel}`)
                    .setFooter({ text: `UID: ${member.user.id}` })
                    .setColor('#ff0000')
                ] }).catch(() => {})
            }).catch(() => {})
            await interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setDescription(`🔒 **${member.user.tag}** has been jailed!`)
                    .setFooter({ text: `UID: ${member.user.id}` })
                    .setColor('#ff0000')
            ] })
            await modlog.send({ embeds: [
                new EmbedBuilder()
                    .setDescription(`👤 **User:** \`${member.user.tag}\`\n\`${member.user.id}\`\n🔒 **Reason:** \`${reason}\`\n\n👮‍♂️ **Moderator**: \`${interaction.user.tag}\``)
                    .setFooter({ text: `Moderator UID: ${interaction.user.id}` })
                    .setColor('#ff0000')
            ] })
            data.save()
            await jailchannel.send({ content: `${member}`, embeds: [channelembed] }).catch(e=>{})
        }
	},
};