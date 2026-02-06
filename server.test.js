const request = require('supertest');

// Ensure JWT_SECRET is set before loading app (authMiddleware and auth need it)
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret-key';

// Mock uuid so Jest doesn't have to load the ESM uuid package
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

const app = require('./server');
const { todos, users } = require('./data.js');

describe('Todo API Endpoints', () => {
  let authToken;
  let testUsername;

  beforeAll(async () => {
    testUsername = `testuser-${Date.now()}`;
    await request(app).post('/user').send({ username: testUsername, password: 'password123' });
    const loginRes = await request(app).post('/login').send({ username: testUsername, password: 'password123' });
    authToken = loginRes.body.token;
  });

  const authGet = (url) => request(app).get(url).set('Authorization', `Bearer ${authToken}`);
  const authPost = (url, body) =>
    request(app).post(url).set('Authorization', `Bearer ${authToken}`).set('Content-Type', 'application/json').send(body);
  const authDelete = (url) => request(app).delete(url).set('Authorization', `Bearer ${authToken}`);

  test('GET / should return only the authenticated user\'s todos (initially empty)', async () => {
    const res = await authGet('/');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);
  });

  test('POST / should add a new todo for the user and return only their todos', async () => {
    const newTodo = { message: 'Jest test task' };
    const res = await authPost('/', newTodo);

    expect(res.statusCode).toBe(201);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(1);
    expect(res.body[0].message).toBe(newTodo.message);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0].userId).toBe(testUsername);
  });

  test('GET / after POST should return the user\'s todo list', async () => {
    const res = await authGet('/');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].message).toBe('Jest test task');
    expect(res.body[0].userId).toBe(testUsername);
  });

  test('DELETE /:id should remove only the user\'s todo', async () => {
    const getRes = await authGet('/');
    const idToDelete = getRes.body[0].id;

    const res = await authDelete(`/${idToDelete}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBe(0);

    const getAfter = await authGet('/');
    expect(getAfter.body.length).toBe(0);
  });

  test('GET / without token should return 401', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(401);
  });
});
