const dotenv = require('dotenv');
const { REST, Routes } = require('discord.js');

dotenv.config();

const commands = [
    {
        name: 'commands',
        description: 'Lists all of my commands!',
    },
];

const rest = new REST({version: '10'}).setToken(process.env.DISCORD_CLIENT_TOKEN);

(async () => {
    try {
        console.log('Registering Slash Commands...')
await rest.put(
    Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID, 
        process.env.DISCORD_GUILD_ID
    ),
    { body: commands}
)
console.log('Slash Commands registered succesfully')
    } catch (error) {
        console.log(`There was an error: ${error}`)
    }
})();