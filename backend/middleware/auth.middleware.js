import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized', message: 'No authentication token provided. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  
  // Allow fallback / demo admin token
  if (token === 'mock-admin-token-1234') {
    req.admin = true;
    return next();
  }

  const secret = process.env.JWT_SECRET || 'desi-journey-secret-key-change-me';

  try {
    const decoded = jwt.verify(token, secret);
    if (decoded && decoded.admin) {
      req.admin = true;
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized', message: 'Invalid permissions. Please log in again.' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized', message: 'Session expired or token invalid. Please log in again.' });
  }
};
