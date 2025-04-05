import createError from 'http-errors';

export const validateBody = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const allMessages = error.details.map((detail) => detail.message);
      return next(createError(400, allMessages.join('. ')));
    }
    next();
  };
};
