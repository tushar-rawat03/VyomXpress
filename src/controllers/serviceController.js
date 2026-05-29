const serviceService = require('../services/serviceService');
const { sendSuccess } = require('../utils/response');

const createService = async (req, res, next) => {
  try {
    const service = await serviceService.createService(req.body, req.user.id);
    return sendSuccess(res, { service }, 'Service created', 201);
  } catch (error) {
    next(error);
  }
};

const getAllServices = async (req, res, next) => {
  try {
    const result = await serviceService.getAllServices(req.query);
    return sendSuccess(res, result, 'Services fetched');
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (req, res, next) => {
  try {
    const service = await serviceService.getServiceById(req.params.id);
    return sendSuccess(res, { service }, 'Service fetched');
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const service = await serviceService.updateService(req.params.id, req.body, req.user.id);
    return sendSuccess(res, { service }, 'Service updated');
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    await serviceService.deleteService(req.params.id, req.user.id);
    return sendSuccess(res, {}, 'Service deleted');
  } catch (error) {
    next(error);
  }
};

module.exports = { createService, getAllServices, getServiceById, updateService, deleteService };
