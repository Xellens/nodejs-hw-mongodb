import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../schemas/auth-schemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerController } from '../controllers/auth.js';
import { loginController } from '../controllers/auth.js';
import { loginSchema } from '../schemas/auth-schemas.js';
import { refreshController } from '../controllers/auth.js';
import { logoutController } from '../controllers/auth.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

authRouter.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginController),
);

authRouter.post('/refresh', ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));
