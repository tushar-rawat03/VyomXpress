const { User, Service } = require('../models');

const getAllUsers = async ({ page = 1, limit = 10 }) => {
  const offset = (page - 1) * limit;
  const { count, rows } = await User.findAndCountAll({
    attributes: { exclude: ['password'] },
    limit: parseInt(limit),
    offset,
    order: [['createdAt', 'DESC']],
  });
  return { users: rows, total: count, page: parseInt(page), limit: parseInt(limit) };
};

const getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: { exclude: ['password'] },
    include: [{ model: Service, as: 'services' }],
  });
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

const updateUser = async (id, data, requesterId) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  if (user.id !== requesterId) {
    const error = new Error('You can only update your own profile');
    error.statusCode = 403;
    throw error;
  }

  const allowedFields = ['email'];
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) user[field] = data[field];
  });

  await user.save();
  return user.toSafeObject();
};

const deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  await user.destroy();
};

module.exports = { getAllUsers, getUserById, updateUser, deleteUser };
