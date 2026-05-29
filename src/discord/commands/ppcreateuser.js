const { SlashCommandBuilder } = require('discord.js');
const { User } = require('../../models');
const bcrypt = require('bcryptjs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ppcreateuser')
    .setDescription('Create a new user in the VyomXpress system')
    .addStringOption((opt) =>
      opt.setName('username').setDescription('The username for the new user').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('email').setDescription('Email address for the new user').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('password').setDescription('Password for the new user (min 6 chars)').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('role').setDescription('User role').setRequired(false).addChoices(
        { name: 'User', value: 'user' },
        { name: 'Admin', value: 'admin' }
      )
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const username = interaction.options.getString('username');
    const email = interaction.options.getString('email');
    const password = interaction.options.getString('password');
    const role = interaction.options.getString('role') || 'user';

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return interaction.editReply('❌ Invalid email format.');
    }

    if (password.length < 6) {
      return interaction.editReply('❌ Password must be at least 6 characters.');
    }

    if (username.length < 3 || username.length > 50) {
      return interaction.editReply('❌ Username must be 3–50 characters.');
    }

    try {
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername) {
        return interaction.editReply(`❌ Username **${username}** is already taken.`);
      }

      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail) {
        return interaction.editReply(`❌ Email **${email}** is already registered.`);
      }

      const user = await User.create({ username, email, password, role });

      await interaction.editReply(
        `✅ User created successfully!\n` +
        `**ID:** ${user.id}\n` +
        `**Username:** ${user.username}\n` +
        `**Email:** ${user.email}\n` +
        `**Role:** ${user.role}`
      );
    } catch (error) {
      await interaction.editReply(`❌ Failed to create user: ${error.message}`);
    }
  },
};
