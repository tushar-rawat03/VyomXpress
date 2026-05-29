const authService = require('../services/authService');
const { sendSuccess, sendError } = require('../utils/response');

const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    const result = await authService.signup({ username, email, password });
    return sendSuccess(res, result, 'Account created successfully', 201);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const result = await authService.login({ username, password });
    return sendSuccess(res, result, 'Logged in successfully');
  } catch (error) {
    next(error);
  }
};

const me = async (req, res) => {
  return sendSuccess(res, { user: req.user.toSafeObject() }, 'Profile fetched');
};

module.exports = { signup, login, me };
