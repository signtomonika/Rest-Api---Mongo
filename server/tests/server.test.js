const expect = require('expect');
const superTest = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
    {
        _id: new ObjectID(),
        text: 'test todo 1'
    },
    {
        _id: new ObjectID(),
        text: 'test todo 2',
        completed: true,
        completedAt: 333
    }
];

beforeEach((done) => {    //gets called before each test case - clears the database

    Todo.remove({}).then(
        () => {
            return Todo.insertMany(todos);

        }
    ).then(() => done());

});

describe('POST/todos', () => {

    it('should create a new todo', (done) => {

        var text = 'Test todo text';

        superTest(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);  //text stored is same as text sent in request
            })
            .end((err, res) => {

                if (err) {

                    return done(err);   //check and return if any error
                }

                Todo.find({ text }).then(   //executes when post succeeds
                    (todos) => {
                        expect(todos.length).toBe(1);   //check if todos length is 1 (if todos is empty)
                        expect(todos[0].text).toBe(text);  //check if the text present is same as test text
                        done();
                    }
                ).catch(
                    (err) => {
                        done(err);  //catch any error thrown
                    }
                )

            });

    });

    it('should not create todo with invalid data', (done) => {

        superTest(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {

                if (err) {

                    return done(err);

                }

                Todo.find().then(

                    (todos) => {
                        expect(todos.length).toBe(2);
                        done();
                    }

                ).catch((err) => {
                    done(err);
                });

            });

    });


});

describe('GET/todos', () => {

    it('should get all todos', (done) => {

        superTest(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);

    });

});

describe('GET/todos/:id', () => {

    it('should return todo doc', (done) => {

        superTest(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect(
                (res) => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {

        var id = new ObjectID().toHexString();

        superTest(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);

    });

    it('should return 400 for non-object ids', (done) => {

        superTest(app)
            .get('/todos/123abc')
            .expect(400)
            .end(done);

    });

});

describe('DELETE/todos/:id', () => {

    it('should remove a todo', (done) => {

        var id = todos[1]._id.toHexString();

        superTest(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect(
                (res) => {

                    expect(res.body.todo._id).toBe(id);

                })
            .end(
                (err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.findById(id)
                        .then(

                            (todo) => {
                                expect(todo).toNotExist();
                                done();
                            }

                        ).catch((err) => {
                            done(err);
                        })

                })

    });

    it('should return 404 if todo not found', (done) => {

        var id = new ObjectID().toHexString();

        superTest(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);


    });

    it('should return 400 if object id is invalid', (done) => {

        superTest(app)
            .delete('/todos/123abc')
            .expect(400)
            .end(done);

    });

});

describe('PATCH/todos/:id', () => {

    it('should update the todo', (done) => {

        var id = todos[0]._id.toHexString();

        var body = {
            "completed": true,
            "text": "Updates from TestScript"
        };

        superTest(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect(
                (res) => {

                    expect(res.body.todo.text).toBe(body.text);
                    expect(res.body.todo.completed).toBe(true);
                    expect(res.body.todo.completedAt).toBeA('number');
                }
            ).end(done);

    });

    it('should clear completedAt when todo is not completed', (done) => {

        var id = todos[1]._id.toHexString();

        var body = {
            "completed": false,
            "text": "Updates from TestScript 2"
        };

        superTest(app)
            .patch(`/todos/${id}`)
            .send(body)
            .expect(200)
            .expect(
                (res) => {

                    expect(res.body.todo.text).toBe(body.text);
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toNotExist();
                }
            ).end(done);

    });


});