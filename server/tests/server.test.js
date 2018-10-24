const expect = require('expect');
const superTest = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');

const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

/***********************************************************/
//Preparatory for each test
/***********************************************************/

//gets called before each test case - clears the database

beforeEach(populateTodos);
beforeEach(populateUsers);

/***********************************************************/
//POST
/***********************************************************/

describe('POST/todos', () => {

    it('should create a new todo', (done) => {

        var text = 'Test todo text';

        superTest(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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

/***********************************************************/
//GET ALL TODOS
/***********************************************************/

describe('GET/todos', () => {

    it('should get all todos', (done) => {

        superTest(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);

    });

});

/***********************************************************/
//GET TODO BY ID
/***********************************************************/

describe('GET/todos/:id', () => {

    it('should return todo doc', (done) => {

        superTest(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);

    });

    it('should return 400 for non-object ids', (done) => {

        superTest(app)
            .get('/todos/123abc')
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done);

    });

    it('should not return todo doc created by other user', (done) => {

        superTest(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

});

/***********************************************************/
//DELETE TODO BY ID
/***********************************************************/

describe('DELETE/todos/:id', () => {

    it('should remove a todo', (done) => {

        var id = todos[1]._id.toHexString();

        superTest(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
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
                                expect(todo).toBeFalsy();
                                done();
                            }

                        ).catch((err) => {
                            done(err);
                        })

                })

    });

    it('should not remove a todo created by other user', (done) => {

        var id = todos[0]._id.toHexString();

        superTest(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(
                (err, res) => {
                    if (err) {
                        return done(err);
                    }

                    Todo.findById(id)
                        .then(

                            (todo) => {
                                expect(todo).toBeTruthy(); //checking if todo exists
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
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);


    });

    it('should return 400 if object id is invalid', (done) => {

        superTest(app)
            .delete('/todos/123abc')
            .set('x-auth', users[1].tokens[0].token)
            .expect(400)
            .end(done);

    });

});

/***********************************************************/
//UPDATE TODO BY ID
/***********************************************************/

describe('PATCH/todos/:id', () => {

    it('should update the todo', (done) => {

        var id = todos[0]._id.toHexString();

        var body = {
            "completed": true,
            "text": "Updates from TestScript"
        };

        superTest(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(body)
            .expect(200)
            .expect(
                (res) => {

                    expect(res.body.todo.text).toBe(body.text);
                    expect(res.body.todo.completed).toBe(true);
                   // expect(res.body.todo.completedAt).toBeA('number');
                   expect(typeof res.body.todo.completedAt).toBe('number');
                }
            ).end(done);

    });

    it('should not update the todo by other user', (done) => {

        var id = todos[0]._id.toHexString();

        var body = {
            "completed": true,
            "text": "Updates from TestScript"
        };

        superTest(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(body)
            .expect(404)
            .end(done);

    });

    it('should clear completedAt when todo is not completed', (done) => {

        var id = todos[1]._id.toHexString();

        var body = {
            "completed": false,
            "text": "Updates from TestScript 2"
        };

        superTest(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(body)
            .expect(200)
            .expect(
                (res) => {

                    expect(res.body.todo.text).toBe(body.text);
                    expect(res.body.todo.completed).toBe(false);
                    expect(res.body.todo.completedAt).toBeFalsy();
                }
            ).end(done);

    });


});

/***********************************************************/
//INSERT USERS
/***********************************************************/

describe('POST /users', () => {

    it('should create a user', (done) => {

        var email = 'xilun@panda.com';
        var password = '123abc';

        superTest(app)
            .post('/users')
            .send({ email, password })
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

                User.findOne({ email }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();

                }).catch((err) => done(err));

            });

    });

    it('should return validation errors if request invalid', (done) => {

        var email = 'yalun';
        var password = '123';

        superTest(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);


    });

    it('should not create user if email in use', (done) => {

        var email = users[0].email;
        var password = '123456';

        superTest(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);


    });

});


/***********************************************************/
//GET USERS BY TOKEN
/***********************************************************/

describe('GET /users/me', () => {

    it('should return user if authenticated', (done) => {

        superTest(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);

    });

    it('should return 401 if not authenticated', (done) => {

        superTest(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body.name).toBe('JsonWebTokenError');
            })
            .end(done);

    });

});

/***********************************************************/
//CHECK USER LOGIN
/***********************************************************/

describe('POST /users/login', () => {

    it('should login user and return auth token', (done) => {

        var email = users[1].email;
        var password = users[1].password;

        superTest(app)
            .post('/users/login')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                User.findById(users[1]._id).then((user) => {

                    expect(user.tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => done(err));
            });

    });

    it('should reject invalid login', (done) => {

        var email = users[1].email;
        var password = 'somePassword';

        superTest(app)
            .post('/users/login')
            .send({ email, password })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end((err, res) => {
                if (err) {
                    done(err);
                }

                User.findById(users[1]._id).then((user) => {

                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((err) => done(err));
            });

    });

});

/***********************************************************/
//CHECK USER LOGOUT
/***********************************************************/

describe('DELETE /users/me/token', () => {

    it('should remove auth token on logout', (done) => {

        var token = users[0].tokens[0].token;
        var userId = users[0]._id;

        superTest(app)
            .delete('/users/me/token')
            .set('x-auth', token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err)
                }

                User.findById(userId).then(
                    (user) => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch((err) => done(err));
            });

    });

});