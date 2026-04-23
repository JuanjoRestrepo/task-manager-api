import request from 'supertest';
import app from '../app';
import { prisma } from '../persistence/prisma';

describe('Tasks API', () => {
  let token: string;
  let taskId: number;

  const uniqueEmail = `task+${Date.now()}@test.com`;

  const user = {
    name: 'Task User',
    email: uniqueEmail,
    password: '123456',
  };

  const cleanupUser = async () => {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!existing) return;

    await prisma.task.deleteMany({ where: { userId: existing.id } });
    await prisma.user.deleteMany({ where: { id: existing.id } });
  };

  beforeAll(async () => {
    process.env.JWT_SECRET ||= 'test-secret';

    await cleanupUser();

    await request(app).post('/auth/register').send(user);

    const res = await request(app).post('/auth/login').send({
      email: user.email,
      password: user.password,
    });

    token = res.body.token;
  });

  afterAll(async () => {
    await cleanupUser();
    await prisma.$disconnect();
  });

  // NO AUTH

  it('should reject request without token', async () => {
    const res = await request(app).get('/tasks');

    expect(res.status).toBe(401);
  });

  it('should reject invalid token', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', 'Bearer invalidtoken');

    expect(res.status).toBe(401);
  });

  // CREATE

  it('should create a task', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
      });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('Test Task');

    taskId = res.body.id;
  });

  it('should fail creating task without title', async () => {
    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(res.status).toBe(400);
  });

  // READ

  it('should get all tasks', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should get one task', async () => {
    const res = await request(app)
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(taskId);
  });

  it('should return 404 for non-existing task', async () => {
    const res = await request(app)
      .get('/tasks/999999')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  // UPDATE

  it('should update a task', async () => {
    const res = await request(app)
      .put(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Updated Task',
      });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Task');
  });

  // DELETE

  it('should delete a task', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(204);
  });

  it('should return 404 when deleting non-existing task', async () => {
    const res = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });
});
