var express = require('express');
var bodyParser = require('body-parser');
var {ObjectId} = require('mongodb');
const _ = require('lodash');

require('./config/config');


var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

app.use(bodyParser.json());
const port = process.env.PORT;

app.post('/todos', authenticate, (req, res) => {
  console.log(req.body);

  var todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });

  todo.save().then((doc) => {
    res.send(doc);
  }, (err) => {
    res.status(400).send(err);
  });

});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({
      todos,
      status: 'success'
    })
  }, (err) => {
    res.status(400).send(err);
  });
});

app.get('/todos/:id', authenticate, (req, res) => {

  var id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(404).send({
      status: false,
      msg: 'Invalid Id'
    });
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send({
        status: false,
        msg: 'No results found'
      });
    }
    res.send({
      status: 'success',
      todo
    });
  }, (e) => {
    res.status(400).send({
      status: false,
      msg: 'Something went wrong'
    });
  }).catch((e) => {
    res.status(400).send({
      status: false,
      msg: 'Something went wrong'
    });
  });

});


app.delete('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  Todo.findOneAndRemove({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send({
        status: false,
        msg: 'Todo not found'
      });
    }

    res.send({
      status: true,
      todo
    });

  }, (err) => {
    res.status(404).send({
      status: false,
      msg: 'Something went wrong'
    })
  }).catch((e) => {
    return res.status(400).send({
      status: false,
      msg: 'Something went wrong'
    });
  });

});

//Update Todo

app.patch('/todos/:id', authenticate, (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);

  if (!ObjectId.isValid(id)) {
    return res.status(404).send();
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({_id:id,_creator:req.user._id}, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.send({todo});
  }).catch((e) => {
    res.status(400).send();
  });

});

//POST /users
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((e) => {
    res.status(400).send(e);
  });

});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

//POST /users /login {email,password}
app.post('/users/login', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password)
    .then((user) => {
      user.generateAuthToken().then((token) =>{
        res.header('x-auth', token).send(user);
      })
    }).catch((e) => {
       res.status(400).send();
    });
});


app.delete('/users/me/token', authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send();
  }).catch((e) => {
    res.status(400).send();
  });
});


app.listen(port, () => {
  console.log(`Started on port ${port}`);
})

module.exports = {
  app
};
