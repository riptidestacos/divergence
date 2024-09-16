const { REST, Routes, Discord, Client, IntentsBitField, Collection, ActivityType, Guild, Colors, Embed, ChannelFlags } = require('discord.js');
const dotenv = require('dotenv');

const config = require('./config.json');
const { EmbedBuilder } = require('@discordjs/builders');
const { channel } = require('process');
const { url } = require('inspector');

let pf = config.prefix.toLowerCase().slice(' ').trim('');
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

bot.on('error', (e) => {
    console.log(e)
})

bot.on('messageCreate', (message) => {
    if(message.content.toLowerCase() === `${pf}help`){
        const embedhelp = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('Help Menu')
        .setAuthor({ name: `${message.author.tag}` })
        .setDescription('All my commands and other help will be in these help menus.')
        .setImage(message.author.avatarURL())
        .addFields(
            { name: `About me`, value: `I am a bot that is useful for many things. I do Administration, Moderation, Economy, Fun and Gaming commands. I am a work in progress currently under one creator: RiptidesTacos` },
            { name: `Moderation Commands`, value: `\n!Mod\n!kick\n!mute\n!tempmute\n!unmute\n!ban\n!unban\n!jail\n!unjail\n!deafen\n!undeafen\n!members\n!note\n!notes\n!lock\n!unlock\n!warn\n!warnings\n!addrole\n `, inline: true},    
            { name: `Economy Commands`, value: `!money\n!cash\n!balance\n!shop\n!inventory\n!work\n!level\n!buy\n!sell\n!buybotcommands\n!transferbotcommand\n!job\n!pay\n!beg`, inline: true},
            { name: `Fun Commands`, value: `!randopic\n!randocat\n!randodog\n!flip\n!pokemon\n!poll`, inline: true},
            { name: `Game Commands`, value: `!roll\n!8ball\n!rps\n!!madlibs\n`, inline: true},
            { name: `Miscellaneous Commands`, value: `!ping\n!`},
            { name: `Music Commands`, value: `!play\n!`}
        ) //.addFields end
            message.reply({embeds: [embedhelp]});
        }
    })
    


bot.login(TOKEN)

