import createError from 'http-errors';
import jwt from 'jsonwebtoken';

import {
  findUserByEmail,
  findUserByEmailAndPassword,
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
  updateUserPassword,
  removeUserSession,
} from '../services/auth.js';

import { sendResetEmail } from '../services/email.js';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const newUser = await registerUser({ name, email, password });

  return res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    },
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await findUserByEmailAndPassword(email, password);
  if (!user) {
    throw createError(401, 'Invalid credentials');
  }

  const {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  } = await loginUser(user._id);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken,
    },
  });
};

export const refreshController = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw createError(401, 'No refresh token provided');
  }

  const { accessToken, newRefreshToken } = await refreshSession(refreshToken);

  res.cookie('refreshToken', newRefreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    throw createError(401, 'No refresh token');
  }

  await logoutUser(refreshToken);
  res.clearCookie('refreshToken');
  res.status(204).send();
};

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;

  const user = await findUserByEmail(email);
  if (!user) {
    throw createError(404, 'User not found!');
  }

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });

  const resetUrl = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  const sent = await sendResetEmail(email, resetUrl);
  if (!sent) {
    throw createError(500, 'Failed to send the email, please try again later.');
  }

  return res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw createError(401, 'Token is expired or invalid.');
  }

  const user = await findUserByEmail(payload.email);
  if (!user) {
    throw createError(404, 'User not found!');
  }

  await updateUserPassword(user._id, password);

  await removeUserSession(user._id);

  res.json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
