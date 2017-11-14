const {
  MongoClient,
  ObjectID
} = require('mongodb');
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

  if (err) {
    return console.log('Unable to connect to Mongo Db server');
  }

  console.log('Connected to database server');

  // db.collection('Todos').find({
  //   _id : new ObjectID('5a09c2176753c12c23ab6a20')
  // }).toArray().then((docs) => {
  //   console.log('Todos');
  //   console.log(JSON.stringify(docs, undefined, 2));
  // }, (err) => {
  //   console.log('unable to fetch todos', err);
  // });

  db.collection('Users').find({
    name: 'Jen'
  }).count().then((count) => {
    console.log('Found record count ', count);
  }, (err) => {
    console.log('Unable to fetch users ', err);
  });

  //db.close;

});
