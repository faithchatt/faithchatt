module.exports = {
    once: false,
    name: "guildMemberRemove",
    async execute(member) {
        console.log(member.user.username + " left the server");
    },
};
