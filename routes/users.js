var express = require('express');
var router = express.Router();

const { Pool } = require('pg');

const pool = new Pool({
  user: 'xxxxxxxx',
  host: 'localhost',
  database: 'nodeskx',
  password: 'xxxxxxxxxxxx',
  port: 5432,
})

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  try {
    const query = {
      text: "SELECT * FROM users u WHERE id IN ($1)",
      values: [req.params.id]
    }
    pool.query(query, (err, resql) => {
      if(err){
        res.json({"Status":"Error","Message":err.message})
      }else{
        res.json({"data":[resql.rows]});
      }
    })
  }catch (error){
    res.json({"Status":"Error","Error Code":500})
  }

});

/* POST user Create */
router.post('/add/', function(req, res, next){
  try{
    const query = {
      text:"INSERT INTO public.users (email, first_name, last_name, company, url, description) VALUES($1, $2, $3, $4, $5, $6)",
      values: [req.body['email'],req.body['first_name'],req.body['last_name'],req.body['company'],req.body['url'],req.body['description']]
    }

    pool.query(query, (err, resql) => {
      if (err)
        res.json({"Status":"Error","Message":err.message})
      else
          if(resql.rowCount > 0)
            res.json({"Status":"Ok","message":"Usuario agregado correctamente"})
    })
  }catch(error){
    res.json({"Status":"Error","Error Code":500})
  }
  
});

/* PUT user Modify */
router.put('/modify/', function(req, res, next){
  try{
    const query = {
      text: "UPDATE public.users SET email=$2, first_name=$3, last_name=$4, company=$5, url=$6, description=$7 WHERE id=$1",
      values: [req.body["id"],req.body["email"],req.body["first_name"],req.body["last_name"],req.body["company"],req.body["url"],req.body["description"]]
    }
  
    pool.query(query, (err, reqsqlU) => {
      if(err)
        res.json({"Status":"Error","Message":err.message})
      else
        if(reqsqlU.rowCount > 0)
          res.json({"Status":"Ok","rowCount":reqsqlU.rowCount,"data":req.body})
        else
          res.json({"Status":"Error","rowCount":reqsqlU.rowCount})
    })
  }catch(error){
    res.json({"Status":"Error","Error Code":500})
  }
});

/* DELETE User Delete */
router.delete('/delete/:id', function(req, res, next){
  try{
    const query = {
      text: "DELETE FROM public.users WHERE id=$1",
      values: [req.params.id]
    }
    pool.query(query,(err,resql) => {
      if(err)
        res.json({"Status":"Error","Message":err.message})
      else
        if(resql.rowCount > 0)
          res.json({"Status":"Ok","rowCount":resql.rowCount})
        else
          res.json({"Status":"Error","rowCount":resql.rowCount})  
    })
  }catch(error){
    res.json({"Status":"Error","Error Code":500})
  }

});


module.exports = router;
