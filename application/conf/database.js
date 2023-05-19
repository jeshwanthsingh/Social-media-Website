var mysql = require('mysq12');
const pool = mysql.createPool({
host: process.env.DB_HOST,
user: process.env.DB_USER,
database: process.env.DB_NAME,
password: process.env.DB_PASSWORD,
waitForConnections: true,
connectionLimit: 10,
maxIdle: 10, 
idleTimeout: 60000,
ueueLimit: 0
});
module.exports = pool;