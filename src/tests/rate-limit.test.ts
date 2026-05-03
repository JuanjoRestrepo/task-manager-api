import request from 'supertest';
import app from '../app';

describe('Rate Limiting & Health Checks', () => {
  // These tests verify the middleware configuration and bypass logic
  
  it('should allow unlimited requests to /health (bypass global limit)', async () => {
    // We simulate a burst of requests. Since it's moved above the limit, all should return 200.
    const requests = Array.from({ length: 110 }, () => request(app).get('/health'));
    const responses = await Promise.all(requests);
    
    const allSuccessful = responses.every(res => res.status === 200);
    expect(allSuccessful).toBe(true);
  });

  it('should enforce global rate limit of 100 on other routes', async () => {
    // Note: express-rate-limit uses memory store by default, so we hit it sequentially
    // We use a specific IP for this test to isolate it from others
    for (let i = 0; i < 100; i++) {
      await request(app).get('/test/protected').set('X-Forwarded-For', '1.1.1.1');
    }
    const res = await request(app).get('/test/protected').set('X-Forwarded-For', '1.1.1.1');
    expect(res.status).toBe(429);
    expect(res.body.message).toBe('Too many requests, please try again later.');
  }, 10000);

  it('should enforce strict limit of 5 on /auth/login', async () => {
    // We use a different IP here so the global limit exhausted in the previous test doesn't interfere
    for (let i = 0; i < 5; i++) {
      await request(app).post('/auth/login').set('X-Forwarded-For', '2.2.2.2').send({ email: 'test@test.com', password: 'password' });
    }
    const res = await request(app).post('/auth/login').set('X-Forwarded-For', '2.2.2.2').send({ email: 'test@test.com', password: 'password' });
    expect(res.status).toBe(429);
    expect(res.body.message).toBe('Too many login attempts, try again later.');
  });
});
