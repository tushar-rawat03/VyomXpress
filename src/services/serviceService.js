const { Service, User } = require('../models');

const createService = async (data, userId) => {
  const service = await Service.create({ ...data, createdBy: userId });
  return service;
};

const getAllServices = async ({ page = 1, limit = 10, category }) => {
  const offset = (page - 1) * limit;
  const where = { isActive: true };
  if (category) where.category = category;

  const { count, rows } = await Service.findAndCountAll({
    where,
    include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });
  return { services: rows, total: count, page: parseInt(page), limit: parseInt(limit) };
};

const getServiceById = async (id) => {
  const service = await Service.findByPk(id, {
    include: [{ model: User, as: 'creator', attributes: ['id', 'username'] }],
  });
  if (!service) {
    const error = new Error('Service not found');
    error.statusCode = 404;
    throw error;
  }
  return service;
};

const updateService = async (id, data, userId) => {
  const service = await Service.findByPk(id);
  if (!service) {
    const error = new Error('Service not found');
    error.statusCode = 404;
    throw error;
  }
  if (service.createdBy !== userId) {
    const error = new Error('You can only update your own services');
    error.statusCode = 403;
    throw error;
  }
  await service.update(data);
  return service;
};

const deleteService = async (id, userId) => {
  const service = await Service.findByPk(id);
  if (!service) {
    const error = new Error('Service not found');
    error.statusCode = 404;
    throw error;
  }
  if (service.createdBy !== userId) {
    const error = new Error('You can only delete your own services');
    error.statusCode = 403;
    throw error;
  }
  await service.destroy();
};

module.exports = { createService, getAllServices, getServiceById, updateService, deleteService };
