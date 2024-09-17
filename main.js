const { REST, Routes, Discord, Client, IntentsBitField, SlashCommandBuilder, Collection, ActivityType, Guild, Colors, Embed, ChannelFlags } = require('discord.js');
const dotenv = require('dotenv');
const fs = require('node:fs');
const path = require('node:path');

const config = require('./config.json');

const { EmbedBuilder } = require('@discordjs/builders');
const { error } = require('node:console');

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

// let statuses = [
//     {
//         name: 'Use /cmds or !cmds',
//     },
//     {
//         name: `My Creator`,
//         type: ActivityType.Watching
//     },
//     {
//         name: `Servers`,
//         type: ActivityType.Listening
//     },
// ];

bot.on('ready', () => {
    // setInterval(() => {
    //     let random = Math.floor(Math.random() * statuses.length);
    //     bot.user.setActivity(statuses[random]);
    // }, 6000)
    bot.user.setPresence({
        activities: [{
            type: ActivityType.Custom,
            name: 'Commands Help',
            state: `Use /cmds, !cmds or !commands. All commands in / will be available as normal prefixes too.`
        }],
        status: 'dnd'
    });
    console.log(`${bot.user.tag} ready to go!`)
});

bot.on('error', (e) => {
    console.log(e)
})

bot.on('interactionCreate', (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    console.log(interaction.commandName);

    if(interaction.commandName === 'commands'){
        const embedhelp = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('Help Menu')
        .setAuthor({ name: `${interaction.user.tag}` })
        .setThumbnail(interaction.user.avatarURL())
        .setDescription('All my commands and other help will be in these help menus.')
        .setImage(interaction.user.avatarURL())
        .addFields(
            { name: `About me`, value: `I am a bot that is useful for many things. I do Administration, Moderation, Economy, Fun and Gaming commands. I am a work in progress currently under one creator: RiptidesTacos` },
            { name: `Administration Commands`, value: `!addrole\n!deleterole\n!roles\n!addchannel\n!deletechannel\n!changeperms\n!userroles\n!modroles\n!adminroles`, inline: true},
            { name: `Moderation Commands`, value: `!mod\n!kick\n!mute\n!tempmute\n!unmute\n!ban\n!unban\n!jail\n!unjail\n!deafen\n!undeafen\n!members\n!note\n!notes\n!lock\n!unlock\n!warn\n!warnings\n!addrole\n `, inline: true},    
            { name: `Economy Commands`, value: `!money\n!cash\n!balance\n!shop\n!inventory\n!work\n!level\n!buy\n!sell\n!buybotcommands\n!transferbotcommand\n!job\n!pay\n!beg`, inline: true},
            { name: `Fun Commands`, value: `!randopic\n!randocat\n!randodog\n!flip\n!pokemon\n!poll`, inline: true},
            { name: `Game Commands`, value: `!roll\n!8ball\n!rps\n!!madlibs\n`, inline: true},
            { name: `Miscellaneous Commands`, value: `!ping`, inline: true},
            { name: `Music Commands`, value: `!play\n!pause\n!resume\n!search\n!rewind\n!ff\n!skip\n!skip#\n!add\n!queue\n!playtime\n!list`, inline: true}
        ) //.addFields end
        .setTimestamp()
        .setFooter({text: `Requested by: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL()});
        interaction.reply({embeds: [embedhelp]})
    }
})

bot.on('messageCreate', (message) => {
    if(message.content.toLowerCase() === `${pf}commands` || message.content.toLowerCase() === `${pf}cmds`){
        const embedhelp = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('Help Menu')
        .setAuthor({ name: `${message.author.tag}` })
        .setThumbnail(message.author.avatarURL())
        .setDescription('All my commands and other help will be in these help menus.')
        .setImage(message.author.avatarURL())
        .addFields(
            { name: `About me`, value: `I am a bot that is useful for many things. I do Administration, Moderation, Economy, Fun and Gaming commands. I am a work in progress currently under one creator: RiptidesTacos` },
            { name: `Administration Commands`, value: `!addrole\n!deleterole\n!roles\n!addchannel\n!deletechannel\n!changeperms\n!userroles\n!modroles\n!adminroles`, inline: true},
            { name: `Moderation Commands`, value: `!mod\n!kick\n!mute\n!tempmute\n!unmute\n!ban\n!unban\n!jail\n!unjail\n!deafen\n!undeafen\n!members\n!note\n!notes\n!lock\n!unlock\n!warn\n!warnings\n!addrole\n `, inline: true},    
            { name: `Economy Commands`, value: `!money\n!cash\n!balance\n!shop\n!inventory\n!work\n!level\n!buy\n!sell\n!buybotcommands\n!transferbotcommand\n!job\n!pay\n!beg`, inline: true},
            { name: `Fun Commands`, value: `!randopic\n!randocat\n!randodog\n!flip\n!pokemon\n!poll`, inline: true},
            { name: `Game Commands`, value: `!roll\n!8ball\n!rps\n!!madlibs\n`, inline: true},
            { name: `Miscellaneous Commands`, value: `!ping`, inline: true},
            { name: `Music Commands`, value: `!play\n!pause\n!resume\n!search\n!rewind\n!ff\n!skip\n!skip#\n!add\n!queue\n!playtime\n!list`, inline: true}
        ) //.addFields end
        .setTimestamp()
        .setFooter({text: `Requested by: ${message.author.tag}`, iconURL: message.author.avatarURL()})
            message.reply({embeds: [embedhelp]});
        }

        if(message.content.toLowerCase() === pf + 'addrole') {
            if(message.member.permissions.has('ManageRoles')){
                const addRoleEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setAuthor({name: message.author.tag, iconURL: message.author.avatarURL()})
                    .setTitle('Permissions Accepted')
                    .setThumbnail('https://cdn.discordapp.com/attachments/1285456471294873695/1285681434794786897/Denied2.png?ex=66eb27a4&is=66e9d624&hm=4f1aed7af7e11864866eba5b8b5cadd173a0d61adbbd1b69f01c97616d94cfb8&https://cdn.discordapp.com/attachments/1285456471294873695/1285681434794786897/Denied2.png?ex=66eb27a4&is=66e9d624&hm=4f1aed7af7e11864866eba5b8b5cadd173a0d61adbbd1b69f01c97616d94cfb8&')
                    .setDescription('You have the appropriate permissions to ')
                    .addFields(
                        { name: `Missing permissions`, value: `My records indicate that you are missing one or more permissions to use this command.
                            \nPermission missing ${message.member.permissions.has('ManageRoles')}`},
                        { name: `Resolving the issue`, value: `To fix this error please message a guild admin to give you the proper permissions for this command.
                            \nIf you cannot get in contact with an Administrator then you may use my request feature to message an administrator to add the requested command for you.`}
                    )
                    message.reply({embeds: [addRoleEmbed]})
            } else {
                if(!message.member.permissions.has('ManageRoles')){
                    console.log('Missing permissions')
                    const errorEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setAuthor(message.author.avatarURL())
                    .setTitle('Permission Error')
                    .setImage('https://ibb.co/Bnv2tpk')
                    .setDescription('You lack the correct permissions to use this command.')
                    .addFields(
                        { name: `Missing permissions`, value: `My records indicate that you are missing one or more permissions to use this command.
                            \nPermission missing ${message.member.permissions.missing('ManageRoles')}`},
                        { name: `Resolving the issue`, value: `To fix this error please message a guild admin to give you the proper permissions for this command.
                            \nIf you cannot get in contact with an Administrator then you may use my request feature to message an administrator to add the requested command for you.`}
                    )
                    message.reply({embeds: [errorEmbed]})
                }
            }
        }
    })
    


bot.login(TOKEN)

