var express = require('express');
var router = express.Router();

const { Pool, Client } = require('pg')
const pool = new Pool({
  user: '',
  host: 'localhost',
  database: 'nodeskx',
  password: '',
  port: 5432,
})


/* GET users listing. */
router.get('/', function(req, res, next) {
  pool.query('SELECT * FROM users u ', (err, resql) => {
    res.send(resql.rows);
    console.log(err, resql.rows)
    pool.end()
  })
  
});

module.exports = router;
