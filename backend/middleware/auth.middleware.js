import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'desi-journey-secret-key-change-me';

  try {
    const decoded = jwt.verify(token, secret);
    if (decoded.admin) {
      req.admin = true;
      next();
    } else {
      res.status(401).json({ error: 'Unauthorized' });
    }
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
