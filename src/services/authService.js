const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const signup = async ({ username, email, password }) => {
  const existingUser = await User.findOne({ where: { username } });
  if (existingUser) {
    const error = new Error('Username already taken');
    error.statusCode = 409;
    throw error;
  }

  const existingEmail = await User.findOne({ where: { email } });
  if (existingEmail) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ username, email, password });
  const token = generateToken(user);
  return { user: user.toSafeObject(), token };
};

const login = async ({ username, password }) => {
  const user = await User.findOne({ where: { username, isActive: true } });
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user);
  return { user: user.toSafeObject(), token };
};

module.exports = { signup, login };
