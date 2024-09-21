const { REST, Routes, Discord, Client, IntentsBitField, PermissionsBitField, SlashCommandBuilder, Collection, ActivityType, Guild, Colors, Embed, ChannelFlags, MembershipScreeningFieldType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

bot.on('interactionCreate', async (interaction) => {
    // Check if the interaction is a button
    if (interaction.isButton()) {
        console.log('Button clicked:', interaction.customId);
        
        if (interaction.customId === 'requestPermission') {
            await interaction.deferUpdate(); // Acknowledge the interaction
            
            const channelId = '1285821435352190986';
            const channel = await bot.channels.fetch(channelId);
            
            if (channel) {
                try {
                    await channel.send(`${interaction.user.tag} would like to request the **Manage Roles** permission.`);
                    await interaction.followUp({ content: 'Your request has been sent!', ephemeral: true });
                } catch (error) {
                    console.error('Error sending request:', error);
                    await interaction.followUp({ content: 'An error occurred while sending your request.', ephemeral: true });
                }
            } else {
                await interaction.followUp({ content: 'Could not find the channel to send your request.', ephemeral: true });
            }
        }
        return; // Exit to avoid running command checks for button interactions
    }

    // Check if the interaction is a chat input command
    if (interaction.isChatInputCommand()) {
        console.log(interaction.commandName);

        if (interaction.commandName === 'commands') {
            const embedhelp = new EmbedBuilder()
                .setColor(Colors.Green)
                .setTitle('Help Menu')
                .setAuthor({ name: `${interaction.user.tag}` })
                .setThumbnail(interaction.user.avatarURL())
                .setDescription('All my commands and other help will be in these help menus.')
                .setImage(interaction.user.avatarURL())
                .addFields(
                    { name: `About me`, value: `I am a bot that is useful for many things. I do Administration, Moderation, Economy, Fun and Gaming commands. I am a work in progress currently under one creator: RiptidesTacos` },
                    { name: `Administration Commands`, value: `!addrole\n!deleterole\n!roles\n!addchannel\n!deletechannel\n!changeperms\n!userroles\n!modroles\n!adminroles`, inline: true },
                    { name: `Moderation Commands`, value: `!mod\n!kick\n!mute\n!tempmute\n!unmute\n!ban\n!unban\n!jail\n!unjail\n!deafen\n!undeafen\n!members\n!note\n!notes\n!lock\n!unlock\n!warn\n!warnings\n!addrole`, inline: true },
                    { name: `Economy Commands`, value: `!money\n!cash\n!balance\n!shop\n!inventory\n!work\n!level\n!buy\n!sell\n!buybotcommands\n!transferbotcommand\n!job\n!pay\n!beg`, inline: true },
                    { name: `Fun Commands`, value: `!randopic\n!randocat\n!randodog\n!flip\n!pokemon\n!poll`, inline: true },
                    { name: `Game Commands`, value: `!roll\n!8ball\n!rps\n!!madlibs`, inline: true },
                    { name: `Miscellaneous Commands`, value: `!ping`, inline: true },
                    { name: `Music Commands`, value: `!play\n!pause\n!resume\n!search\n!rewind\n!ff\n!skip\n!skip#\n!add\n!queue\n!playtime\n!list`, inline: true }
                ) 
                .setTimestamp()
                .setFooter({ text: `Requested by: ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() });
            await interaction.reply({ embeds: [embedhelp] });
        }
    }
});

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
        .setTitle('Commands Menu')
        .setAuthor({ name: `${author.tag}` })
        .setThumbnail(author.avatarURL())
        .setDescription('All my commands are listed here.')
        .setImage(author.avatarURL())
        .addFields(
            { name: `About me`, value: `I am a bot that is useful for many things. I do Administration, Moderation, Economy, Fun and Gaming commands. I am a work in progress currently under one creator: RiptidesTacos` },
            { name: `Administration Commands`, value: `!addrole\n!createrole\n!deleterole\n!roles\n!addchannel\n!deletechannel\n!changeperms\n!userroles\n!modroles\n!adminroles`, inline: true},
            { name: `Moderation Commands`, value: `!mod\n!kick\n!mute\n!tempmute\n!unmute\n!ban\n!unban\n!jail\n!unjail\n!deafen\n!undeafen\n!members\n!note\n!notes\n!lock\n!unlock\n!warn\n!warnings\n!addrole\n!request `, inline: true},    
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

           ////////////////____________\\\\\\\\\\\\\\\\\
          ////////////////ADMIN COMMANDS\\\\\\\\\\\\\\\\\
         ////////////////----------------\\\\\\\\\\\\\\\\\\
        //-----------------------------------------------\\
        if(command === `addrole`) {
            if(!member.permissions.has(PermissionsBitField.Flags.ManageRoles)){
                var errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({name: author.tag, iconURL: author.avatarURL()})
            .setTitle('Permission Error')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('You lack the correct permissions to use this command.')
            .addFields(
                { name: `Missing permissions`, value: `My records indicate that you are missing one or more permissions to use this command.
                    \nPermission missing: **MANAGE_ROLES**}`},
                { name: `Resolving the issue`, value: `To fix this error please message a guild admin to give you the proper permissions for this command.
                    \nIf you cannot get in contact with an Administrator then you may use my request feature to message an administrator to add the requested permissions for you.`}
            );
                message.reply({embeds: [errorEmbed]})
                    // Create a button
                    const requestButton = new ButtonBuilder()
                    .setCustomId('requestPermission')
                    .setLabel('Request Permission')
                    .setStyle(ButtonStyle.Primary);

                    const row = new ActionRowBuilder().addComponents(requestButton);

                    // Send the reply with the embed and the button
                  return await message.reply({ embeds: [errorEmbed], components: [row] });
                                }
        }
        
        if(command === `createrole`) {
            //Add the errorEmbed if missing ManageRole permission
            if (!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
                            //Permissions Error EmbedBuilder
            var errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({name: author.tag, iconURL: author.avatarURL()})
            .setTitle('Permission Error')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('You lack the correct permissions to use this command.')
            .addFields(
                { name: `Missing permissions`, value: `My records indicate that you are missing one or more permissions to use this command.
                    \nPermission missing: **MANAGE_ROLES**}`},
                { name: `Resolving the issue`, value: `To fix this error please message a guild admin to give you the proper permissions for this command.
                    \nIf you cannot get in contact with an Administrator then you may use my request feature to message an administrator to add the requested permissions for you.`}
            );
                message.reply({embeds: [errorEmbed]})
                    // Create a button
                    var requestButton = new ButtonBuilder()
                    .setCustomId('requestPermission')
                    .setLabel('Request Permission')
                    .setStyle(ButtonStyle.Primary);

                    var row = new ActionRowBuilder().addComponents(requestButton);

                    // Send the reply with the embed and the button
                  return await message.reply({ embeds: [errorEmbed], components: [row] });
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

if (command === `editrole`) {
    if (!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
        // Permissions Error EmbedBuilder
        const errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('Permission Error')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('You lack the correct permissions to use this command.')
            .addFields(
                { name: `Missing permissions`, value: `My records indicate that you are missing one or more permissions to use this command.\nPermission missing: **MANAGE_ROLES**` },
                { name: `Resolving the issue`, value: `To fix this error please message a guild admin to give you the proper permissions for this command.\nIf you cannot get in contact with an Administrator then you may use my request feature to message an administrator to add the requested permissions for you.` }
            )
            .setTimestamp();

        // Create a button
        const requestButton = new ButtonBuilder()
            .setCustomId('requestPermission')
            .setLabel('Request Permission')
            .setStyle(ButtonStyle.Primary);

        const row = new ActionRowBuilder().addComponents(requestButton);

        // Send the reply with the embed and the button
        return await message.reply({ embeds: [errorEmbed], components: [row] });
    }

    // Extract the role name and user mention
    const args = message.content.split(' ').slice(1);
    const userMention = message.mentions.users.first();
    const username = args[0];

    let user;
    if (userMention) {
        user = message.guild.members.cache.get(userMention.id); // Get the GuildMember object
    } else if (username) {
        user = message.guild.members.cache.find(member => member.user.username.toLowerCase() === username.toLowerCase());
    }

    // User validation
    if (!user) {
        const usernameErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0100***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed')
            .addFields(
                { name: `Usage`, value: `!editrole <@username|username> <@role|roleName>` },
                { name: `Argument missing:`, value: `*<@username|username>*` }
            );
        return message.reply({ embeds: [usernameErrorEmbed] });
    }

    // Check if the member has a higher role
    if (member.roles.highest.position <= user.roles.highest.position) {
        const highestRoleErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0102***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed')
            .addFields(
                { name: `Reason:`, value: `The <@role|roleName> you have chosen is of a higher role than you.` },
                { name: `Usage`, value: `I cannot verify a usage for this error.` }
            )
        return message.reply({ embeds: [highestRoleErrorEmbed] });
    }

    // Get role mention and role name
    let roleMention = message.mentions.roles.first(); // Get role mention
    let roleName = args.slice(1).join(' '); // Assuming role name follows the username
    let role;

    if (roleMention) {
        role = roleMention; // Use the mentioned role
    } else if (roleName) {
        role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase()); // Find role by name
    }

    // Role validation
    if (!role) {
        const roleErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0101***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed. See below for missing argument and correct usage.')
            .addFields(
                { name: `Usage`, value: `!editrole <@username|username> <@role|roleName>` },
                { name: `Argument Missing:`, value: `<@role|roleName>` }
            );
        return message.reply({ embeds: [roleErrorEmbed] });
    }

    // Check if the role is mentionable
    if (!role.mentionable) {
        // If role is not mentionable, check for a typed-out role
        if (!roleName|| roleName.trim() === '') {
            const mentionErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0103***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed.')
            .addFields(
                { name: `Reason:`, value: `This role cannot be mentioned, please follow the usage below.`},
                { name: `Usage`, value: `!editrole <@username|username> <roleName>`}
            )
        return message.reply({ embeds: [mentionErrorEmbed] });
        } 
    }

    // Check if the user can manage the role
    if (role.position >= member.roles.highest.position) {
        const permissionErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0104')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed.')
            .addFields(
                {
                    name:  `Reason:`,
                    value: `Your role is lower than the role you selected or you do not have the correct permissions to manage this command.`
                }
            )
        return message.reply({ embeds: [permissionErrorEmbed] });
    }

    // Check if the role is higher than the bot's role
    if (role.position >= message.guild.members.me.roles.highest.position) {
        const botPermissionErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error code: xE0105')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('I cannot manage this role because it is higher than my highest role.')
            .addFields(`About Error Code`)
        return message.reply({ embeds: [botPermissionErrorEmbed] });
    }

    // Perform the role removal and addition
    const oldRole = user.roles.highest; // Get the highest role of the user
    let roleRemoved = false;

    try {
        await user.roles.remove(oldRole); // Attempt to remove the old role
        roleRemoved = true; // If successful, mark it as removed
    } catch (error) {
        if (error.code === 50013) {
            console.error('Failed to remove role due to missing permissions:', error);
            // Optionally log the error or notify the user if needed
        } else {
            console.error('Failed to remove role:', error);
        }
    }
    
    // Now attempt to add the new role regardless of the old role removal outcome
    try {
        await user.roles.add(role); // Add the new role
        const successEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Role Updated Successfully***')
            .setThumbnail('https://i.ibb.co/vsQZtTt/Untitled-design-3.png')
            .setDescription(`Added role: **${role.name}**`);
    
        // If the old role was not removed, adjust the message
        if (!roleRemoved) {
            successEmbed.setDescription(`Added role: **${role.name}**\n*(Role: **${oldRole.name}** could not be removed)*`);
        }
    
        return message.reply({ embeds: [successEmbed] });
    } catch (error) {
        console.error('Failed to add role:', error);
        const errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error: ROLE UPDATE FAILED***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('An error occurred while updating roles. Please try again later.');
        return message.reply({ embeds: [errorEmbed] });
    }
}

    if(command === "deleterole"){
        if (!member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
            //Permissions Error EmbedBuilder
var errorEmbed = new EmbedBuilder()
.setColor(Colors.Red)
.setAuthor({name: author.tag, iconURL: author.avatarURL()})
.setTitle('Permission Error')
.setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
.setDescription('You lack the correct permissions to use this command.')
.addFields(
{ name: `Missing permissions`, value: `My records indicate that you are missing one or more permissions to use this command.
    \nPermission missing: **MANAGE_ROLES**}`},
{ name: `Resolving the issue`, value: `To fix this error please message a guild admin to give you the proper permissions for this command.
    \nIf you cannot get in contact with an Administrator then you may use my request feature to message an administrator to add the requested permissions for you.`}
);
message.reply({embeds: [errorEmbed]})
    // Create a button
    var requestButton = new ButtonBuilder()
    .setCustomId('requestPermission')
    .setLabel('Request Permission')
    .setStyle(ButtonStyle.Primary);

    var row = new ActionRowBuilder().addComponents(requestButton);

    // Send the reply with the embed and the button
  return await message.reply({ embeds: [errorEmbed], components: [row] });
                }

                const args = message.content.split(' ').slice(1);
    const userMention = message.mentions.users.first();
    const username = args[0];

    let user;
    if (userMention) {
        user = message.guild.members.cache.get(userMention.id); // Get the GuildMember object
    } else if (username) {
        user = message.guild.members.cache.find(member => member.user.username.toLowerCase() === username.toLowerCase());
    }

    // User validation
    if (!user) {
        const usernameErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0200***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed')
            .addFields(
                { name: `Usage`, value: `!editrole <@username|username> <@role|roleName>` },
                { name: `Argument missing:`, value: `*<@username|username>*` }
            );
        return message.reply({ embeds: [usernameErrorEmbed] });
    }

    // Check if the member has a higher role
    if (member.roles.highest.position <= user.roles.highest.position) {
        const highestRoleErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0202***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed')
            .addFields(
                { name: `Reason:`, value: `The <@role|roleName> you have chosen is of a higher role than you.` },
                { name: `Usage`, value: `I cannot verify a usage for this error.` }
            )
        return message.reply({ embeds: [highestRoleErrorEmbed] });
    }

    // Get role mention and role name
    let roleMention = message.mentions.roles.first(); // Get role mention
    let roleName = args.join(' '); // Assuming role name follows the username
    let role;

    if (roleMention) {
        role = roleMention; // Use the mentioned role
    } else if (roleName) {
        role = message.guild.roles.cache.find(r => r.name.toLowerCase() === roleName.toLowerCase()); // Find role by name
    }

    // Role validation
    if (!role) {
        const roleErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0201***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed. See below for missing argument and correct usage.')
            .addFields(
                { name: `Usage`, value: `!editrole <@username|username> <@role|roleName>` },
                { name: `Argument Missing:`, value: `<@role|roleName>` }
            );
        return message.reply({ embeds: [roleErrorEmbed] });
    }

    // Check if the role is mentionable
    if (!role.mentionable) {
        // If role is not mentionable, check for a typed-out role
        if (!roleName|| roleName.trim() === '') {
            const mentionErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0203***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed.')
            .addFields(
                { name: `Reason:`, value: `This role cannot be mentioned, please follow the usage below.`},
                { name: `Usage`, value: `!editrole <@username|username> <roleName>`}
            )
        return message.reply({ embeds: [mentionErrorEmbed] });
        } 
    }

    // Check if the user can manage the role
    if (role.position >= member.roles.highest.position) {
        const permissionErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error Code: xE0204')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('Command could not be executed.')
            .addFields(
                {
                    name:  `Reason:`,
                    value: `Your role is lower than the role you selected or you do not have the correct permissions to manage this command.`
                }
            )
        return message.reply({ embeds: [permissionErrorEmbed] });
    }

    // Check if the role is higher than the bot's role
    if (role.position >= message.guild.members.me.roles.highest.position) {
        const botPermissionErrorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error code: xE0205')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('I cannot manage this role because it is higher than my highest role.')
            
        return message.reply({ embeds: [botPermissionErrorEmbed] });
    }

    if(!user.roles.cache.has(role.id)) {
        const noRoleEmbed = new EmbedBuilder()
        .setColor(Colors.Red)
        .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
        .setTitle('Error code: xE0206')
        .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
        .setDescription('This user does not have the role specified.')
    return message.reply({ embeds: [noRoleEmbed] });
    }
    
    try {
        await user.roles.remove(role); // remove the new role
        const successEmbed = new EmbedBuilder()
            .setColor(Colors.Green)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Role Removed Successfully***')
            .setThumbnail('https://i.ibb.co/vsQZtTt/Untitled-design-3.png')
            .setDescription(`Removed role: **${role.name}**`);
        
        return message.reply({ embeds: [successEmbed] });
    } catch (error) {
        console.error('Failed to remove role:', error);
        const errorEmbed = new EmbedBuilder()
            .setColor(Colors.Red)
            .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
            .setTitle('***Error: ROLE REMOVE FAILED***')
            .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
            .setDescription('An error occurred while updating roles. Please try again later.');
        return message.reply({ embeds: [errorEmbed] });
    }
} 

                if(command === 'test') {
                    const errorEmbed = new EmbedBuilder()
                    .setColor(Colors.Red)
                    .setAuthor({ name: author.tag, iconURL: author.avatarURL() })
                    .setTitle('Permission Error')
                    .setThumbnail('https://i.ibb.co/n1K8cyX/Untitled-design-2.png')
                    .setDescription('You lack the correct permissions to use this command.')
                    .addFields(
                        { name: `Missing permissions`, value: `My records indicate that you are missing one or more permissions to use this command.\nPermission missing: **MANAGE_ROLES**` },
                        { name: `Resolving the issue`, value: `To fix this error please message a guild admin to give you the proper permissions for this command.\nIf you cannot get in contact with an Administrator then you may use my request feature to message an administrator to add the requested permissions for you.` }
                    );
        
                // Create a button
                const requestButton = new ButtonBuilder()
                    .setCustomId('requestPermission')
                    .setLabel('Request Permission')
                    .setStyle(ButtonStyle.Primary);
        
                const row = new ActionRowBuilder().addComponents(requestButton);
        
                // Send the reply with the embed and the button
                return await message.reply({ embeds: [errorEmbed], components: [row] });
                }                                
        })

bot.login(TOKEN)

