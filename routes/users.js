var express = require('express');
var router = express.Router();
var nconf = require('nconf');
const request = require('request');
const { Pool } = require('pg');

nconf.argv()
   .env()
   .file({ file: 'config.json' });

const pool = new Pool({
  user: nconf.get("user"),
  host: nconf.get("host"),
  database: nconf.get("database"),
  password: nconf.get("password"),
  port: nconf.get("port"),
})

getUsers = (ids) =>{
  return new Promise((resolve, reject)=>{
      pool.query('SELECT * FROM users u WHERE id IN ('+ids+')',  (error, results)=>{
          if(error){
              return reject(error);
          }
          return resolve(results);
      });
  });
};

useExternealApi = (element) => {
  return new Promise((resolve, reject)=>{
    request.get("https://reqres.in/api/users/"+element, async (err, resreq, body) => {
      if(err){
        return reject({"data":{"id":element}})
      }else{
        if(JSON.parse(body)["data"] != undefined){
          return resolve(JSON.parse(body)["data"])
        }else{
          return resolve({"status":"404","id":element+" not found"})
        }
      }
    })
  });
};


/* GET users listing. */
router.get('/:id', async function(req, res, next) {
  try{
    users = await getUsers(req.params.id);
    let data = users.rows
    //Obtención de los Id de la petición para identificar los que no se encuentren
    let ids = req.params.id.split(",").map(function(item) {
      return parseInt(item, 10);
    });
    //Fin de la obtencion de ids
    if(ids.length != users.rowCount){
      //Consulta Ids Faltantes
      let ids_found = []
      users.rows.forEach(
        function(element){
          ids_found.push(element["id"])
        }
      )
      let id_missing = []
      //Filtrado
      ids.forEach(function(e) { if(ids_found.indexOf(e) === -1){id_missing.push(e)}})
      //Fin de la consulta de Ids Faltantes
      
      for(i = 0;i < id_missing.length; i++){
        aux = await useExternealApi(id_missing[i]);
        data.push(aux)
      }

      res.status(200).json(data)
    }else{
      res.status(200).json(data)
    }


  }catch(e){
    console.log(e)
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
