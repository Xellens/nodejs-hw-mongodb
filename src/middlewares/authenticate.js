import createError from 'http-errors';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  const { authorization = '' } = req.headers;
  const [bearer, token] = authorization.split(' ');

  if (bearer !== 'Bearer' || !token) {
    return next(createError(401, 'No access token provided'));
  }

  const session = await Session.findOne({ accessToken: token });
  if (!session) {
    return next(createError(401, 'Invalid access token'));
  }

  if (session.accessTokenValidUntil < new Date()) {
    return next(createError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return next(createError(401, 'User not found'));
  }

  req.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  next();
};
