const { SlashCommandBuilder } = require('discord.js');
const { User, Service } = require('../../models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ppgetuser')
    .setDescription('Fetch a user from the VyomXpress system')
    .addStringOption((opt) =>
      opt
        .setName('lookup')
        .setDescription('Search by ID or username')
        .setRequired(false)
    )
    .addIntegerOption((opt) =>
      opt.setName('id').setDescription('User ID').setRequired(false)
    )
    .addStringOption((opt) =>
      opt.setName('username').setDescription('Username').setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const id = interaction.options.getInteger('id');
    const username = interaction.options.getString('username');

    if (!id && !username) {
      return interaction.editReply('❌ Please provide either an **id** or **username** to search.');
    }

    try {
      let user;

      if (id) {
        user = await User.findByPk(id, {
          attributes: { exclude: ['password'] },
          include: [{ model: Service, as: 'services' }],
        });
      } else {
        user = await User.findOne({
          where: { username },
          attributes: { exclude: ['password'] },
          include: [{ model: Service, as: 'services' }],
        });
      }

      if (!user) {
        return interaction.editReply(`❌ No user found with ${id ? `ID **${id}**` : `username **${username}**`}.`);
      }

      const servicesList =
        user.services && user.services.length > 0
          ? user.services.map((s) => `• ${s.name} (₹${Number(s.price).toFixed(2)})`).join('\n')
          : 'No services yet';

      await interaction.editReply(
        `👤 **User Found**\n` +
        `**ID:** ${user.id}\n` +
        `**Username:** ${user.username}\n` +
        `**Email:** ${user.email}\n` +
        `**Role:** ${user.role}\n` +
        `**Status:** ${user.isActive ? '✅ Active' : '❌ Inactive'}\n` +
        `**Joined:** ${new Date(user.createdAt).toDateString()}\n\n` +
        `**Services (${user.services ? user.services.length : 0}):**\n${servicesList}`
      );
    } catch (error) {
      await interaction.editReply(`❌ Error fetching user: ${error.message}`);
    }
  },
};
