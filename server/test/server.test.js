const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos,populateTodos,users,populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));

      }); // end of supertest request block

  }); // end of it test block



  it('should not create todo with invalid body data', (done) => {

    request(app)
      .post('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {

        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => {
          done(e);
        });

      });

  }); // end of it should not create todo with invalid body data

}); // end of describe block


describe('GET /todos', () => {

  it('should get all todos', (done) => {

    request(app)
      .get('/todos')
      .set('x-auth',users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      }).end(done);

  });

});


describe('GET /todos/id', () => {

  it('should return todo doc', (done) => {

    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res) => {
       expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);

  });

  it('should not return todo doc created by other user', (done) => {

    request(app)
    .get(`/todos/${todos[1]._id.toHexString()}`)
    .set('x-auth',users[0].tokens[0].token)
    .expect(404)
    .end(done);

  });

  it('should return 404 if todo not found', (done) => {
    var randomId = new ObjectId();
    request(app)
      .get(`/todos/${randomId.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    var randomId = 'hsjdhsjhdjsh89sd9';
    request(app)
      .get(`/todos/${randomId}`)
      .set('x-auth',users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });


});

describe('DELETE /todos/id', () => {

  it('should remove todo ', (done) => {
      var id = todos[1]._id.toHexString();
      request(app)
        .delete(`/todos/${id}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[1].text);
        })
        .end((err, res) => {

          if (err) {
            return done(err);
          }

          Todo.findById(id).then((todo) => {
            expect(todo).toBeFalsy();
            done();
          }, (err) => {
            done(err);
          }).catch((e) => done(e));

        });

  });

  it('should not remove todo by other user', (done) => {
      var id = todos[0]._id.toHexString();
      request(app)
        .delete(`/todos/${id}`)
        .set('x-auth',users[1].tokens[0].token)
        .expect(404)
        .end((err, res) => {

          if (err) {
            return done(err);
          }

          Todo.findById(id).then((todo) => {
            expect(todo).toBeTruthy();
            done();
          }, (err) => {
            done(err);
          }).catch((e) => done(e));

        });

  });


  it('should return 404 if todo not found', (done) => {
    var randomId = new ObjectId();
    request(app)
      .delete(`/todos/${randomId.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    var randomId = 'hsjdhsjhdjsh89sd9';
    request(app)
      .delete(`/todos/${randomId}`)
      .set('x-auth',users[1].tokens[0].token)
      .expect(404)
      .end(done);
  });


});


describe('PATCH /todos/:id', () => {

  it('should update todo', (done) => {
    var text = 'This should be updated text';
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[0].tokens[0].token)
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
      //  expect(res.body.todo.completedAt).toBeA('number');
        expect(typeof res.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update todo for other user', (done) => {
    var text = 'This should be updated text';
    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed:true,
        text
      })
      .expect(404)
      .end(done);
  });

  it('should clear completedAt when todo is not completed', (done) => {
    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth',users[1].tokens[0].token)
      .send({
        completed:false,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toBeFalsy();

      })
      .end(done);
  });
});



describe('GET /users/me' , () => {

  it('should get a user if authenticated' ,(done) => {

    request(app)
    .get('/users/me')
    .set('x-auth',users[0].tokens[0].token)
    .expect(200)
    .expect((res) =>{
      expect(res.body._id).toBe(users[0]._id.toHexString());
      expect(res.body.email).toBe(users[0].email);
    }).end(done);

  });

  it('should get a 401 if not authenticated', (done) => {
  request(app)
    .get('/users/me')
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({});
    }).end(done);
});

});


describe('POST /users', () => {

  it('should create a user', (done) => {
    var email = 'exsmple@example.com';
    var password = 'abc123!';

    request(app)
      .post('/users')
      .send({
        email,
        password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({
          email
        }).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));

      });

  });

  it('should return validation error for invalid date', (done) => {

    request(app)
      .post('/users')
      .send({
        email: 'pashtun@exmaple.com',
        password: 'ok'
      })
      .expect(400)
      .end(done);

  });

  it('should not create user if email in use', (done) => {

    request(app)
      .post('/users')
      .send({
        email: 'andrew@exmaple.com',
        password: 'okjaanu'
      })
      .expect(400)
      .end((err) => {
        if (err) {
          return done();
        }

        done();
      });

  });

});



describe('POST /users/login', () => {

  it('should login user and return token', (done) => {

    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password
      })
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.toObject().tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });

  });


  it('should reject invalid login', (done) => {

    request(app)
      .post('/users/login')
      .send({
        email: users[1].email,
        password: users[1].password+'1'
      })
      .expect(400)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeFalsy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[1]._id).then((user) => {
          expect(user.tokens.length).toBe(1);
          done();
        }).catch((e) => done(e));
      });
});
});

describe('DELETE /users/toke/me', () => {

  it('should delete token on logout', (done) => {

    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {

        if(err){
          return done(err);
        }

        User.findById(users[0]._id).then((user) => {
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });

  });

});
