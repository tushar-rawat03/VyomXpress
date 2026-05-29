require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, '../src/discord/commands');
const commandFiles = fs.readdirSync(commandsPath).filter((f) => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  if ('data' in command) {
    commands.push(command.data.toJSON());
    console.log(`✔ Loaded command: ${command.data.name}`);
  }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log(`\nRegistering ${commands.length} slash command(s) to Discord...`);

    const data = await rest.put(
      Routes.applicationGuildCommands(
        process.env.DISCORD_CLIENT_ID,
        process.env.DISCORD_GUILD_ID
      ),
      { body: commands }
    );

    console.log(`✅ Successfully registered ${data.length} command(s).\n`);
    console.log('Commands registered:');
    data.forEach((cmd) => console.log(`  • /${cmd.name}`));
  } catch (error) {
    console.error('❌ Failed to register commands:', error);
    process.exit(1);
  }
})();
