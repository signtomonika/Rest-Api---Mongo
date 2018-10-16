const expect = require('expect');
const superTest = require('supertest');

const { app } = require('../server');
const { Todo } = require('../models/todo');

beforeEach((done) => {    //gets called before each test case - clears the database

    Todo.remove({}).then(
        () => {

            done();
        }
    );

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

                Todo.find().then(   //executes when post succeeds
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
                        expect(todos.length).toBe(0);
                        done();
                    }

                ).catch((err) => {
                    done(err);
                });

            });

    });


});