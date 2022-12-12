import mysql from 'mysql';
import config from './config.json';

const database = mysql.createPool({
  host: config.database.hostname,
  user: config.database.username,
  password: config.database.password,
  database: config.database.database,
  port: config.database.port
});

database.on("error", (err) => console.error("[DATABASE] ERROR: " + err));

export default database;