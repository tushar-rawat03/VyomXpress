const { Client, GatewayIntentBits, Collection } = require("discord.js");
const fs = require("fs");
const path = require("path");
const logger = require("../utils/logger");

let client;

const startBot = async () => {
  const token = process.env.DISCORD_TOKEN;

  if (!token || token === "DUMMY_DISCORD_TOKEN") {
    logger.warn(
      "Discord bot skipped — set a real DISCORD_TOKEN in .env to enable it.",
    );
    return;
  }

  client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.commands = new Collection();

  // Load commands
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((f) => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
      logger.info(`Loaded Discord command: ${command.data.name}`);
    }
  }

  // Interaction handler
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(
        `Discord command error [${interaction.commandName}]:`,
        error,
      );
      const msg = {
        content: "❌ An error occurred while executing this command.",
        ephemeral: true,
      };
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(msg);
      } else {
        await interaction.reply(msg);
      }
    }
  });

  client.once("ready", () => {
    logger.info(`Discord bot logged in as ${client.user.tag}`);
  });

  try {
    await client.login(token);
  } catch (err) {
    logger.warn(
      `Discord bot disabled: ${err.message}. API is still running normally.`,
    );
  }
};

module.exports = { startBot };
