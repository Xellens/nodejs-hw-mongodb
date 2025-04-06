import createError from 'http-errors';
import { registerUser, findUserByEmail } from '../services/auth.js';
import { loginUser, findUserByEmailAndPassword } from '../services/auth.js';
import { refreshSession } from '../services/auth.js';
import { logoutUser } from '../services/auth.js';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const newUser = await registerUser({ name, email, password });

  res.status(201).json({
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
