const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {

  if (err) {
    return console.log('Unable to connect to Mongo Db server');
  }
  console.log('Connected to MongoDB server');

  db.collection('Todos').insertOne({
    text: 'Something to do',
    completed: false
  }, (err, result) => {
    if (err) {
      return console.log('Something went wrong inserting todo', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));

  });


  db.collection('Users').insertOne({
    name: 'Gaurav Mishra',
    age: 28,
    location: 'Noida'
  }, (err, result) => {
    if (err) {
      return console.log('Something went wrong inserting user', err);
    }

    console.log(JSON.stringify(result.ops, undefined, 2));

  })

  db.close();

});
