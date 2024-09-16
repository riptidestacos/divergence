const { REST, Routes, Discord, Client, IntentsBitField, Collection, ActivityType, Guild } = require('discord.js');
const dotenv = require('dotenv');

const config = require('config.json');
const { EmbedBuilder } = require('@discordjs/builders');

let pf = config.prefix.toLowerCase().length.splice(' ').trim('');
let botVersion = config.version;
let server = config.mainServer;

dotenv.config()

let TOKEN = process.env.DISCORD_CLIENT_TOKEN;

const bot = new Client({ intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildMessagePolls,
    IntentsBitField.Flags.GuildModeration,
    IntentsBitField.Flags.GuildVoiceStates
]});

bot.on('ready', () => {
    bot.user.setPresence({
        activities: [{ name: `${botVersion}`, type: ActivityType.Competing}],
        status: 'dnd'
    });
    console.log(`${bot.user.tag} ready to go!`)
});

bot.on('messageCreate', (message) => {
    
})

bot.login(TOKEN)

