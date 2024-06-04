module.exports = {
    once: false,
    name: "guildMemberAdd",
    async execute(member) {
        console.log(member.user.username + " joined the server");
    },
};
