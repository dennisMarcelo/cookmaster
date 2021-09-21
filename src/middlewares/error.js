module.exports = (err, _req, res, _next) => {
  if (err.statusCode) {
    const { message, statusCode } = err;
    return res.status(statusCode).json({ message });
  }
  
  return res.status(500).json({ message: err.message });
};