import jwt from 'jsonwebtoken';

export const login = (req, res) => {
  const { password } = req.body;
  const adminPassword = process.env.ADMIN_PASSWORD || '1234';

  if (password === adminPassword) {
    const secret = process.env.JWT_SECRET || 'desi-journey-secret-key-change-me';
    const token = jwt.sign({ admin: true }, secret, { expiresIn: '30d' });
    res.json({ token, success: true });
  } else {
    res.status(401).json({ error: 'Invalid password', message: 'Incorrect admin password.' });
  }
};
