const {
  MongoClient,
  ObjectID
} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

  if (err) {
    return console.log('Unable to connect to Mongo Db server');
  }

  console.log('Connected to database server');

  //deleteMany
  // db.collection('Todos').deleteMany({
  //   completed: true
  // }).then((res) => {
  //   console.log(res);
  // });

  // db.collection('Users').deleteMany({
  //   name: 'Jen'
  // }).then((res) => {
  //   console.log(res);
  // });

  //deleteOne


  //findOneAndDelete

  db.collection('Users')
    .findOneAndDelete({
      _id: new ObjectID('5a09c230a7c7552c243e7728')
    })
    .then((results) => {
      console.log(JSON.stringify(results, undefined, 2));
    });

  //db.close;

});
