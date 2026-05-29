const { SlashCommandBuilder } = require('discord.js');
const { Service, User } = require('../../models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ppcreateservice')
    .setDescription('Create a new service in the VyomXpress system')
    .addStringOption((opt) =>
      opt.setName('name').setDescription('Service name').setRequired(true)
    )
    .addNumberOption((opt) =>
      opt.setName('price').setDescription('Price of the service').setRequired(true)
    )
    .addStringOption((opt) =>
      opt.setName('description').setDescription('Service description').setRequired(false)
    )
    .addStringOption((opt) =>
      opt.setName('category').setDescription('Service category').setRequired(false)
    )
    .addIntegerOption((opt) =>
      opt.setName('created_by').setDescription('User ID of the creator (optional)').setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const name = interaction.options.getString('name');
    const price = interaction.options.getNumber('price');
    const description = interaction.options.getString('description') || null;
    const category = interaction.options.getString('category') || null;
    const createdById = interaction.options.getInteger('created_by') || null;

    if (name.length < 2 || name.length > 100) {
      return interaction.editReply('❌ Service name must be 2–100 characters.');
    }

    if (price < 0) {
      return interaction.editReply('❌ Price cannot be negative.');
    }

    try {
      // Validate creator exists if provided
      if (createdById) {
        const creator = await User.findByPk(createdById);
        if (!creator) {
          return interaction.editReply(`❌ User with ID **${createdById}** not found.`);
        }
      }

      const existing = await Service.findOne({ where: { name } });
      if (existing) {
        return interaction.editReply(`❌ A service named **${name}** already exists.`);
      }

      const service = await Service.create({ name, price, description, category, createdBy: createdById });

      await interaction.editReply(
        `✅ Service created successfully!\n` +
        `**ID:** ${service.id}\n` +
        `**Name:** ${service.name}\n` +
        `**Price:** ₹${Number(service.price).toFixed(2)}\n` +
        `**Category:** ${service.category || 'N/A'}\n` +
        `**Description:** ${service.description || 'N/A'}`
      );
    } catch (error) {
      await interaction.editReply(`❌ Failed to create service: ${error.message}`);
    }
  },
};
