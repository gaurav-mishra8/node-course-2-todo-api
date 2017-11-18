const{ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((res) => {
//   console.log('Removed all todos ', res);
// }, (err) => {
//   console.log('Error removing Todos');
// });

//Todo.findOneAndRemove({})

Todo.findByIdAndRemove('5a0f862e99ffeccd93da2973').then((result) => {
  console.log(result);
});
