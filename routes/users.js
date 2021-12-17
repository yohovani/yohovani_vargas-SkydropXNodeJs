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

const client = new Client({
  user: 'cliente',
  host: 'localhost',
  database: 'nodeskx',
  password: 'DragonBall',
  port: 5432,
})
client.connect()


/* GET users listing. */
router.get('/:id', function(req, res, next) {
  pool.query('SELECT * FROM users u WHERE id IN ('+req.params.id+')', (err, resql) => {
    res.json({"data":[resql.rows]});
  })
});

/* POST user Create */
router.post('/add/', function(req, res, next){
  let text = "INSERT INTO public.users (email, first_name, last_name, company, url, description) VALUES($1, $2, $3, $4, $5, $6)"
  let values = [req.body['email'],req.body['first_name'],req.body['last_name'],req.body['company'],req.body['url'],req.body['description']]

  // callback
  client.query(text, values, (err, resql) => {
    if (err) {
      res.json(err.stack)
    } else {
      if(resql.rowCount > 0){
        res.json({"status":200,"message":"Usuario agregado correctamente"})
      }
    }
  })
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
