const { EmbedBuilder } = require("discord.js")
const faithchatt = require('../../utils/variables')

module.exports = {
    data: {
        name: 'modsuggest-modal'
    },
    async execute(interaction) {
        const textChannel = interaction.client.channels.cache.get(faithchatt.textId.staffsuggest)
        const textInput = await interaction.fields.getTextInputValue('modsuggest-modal-input')
        await textChannel.send({ embeds: [
            new EmbedBuilder()
            .setColor('#ffd100')
            .setAuthor({ name: `${interaction.user.tag} suggests:`, iconURL: interaction.user.displayAvatarURL() })
            .setDescription(textInput)
            .setFooter({ text: "© FaithChatt Forum" })
        ] }).then(m => {
            m.react("<:thumb_green:918899980423544843>")
            m.react("<:thumb_red:918899980377411634>")
            m.react("❔")
        })
        await interaction.reply({ embeds: [
            new EmbedBuilder()
            .setTitle('Your suggestion has been sent!')
            .setFooter({ text: "© FaithChatt Forum" })
            .setColor('#ffd100')
        ], ephemeral: true }).catch(err => {})
    }
}