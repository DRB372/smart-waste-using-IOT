const bcrypt = require('bcrypt');

const SALT_ROUNDS = 12;

module.exports.getHash = async candidate => {
  return bcrypt.hash(candidate, SALT_ROUNDS);
};

module.exports.comparePassword = async (candidate, original) => {
  return bcrypt.compare(candidate, original);
};
