import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { registerSchema } from '../schemas/auth-schemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerController } from '../controllers/auth.js';
import { loginController } from '../controllers/auth.js';
import { loginSchema } from '../schemas/auth-schemas.js';
import { refreshController } from '../controllers/auth.js';
import { logoutController } from '../controllers/auth.js';
import { sendResetEmailController } from '../controllers/auth.js';
import { resetEmailSchema } from '../schemas/auth-schemas.js';
import { resetPasswordController } from '../controllers/auth.js';
import { resetPwdSchema } from '../schemas/auth-schemas.js';

export const authRouter = Router();

authRouter.post(
  '/reset-pwd',
  validateBody(resetPwdSchema),
  ctrlWrapper(resetPasswordController),
);

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

authRouter.post(
  '/send-reset-email',
  validateBody(resetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);
