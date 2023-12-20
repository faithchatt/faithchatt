const { Client } = require("discord.js");

const intentsLoad = ["DirectMessages", "Guilds", "GuildEmojisAndStickers", "GuildIntegrations", "GuildMessages", "GuildPresences", "GuildVoiceStates", "MessageContent"];
const partialsLoad = ["User", "Channel", "GuildMember", "Message", "Reaction", "ThreadMember"];

const client = new Client({ intents: intentsLoad, partials: partialsLoad });
module.exports.client = client;
require("dotenv").config();
require("./utils/handler.js");
require("./utils/mongo")();

client.login(process.env.TOKEN);