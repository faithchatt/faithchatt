const { rolesId } = require("../../../utils/variables");

module.exports = {
    once: false,
    name: "guildMemberAdd",
    async execute(member) {
        // Give unverified role
        const unverifiedRole = member.guild.roles.cache.get(rolesId.unverified);
        member.roles.add(unverifiedRole).catch(console.error);
    },
};
