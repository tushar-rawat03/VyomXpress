const sequelize = require('../config/database');
const User = require('./User');
const Service = require('./Service');

// Associations
User.hasMany(Service, { foreignKey: 'createdBy', as: 'services' });
Service.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });

module.exports = { sequelize, User, Service };
