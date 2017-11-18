const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
  _id : new ObjectId(),
  text : 'First test Todo'
}, {
  _id : new ObjectId(),
  text : 'Second test Todo',
  completed : true,
  completedAt :333
}];

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {

  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(2);
      }).end(done);

  });

});


describe('GET /todos/id', () => {

  it('should return todo doc', (done) => {

    request(app)
    .get(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    .expect((res) => {
       expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);

  });

  it('should return 404 if todo not found', (done) => {
    var randomId = new ObjectId();
    request(app)
      .get(`/todos/${randomId.toHexString()}`)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    var randomId = 'hsjdhsjhdjsh89sd9';
    request(app)
      .get(`/todos/${randomId}`)
      .expect(404)
      .end(done);
  });


});

describe('DELETE /todos/id', () => {

  it('should remove todo ', (done) => {
      var id = todos[1]._id.toHexString();
      request(app)
        .delete(`/todos/${id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[1].text);
        })
        .end((err, res) => {

          if (err) {
            return done(err);
          }

          Todo.findById(id).then((todo) => {
            expect(todo).toNotExist();
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
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-object ids', (done) => {
    var randomId = 'hsjdhsjhdjsh89sd9';
    request(app)
      .delete(`/todos/${randomId}`)
      .expect(404)
      .end(done);
  });


});


describe('PATCH /todos/:id', () => {

  it('should update todo', (done) => {

    var text = 'This should be updated text';

    request(app)
      .patch(`/todos/${todos[0]._id.toHexString()}`)
      .send({
        completed:true,
        text
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(text);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');

      })
      .end(done);

  });

  it('should clear completedAt when todo is not completed', (done) => {

    request(app)
      .patch(`/todos/${todos[1]._id.toHexString()}`)
      .send({
        completed:false,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();

      })
      .end(done);



  });

});
