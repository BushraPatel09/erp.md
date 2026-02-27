const bcrypt = require('bcryptjs');
const { User } = require('../models');
const { signToken } = require('../utils/token');

async function register(req, res) {
  const { name, email, password, role = 'operator' } = req.body;
  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash, role });
  return res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }
  return res.json({ token: signToken(user) });
}

module.exports = { register, login };
