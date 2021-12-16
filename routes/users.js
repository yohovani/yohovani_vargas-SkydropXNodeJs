var express = require('express');
var router = express.Router();

const { Pool, Client } = require('pg')
const pool = new Pool({
  user: 'cliente',
  host: 'localhost',
  database: 'nodeskx',
  password: 'DragonBall',
  port: 5432,
})


/* GET users listing. */
router.get('/:id', function(req, res, next) {
  console.log(req.params.id);
  pool.query('SELECT * FROM users u WHERE id IN ('+req.params.id+')', (err, resql) => {
    res.json({"data":[resql.rows]});
    console.log(err, resql.rows)
    pool.end()
  })
});

/* POST user Create */
router.post('/add/', function(req, res, next){
  res.json({"message":"ok"})
});

/* PUT user Modify */
router.put('/modify/:id', function(req, res, next){
  res.json({"message":"ok"})
});

/* DELETE User Delete */
router.delete('/delete/:id', function(req, res, next){
  res.json({"message":"ok"})
});


module.exports = router;
