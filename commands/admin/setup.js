const { WebhookClient, EmbedBuilder, SlashCommandBuilder, PermissionsBitField, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const permflag = PermissionsBitField.Flags

module.exports = {
	data: new SlashCommandBuilder()
		.setName('setup')
		.setDescription('ADMINISTRATOR/DEVELOPMENT TEAM USE ONLY')
        .addStringOption(option => option
            .setName('select')
            .setDescription('Choose which to start setting up')
            .addChoices(
                {name: "Verification Channel Panel", value: "verify"},
                {name: "Rules and Regulations Embed", value: "rules"})
            .setRequired(true))
        .addChannelOption(option => option
            .setName('channel')
            .setDescription('Select which channel to complete the setup')
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(true)),
	async execute(interaction) {
		if(!interaction.member.permissions.has(permflag.Administrator)) return interaction.reply({
            embeds: [new EmbedBuilder()
            .setDescription("❌ | You are not an admin authorized to use this command.")
            .setColor("#ff0000")],
            ephemeral: true
        }) 

        const selection = interaction.options.get('select').value
        const channel = interaction.options.getChannel('channel')

        switch (selection) {
            case 'verify':
                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('verifyStart')
                        .setLabel('Verify here!')
                        .setEmoji('✅')
                        .setStyle(ButtonStyle.Success)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setURL('https://discord.com/channels/839708279973478430/839896314963296277/922492282928762890')
                        .setLabel('Read the rules!')
                        .setEmoji('📜')
                        .setStyle(ButtonStyle.Link)
                        .setDisabled(false),
                    new ButtonBuilder()
                        .setURL('https://discord.com/channels/839708279973478430/843352934595166239/939068233988833300')
                        .setLabel('Confidentiality Agreement')
                        .setEmoji('😇')
                        .setStyle(ButtonStyle.Link)
                        .setDisabled(false)
                );
                const embed = new EmbedBuilder()
                    .setTitle('Welcome to FaithChatt!')
                    .setDescription('Thank you for joining us here on Discord. We are here to provide Bible studies to the entire world, fellowship with friends, Christian discipleship, and to share the gospel daily. Thanks for helping us proclaim the love of Jesus Christ virtually.\n\n**If you have problems with the verification ticket creation, immediately contact the moderators.**')
                    .setThumbnail("https://cdn2.iconfinder.com/data/icons/unigrid-phantom-multimedia-vol-5/60/020_246_mail_email_envelope_message_ok_check_final_step_verification-512.png")
                    .setImage('https://cdn.discordapp.com/attachments/839719301963579442/859476775984431134/Gold_and_Black_Channel_Art.png')
                    .setFooter({ text: '© FaithChatt Forum' })
                    .setColor('#ffd100')
                await channel.send({ embeds: [embed], components: [row] })
                await interaction.reply({ embeds: [
                    new EmbedBuilder()
                    .setTitle("Setup successful!")
                    .setDescription(`✅ | Verification channel is now on ${channel}`)
                ], ephemeral: true })
                break;
            case 'rules':
                const wc_rules = new WebhookClient({
                    id: '865439061242150962',
                    token: 'ivEQeO2RDTGWVHo_BRVwfnEa48qd8hJIo0v8duRMViJagQDhM2qQIF9ZZJl2dROduUYL'
                });
                const rule_intro = new MessageEmbed()
                    .setColor('#ffd100')
                    .setTitle('Welcome to the server!')
                    .setDescription('FaithChatt is not just another server but a Christ-centered ministry that desires to reach people around the world with Biblical TRUTH and its application 24/7/365.')
                const rule1 = new MessageEmbed()
                    .setColor('#ffd100')
                    .setTitle('12 Rules to Remember')
                    .setDescription(`1. Watch your tongue and refrain from using crude, bathroom, or sexual humor. Be respectful and loving at all times. Racial slurs are not tolerated. Profanity is not allowed. Name calling is not allowed; this includes derogatory spellings of denominations. Toxicity will not be allowed.\n\n2. Offending people because you shared the truth isn’t necessarily wrong, but we never want to create a stumbling block for other believers in the body of Christ. The main goal for a Christian is to "be the Light" and tell others about Christ. Love others as Christ loves you. (If you see a fellow Christian expressing clearly heretical/un-Christian beliefs, attempt to correct them with scripture directly, but remember to do so lovingly. If needed, follow the precepts in <#843342075499118643> for resolutions)\n\n3. Sexual media of any sort will not be tolerated and will result in a perma-ban. Please keep usernames and avatars clean. You may be muted, kicked, or banned based on the severity of your username or profile pic. Keep it clean people.\n\n4. Intentional spamming will not be tolerated. Bot spam, as well as other kinds of light spam, are NOT allowed here. Memeing in our channels is ONLY allowed if it is relevant and does not derail conversations.\n\n5. Advertising is not allowed without first asking a staff member. They must relate to Christ in some capacity. We do want to partner with other servers united under our flag of the Five Solas. Do not advertise events happening on other servers without that prior approval.\n\n6. We respect your privacy and expect the same from our members. Doxxing and/or sharing private information of another user without their consent may result in an instant permaban! Be sure to read our guidelines and adhere to our **Confidentiality Agreement** at <#843352934595166239> upon arrival. We want to respect everyone's privacy here.`)
                const rule2 = new MessageEmbed()
                    .setColor('#ffd100')
                    .setDescription("7. Non-Christians should NOT argue against the Nicene Creed. However we welcome open discussion with those interested in learning about it. Proselytization by non-Christians will result in a warning, kick, or ban.\n\nNOTE: We define a Christian as someone who affirms the Nicene Creed.\n\n```\nWe believe in one God, the Father Almighty, Maker of heaven and earth, and of all things visible and invisible.\n\nAnd in one Lord Jesus Christ, the only-begotten Son of God, begotten of the Father before all worlds (æons), Light of Light, very God of very God, begotten, not made, being of one substance with the Father; by whom all things were made; who for us men, and for our salvation, came down from heaven, and was incarnate by the Holy Ghost of the Virgin Mary, and was made man; he was crucified for us under Pontius Pilate, and suffered, and was buried, and the third day he rose again, according to the Scriptures, and ascended into heaven, and sitteth on the right hand of the Father; from thence he shall come again, with glory, to judge the quick and the dead; whose kingdom shall have no end.\n\nAnd in the Holy Ghost, the Lord and Giver of life, who proceedeth from the Father and the Son, who with the Father and the Son together is worshiped and glorified, who spake by the prophets. In one holy catholic and apostolic Church; we acknowledge one baptism for the remission of sins; we look for the resurrection of the dead, and the life of the world to come. Amen.\n```")
                const rule3 = new MessageEmbed()
                    .setColor('#ffd100')
                    .setDescription("8. Sometimes conversations get heated, so take a break if you're feeling stressed. If the Admins/Mods think that a discussion is taking a turn for the worse, we may mute you temporarily for your own good or block the chat for a few minutes so things can cool down. Be loving at all times\n\n" + `9. Attempts at converting your fellow Christian are NOT allowed. We’re not here to pull believers from one church to another. However discussions on the merits of different denominations are allowed, but blatant conversion attempts are not. We like to focus on the Union with Christ here. (You may discuss, civilly, why you believe a denomination to be wrong or discuss why you believe it to be the truth. But, saying "Become <denomination>" is not allowed. If it is felt you are, too frequently, starting debates on why your denomination is correct, you will be spoken with and further action will be taken from there)\n\n` + "10. Anyone (including non-Christians) who come in looking for a fight or to simply push their ideas will be removed. Coming into the server without the intention to focus on Christ will not be tolerated. Toxic members may be kicked or banned without warning if staff feels you are a detriment to the server.\n\n11. Denomination bashing is a violation of server policy. In order to prevent this from happening, we ask that members maintain respect of each other’s denomination. Be aware of Rule 9, as well as the importance in maintaining LOVE for one another. We're all part of the body of Christ.\n\n12. These rules are not all of which governs this server. Moderators have discretion to act when it is felt an action is detrimental to the well being of the server and its members. Love others as Christ loves you. Failure to follow any of these rules may result in a mute, kick, or permaban.")
                wc_rules.send({ embeds: [rule_intro, rule1, rule2, rule3] });
                break;
            default: return
        }
	},
};