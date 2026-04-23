import request from 'supertest';
import app from '../app';
import { prisma } from '../persistence/prisma';

describe('Auth API', () => {
  const uniqueEmail = `test+${Date.now()}@test.com`;

  const user = {
    name: 'Test User',
    email: uniqueEmail,
    password: '123456',
  };

  beforeAll(async () => {
    process.env.JWT_SECRET ||= 'test-secret';
    await prisma.user.deleteMany({ where: { email: user.email } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: user.email } });
    await prisma.$disconnect();
  });

  // REGISTER

  it('should register a new user', async () => {
    const res = await request(app).post('/auth/register').send(user);

    expect(res.status).toBe(201);
    expect(res.body.email).toBe(user.email);
    expect(res.body.password).toBeUndefined();
  });

  it('should not allow duplicate email', async () => {
    const res = await request(app).post('/auth/register').send(user);

    expect(res.status).toBe(409);
    expect(res.body.message).toBeDefined();
  });

  it('should fail with invalid email format', async () => {
    const res = await request(app).post('/auth/register').send({
      name: 'Test',
      email: 'invalid-email',
      password: '123456',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  // LOGIN

  it('should login user and return token', async () => {
    const res = await request(app).post('/auth/login').send({
      email: user.email,
      password: user.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  it('should fail with wrong password', async () => {
    const res = await request(app).post('/auth/login').send({
      email: user.email,
      password: 'wrong-password',
    });

    expect(res.status).toBe(401);
  });

  it('should fail with non-existing user', async () => {
    const res = await request(app).post('/auth/login').send({
      email: 'notfound@test.com',
      password: '123456',
    });

    expect(res.status).toBe(401);
  });
});
