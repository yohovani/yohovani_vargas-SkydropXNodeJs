var express = require('express');
var router = express.Router();
const request = require('request');

const { Pool } = require('pg');

const pool = new Pool({
  user: 'cliente',
  host: 'localhost',
  database: 'nodeskx',
  password: 'DragonBall',
  port: 5432,
})

/* GET users listing. */
router.get('/:id', function(req, res, next) {
  try {
    res.setHeader("Content-type", "application/json")
    const query = {
      text: "SELECT * FROM users u WHERE id IN ('"+req.params.id+"')",
      values: [req.params.id]
    }
    /*
      Obtención de los Id de la petición para identificar los que no se encuentren
    */

      let ids = req.params.id.split(",").map(function(item) {
        return parseInt(item, 10);
      });
      console.log(ids)
    //Fin de la obtencion de ids
    
    pool.query("SELECT * FROM users u WHERE id IN ("+req.params.id+")", (err, resql) => {
      if(err){
        res.status(200).json({"Status":"Error","Message":err.message})
      }else{
        //Verificación sobre si se encontraron todos los ids en la bd
        if(ids.length == resql.rowCount)
          res.json({"data":[resql.rows]});
        else{
          let data =  resql.rows
          //Consulta Ids Faltantes
          let ids_found = []
          resql.rows.forEach(
            function(element){
              ids_found.push(element["id"])
            }
          )
          let id_missing = []
          //Filtrado
          ids.forEach(function(e) { if(ids_found.indexOf(e) === -1){id_missing.push(e)}})
          //Fin de la consulta de Ids Faltantes
          console.log(id_missing)
          id_missing.forEach( async function(element,next) {
            try{
              await request.get("https://reqres.in/api/users/"+element,(err, resreq, next) => {
                if(err){
                  data.push({"data":{"id":element+"not fount"}})
                }else{
                  if(JSON.parse(resreq.body)["data"] != undefined)
                    data.push(JSON.parse(resreq.body)["data"])
                  else{}
                    data.push({"status":"404","id":element+" not found"})
                }
              })
            }catch(e){
              next(e)
            }
          })
        }
      }
    })
    res.status(200).json(data)
  }catch (error){
    res.status(500).json({"Status":"Error","Error Code":500})
  }
  throw new ERR_HTTP_HEADERS_SENT('set')
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
