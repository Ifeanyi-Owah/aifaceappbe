const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex');
const PORT = process.env.PORT || 3000;

const db= knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: '',
        database: 'aifaceappdb'
    }
});

db.select('*').from('users').then( data => {
//   console.log(data);
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send(database.users);
 })

app.post('/signin', (req, res)=>{
  db.select('email','hash').from('login')
  .where('email', '=', req.body.email)
  .then(data =>{
     const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
     console.log(isValid);
     if(isValid){
         return db.select('*').from('users')
         .where('email', '=', req.body.email)
         .then(user =>{
             console.log(user);
             res.json(user[0])
         })
         .catch(err => res.status(400).json('unable to get user'))
     }else{
        res.status(400).json('wrong credentials');
     }
     
  })
  .catch(err => res.status(400).json('incorrect credentials'))
});


app.post('/signup', function(req, res){
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx =>{
        trx.insert({
            hash:hash,
            email:email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0],
                    name: name,
                    joined: new Date()
                }).then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
.catch(err =>res.status(400).json('signup error, please try again!'))
})


app.get('/profile/:id', function(req, res){
  const {id} = req.params;
  db.select('*').from('users').where({
      id:id})
      .then(user => {
      if(user.length){
        res.json(user[0]);
      }else{
        res.status(400).json("user not found!");
      }
   
  }).catch(err => res.status(400).json("user not found!"))
})

app.put('/image', function(req, res){
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entry, please try again'));
    })

app.listen(PORT, function(){
    console.log(`app runing on PORT ${PORT}`);
});


