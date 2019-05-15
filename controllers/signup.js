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

const signUpController = function(req, res){
    if(!email| !name |!password){
       return res.status(400).json("Fields cannot be empty");
    }
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
.catch(err =>res.status(400).json('signup error, please try again!'))};


module.exports = {
        signUpController:signUpController
    };