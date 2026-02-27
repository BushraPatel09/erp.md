const jwt = require('jsonwebtoken');
const env = require('../config/env');

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email, role: user.role }, env.jwtSecret, {
    issuer: env.jwtIssuer,
    expiresIn: '8h'
  });
}

module.exports = { signToken };
