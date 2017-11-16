const{ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');



// var id = '5a0d98761670bb0b604b4fddwe';
//
// if(!ObjectId.isValid(id)){
//   return console.log('id not valid');
// }

// Todo.find({
//   _id: id
// }).then((todos) => {
//   console.log('Todos', todos);
// });
//
// Todo.findOne({
//   _id: id
// }).then((todo) => {
//   console.log('Todos', todo);
// });

// Todo.findById(id).then((todo) => {
//   if (!todo) {
//     return console.log('id not found');
//   }
//   console.log('Todos', todo);
// }).catch((e) => {
//   console.log(e);
// });

User.findById('6a0c54a9edb90b25b89cbb89').then((user) => {
  console.log('User found ', user);
}).catch((e) => {
  consolog.log(e);
})
