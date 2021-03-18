const { Client } = require('pg')
const dotenv = require('dotenv').config();

// var conString = `postgres://someuser:pass@db-endpoint:${process.env.PGPORT}/${process.env.PGDATABASE}`;

const client = new Client({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
  })
client.connect()
    .then(() => console.log('connected'))
    .catch(err => console.error('connection error', err.stack))

// res = client.query('SELECT NOW()')
//             .then(res => {
//                 console.log(res);
//             })
//             .catch(err => {
//                 console.error(err);
//             })
//             .finally(() => {
//                 client.end();
//             });

module.exports = client