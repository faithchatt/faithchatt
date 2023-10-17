const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const { miscValues } = require('../../utils/variables')
const permflag = PermissionsBitField.Flags

module.exports = {
	data: new SlashCommandBuilder()
		.setName('modnick')
		.setDescription('Changes a randomized nickname for user')
        .addUserOption(option => option.setName('user').setDescription('User to be unjailed').setRequired(true)),
	async execute(interaction) {
        const member = await interaction.options.get('user').member
        if(!interaction.member.permissions.has(permflag.ChangeNickname)) return interaction.reply({
            embeds: [new EmbedBuilder()
            .setDescription("❌ | You are not a staff member authorized to use this command.")
            .setColor("#ff0000")],
            ephemeral: true
        })

        var num1 = Math.floor(Math.random()*miscValues.nicknameSet.length);
        var num2 = Math.floor(Math.random()*miscValues.nicknameSet.length);
        try {
            await member.setNickname(nicknameSet[num1]+nicknameSet[num2]);
            await setTimeout(() => message.delete().catch(() => {}), 3000)
            await interaction.reply({ embeds: [
                new EmbedBuilder()
                .setDescription(`✅ | **${targetmember.user.tag}**'s nickname has been generated and changed!`)
                .setColor("#00ff00")
            ]})
        } catch (error) {
            console.log(error)
        }
	},
};