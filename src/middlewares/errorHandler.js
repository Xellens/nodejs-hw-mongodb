export const errorHandler = (err, req, res, next) => {
  console.error('Error middleware:', err);

  const status = err.status || 500;

  res.status(status).json({
    status: 500,
    message: 'Something went wrong',
    data: err.data || err.message,
  });
};
