const { EmbedBuilder, SlashCommandBuilder, PermissionsBitField } = require("discord.js");
const { parentId } = require("../../utils/variables");
const perm = PermissionsBitField.Flags;
const schema = require("../../model/jailsystem.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unjail")
        .setDescription("Unjails a member")
        .addUserOption(option => option.setName("user").setDescription("User to be unjailed").setRequired(true)),
    async execute(interaction) {
        if (!interaction.member.permissions.has(perm.BanMembers || perm.KickMembers)) {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("❌ | You are not a staff member authorized to use this command.")
                    .setColor("#ff0000")],
                ephemeral: true,
            });
        }

        async function userNoExist() {
            await interaction.reply({ content: "❌ | This user does not exist.", ephemeral: true });
        }

        async function userNoData() {
            await interaction.reply({ content: "❌ | This user has no data.", ephemeral: true });
        }

        async function channelNoExist() {
            await interaction.reply({ content: "❌ | The corresponding channel does not exist.", ephemeral: true });
        }

        async function channelWrong() {
            await interaction.reply({ content: "❌ | This user is not jailed in this specific channel.", ephemeral: true });
        }

        if (interaction.channel.parent.id === parentId.jail) {
            try {
                const member = await interaction.options.get("user").member;
                let userdata = await schema.findOne({ userId: member.user.id })
                let userAvail = member.user.id == userdata.userId;
                let channelAvail = interaction.channel.id == userdata.textChannel;

                if(!userAvail) return userNoData();
                if(!channelAvail) return channelNoExist();

                if (!userAvail && channelAvail) userNoData();
                else if (userAvail && !channelAvail) channelWrong();
                else if (userAvail && channelAvail) {
                    await interaction.reply({ content: "✅ | Successfully unjailed the user.", ephemeral: true });
                    await userdata.deleteOne({ userId: member.user.id });
                }
            } catch (e) {
                await userNoExist();
            }
        }
        else {
            return interaction.reply({
                embeds: [new EmbedBuilder()
                    .setDescription("❌ | You are not allowed to execute outside the jail category.")
                    .setColor("#ff0000")],
                ephemeral: true,
            });
        }
    },
};
