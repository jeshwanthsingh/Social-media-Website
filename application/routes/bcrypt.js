const bcrypt = require('bcrypt');

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

const password = 'mypassword';
const hashedPassword = bcrypt.hashSync(password, salt);

console.log(hashedPassword);
