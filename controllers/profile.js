const db= knex({
    client: 'pg',
    connection: {
        host: '127.0.0.1',
        user: '',
        database: 'aifaceappdb'
    }
});

const profileController = function(req, res){
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
  }

  module.exports = {
    profileController:profileController
  }