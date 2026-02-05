const request = require('supertest');

// Mock uuid so Jest doesn't have to load the ESM uuid package
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

const app = require('./server'); // imports the exported app

describe('Todo API Endpoints', () => {
  let initialTodosLength;

  // Optional: reset or get initial state before each test
  beforeEach(async () => {
    const res = await request(app).get('/');
    initialTodosLength = res.body.length;
  });

  test('GET / should return all todos as JSON array', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThanOrEqual(3); // your initial 3
    expect(res.body[0]).toHaveProperty('message');
    expect(res.body[0]).toHaveProperty('id');
  });

  test('POST / should add a new todo and return updated list', async () => {
    const newTodo = { message: 'Jest test task' };

    const res = await request(app)
      .post('/')
      .send(newTodo)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(201); // or 200 if your POST returns 200
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(initialTodosLength + 1);
    expect(res.body[res.body.length - 1].message).toBe(newTodo.message);
    expect(res.body[res.body.length - 1]).toHaveProperty('id'); // uuid
  });

  test('DELETE /:id should remove a todo and return updated list', async () => {
    // First get current todos to pick a valid ID
    const getRes = await request(app).get('/');
    const todoToDelete = getRes.body[0]; // take first one
    const idToDelete = todoToDelete.id;

    const res = await request(app).delete(`/${idToDelete}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(initialTodosLength - 1);
    expect(res.body.find(t => t.id === idToDelete)).toBeUndefined();
  });
});