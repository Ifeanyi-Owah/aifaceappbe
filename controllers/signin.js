const bcrypt = require("bcrypt-nodejs");
const knex = require('knex');

const db= knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: '',
        database: 'aifaceappdb'
    }
});

const signInController = (req, res)=>{
    const {email, password} = req.body;
    if(!email |!password){
        return res.status(400).json("Fields cannot be empty");
     }
    db.select('email','hash').from('login')
    .where('email', '=', email)
    .then(data =>{
       const isValid = bcrypt.compareSync(password, data[0].hash);
       if(isValid){
           return db.select('*').from('users')
           .where('email', '=', email)
           .then(user =>{
               res.json(user[0])
           })
           .catch(err => res.status(400).json('unable to get user'))
       }else{
          res.status(400).json('wrong credentials');
       }
       
    })
    .catch(err => res.status(400).json('incorrect credentials'))
  }

  module.exports = {
    signInController:signInController
  };