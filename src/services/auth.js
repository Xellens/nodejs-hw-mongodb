import { Session } from '../models/Session.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { User } from '../models/User.js';

export const findUserByEmail = async (email) => {
  return User.findOne({ email });
};

export const registerUser = async ({ name, email, password }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  return newUser;
};

export const findUserByEmailAndPassword = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) return null;
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;
  return user;
};

export const loginUser = async (userId) => {
  await Session.deleteMany({ userId });

  const accessToken = randomBytes(32).toString('hex');
  const refreshToken = randomBytes(32).toString('hex');

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.create({
    userId,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  };
};

export const refreshSession = async (oldRefreshToken) => {
  const session = await Session.findOne({ refreshToken: oldRefreshToken });
  if (!session) {
    throw createError(401, 'Refresh token invalid');
  }

  if (session.refreshTokenValidUntil < new Date()) {
    throw createError(401, 'Refresh token expired');
  }

  await Session.deleteOne({ _id: session._id });

  const userId = session.userId;
  const accessToken = randomBytes(32).toString('hex');
  const newRefreshToken = randomBytes(32).toString('hex');

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.create({
    userId,
    accessToken,
    refreshToken: newRefreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  const session = await Session.findOne({ refreshToken });
  if (!session) {
    throw createError(401, 'No session found');
  }

  await Session.deleteOne({ _id: session._id });
};

export const updateUserPassword = async (userId, newPassword) => {
  const hashed = await bcrypt.hash(newPassword, 10);
  await User.findByIdAndUpdate(userId, { password: hashed });
};

export const removeUserSession = async (userId) => {
  await Session.deleteMany({ userId });
};
