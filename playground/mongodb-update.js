const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

  if (err) {
    return console.log('Unable to connect to Mongo Db server');
  }

  console.log('Connected to database server');


  db.collection('Todos').findOneAndUpdate({
    _id: new ObjectID('5a09c176cf31fe2bb1e121dc')
  }, {
    $set: {
      completed: true
    }
  }, {
    returnOriginal: false
  }).then((res) => {
    console.log(JSON.stringify(res, undefined, 2));
  })
  //db.close;

});
