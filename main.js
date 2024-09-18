const { REST, Routes, Discord, Client, IntentsBitField, PermissionsBitField, SlashCommandBuilder, Collection, ActivityType, Guild, Colors, Embed, ChannelFlags } = require('discord.js');
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

bot.on('messageCreate', async (message) => {
    if(message.author.bot) return;
    if(!message.content.startsWith(pf)) return;

    const author = message.author;
    const member = message.member;
    const args = message.content.slice(pf.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();

    if(command === `commands` ||command === `cmds`){
        const embedhelp = new EmbedBuilder()
        .setColor(Colors.Green)
        .setTitle('Help Menu')
        .setAuthor({ name: `${author.tag}` })
        .setThumbnail(author.avatarURL())
        .setDescription('All my commands and other help will be in these help menus.')
        .setImage(author.avatarURL())
        .addFields(
            { name: `About me`, value: `I am a bot that is useful for many things. I do Administration, Moderation, Economy, Fun and Gaming commands. I am a work in progress currently under one creator: RiptidesTacos` },
            { name: `Administration Commands`, value: `!addrole\n!createrole\n!deleterole\n!roles\n!addchannel\n!deletechannel\n!changeperms\n!userroles\n!modroles\n!adminroles`, inline: true},
            { name: `Moderation Commands`, value: `!mod\n!kick\n!mute\n!tempmute\n!unmute\n!ban\n!unban\n!jail\n!unjail\n!deafen\n!undeafen\n!members\n!note\n!notes\n!lock\n!unlock\n!warn\n!warnings\n!addrole\n `, inline: true},    
            { name: `Economy Commands`, value: `!money\n!cash\n!balance\n!shop\n!inventory\n!work\n!level\n!buy\n!sell\n!buybotcommands\n!transferbotcommand\n!job\n!pay\n!beg`, inline: true},
            { name: `Fun Commands`, value: `!randopic\n!randocat\n!randodog\n!flip\n!pokemon\n!poll`, inline: true},
            { name: `Game Commands`, value: `!roll\n!8ball\n!rps\n!!madlibs\n`, inline: true},
            { name: `Miscellaneous Commands`, value: `!ping`, inline: true},
            { name: `Music Commands`, value: `!play\n!pause\n!resume\n!search\n!rewind\n!ff\n!skip\n!skip#\n!add\n!queue\n!playtime\n!list`, inline: true}
        ) //.addFields end
        .setTimestamp()
        .setFooter({text: `Requested by: ${author.tag}`, iconURL: author.avatarURL()})
            message.reply({embeds: [embedhelp]});
        }

        if(command === `createrole`) {
            //Add the errorEmbed if missing ManageRole permission
            if (!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                            //Permissions Error EmbedBuilder
            const errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({name: author.tag, iconURL: author.avatarURL()})
            .setTitle('Permission Error')
            .setImage('https://cdn.discordapp.com/attachments/1285456471294873695/1285681434794786897/Denied2.png?ex=66eb27a4&is=66e9d624&hm=4f1aed7af7e11864866eba5b8b5cadd173a0d61adbbd1b69f01c97616d94cfb8&https://cdn.discordapp.com/attachments/1285456471294873695/1285681434794786897/Denied2.png?ex=66eb27a4&is=66e9d624&hm=4f1aed7af7e11864866eba5b8b5cadd173a0d61adbbd1b69f01c97616d94cfb8&')
            .setDescription('You lack the correct permissions to use this command.')
            .addFields(
                { name: `Missing permissions`, value: `My records indicate that you are missing one or more permissions to use this command.
                    \nPermission missing ${member.permissions.missing('ManageRoles')}`},
                { name: `Resolving the issue`, value: `To fix this error please message a guild admin to give you the proper permissions for this command.
                    \nIf you cannot get in contact with an Administrator then you may use my request feature to message an administrator to add the requested command for you.`}
            )
                return message.reply({embeds: [errorEmbed]})
            }

            //Extract the role name (first argument)
            var roleName = args[0];
            //roleName errorEmbed
            if(!roleName) {
                const roleNameErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({
                name: author.tag,
                iconURL: author.avatarURL()
            })
            .setTitle('Role Name Missing!')
            .setDescription('Please specify a name for the role you would like to add.')
                return message.reply({ embeds: [roleNameErrorEmbed]})
            }

            //Color args (second argument)
            const colorArg = args[1];
            let color = '#000FFF';

            if (/^#[0-9A-F]{6}$/i.test(colorArg)) {
                color = colorArg;
            } else if (/^[0-9A-F]{6}$/i.test(colorArg)) {
                color = `#${colorArg}`;
            } 
            //Reason Args (third argument)
            const reason = args.slice(2).join(' ') || 'No reason provided';

            try {
                // Create the role
                const basePermissions = [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                    PermissionsBitField.Flags.ReadMessageHistory,
                    PermissionsBitField.Flags.SendMessagesInThreads,
                    PermissionsBitField.Flags.CreatePublicThreads,
                    PermissionsBitField.Flags.CreatePrivateThreads,
                    PermissionsBitField.Flags.EmbedLinks,
                    PermissionsBitField.Flags.AddReactions,
                    PermissionsBitField.Flags.UseExternalEmojis,
                    PermissionsBitField.Flags.UseExternalStickers,
                    PermissionsBitField.Flags.UseExternalSounds,
                    PermissionsBitField.Flags.ChangeNickname,
                    PermissionsBitField.Flags.Connect,
                    PermissionsBitField.Flags.Speak,
                    PermissionsBitField.Flags.Stream,
                    PermissionsBitField.Flags.UseEmbeddedActivities,
                    PermissionsBitField.Flags.UseSoundboard,
                    PermissionsBitField.Flags.UseVAD,


                ];
    
                // Create the role with permissions
                const role = await message.guild.roles.create({
                    name: roleName,
                    color: color,
                    reason: reason,
                    permissions: basePermissions
                });

                            // Send a confirmation message
            const addRoleEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setTitle(`Role '${role.name}' added successfully`)
            .setDescription(`The role "${role.name}" has been created`)
            .addFields(
                { name: 'Color', value: color, inline: true },
                { name: 'Reason', value: reason, inline: true}
            );

        message.reply({ embeds: [addRoleEmbed] });
    } catch (error) {
        console.error('Error creating role:', error);
        message.channel.send('There was an error creating the role.');
    }
}
                    
        })
    


bot.login(TOKEN)

