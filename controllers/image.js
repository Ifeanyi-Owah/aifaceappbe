const knex = require('knex');

const db= knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: '',
        database: 'aifaceappdb'
    }
});

  const imageController = function(req, res){
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries =>{
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entry, please try again'));
    }

    module.exports = {
        imageController:imageController,
       
    }