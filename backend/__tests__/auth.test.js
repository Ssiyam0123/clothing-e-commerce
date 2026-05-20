import request from 'supertest';
import mongoose from 'mongoose';
import app from '../src/app.js';
import User from '../src/modules/user/user.model.js';

const testUser = {
  name: 'Testy McTestface',
  email: `test-${Date.now()}@example.com`,
  password: 'Password123!',
};

beforeAll(async () => {
  // Connect to the DB using process.env.MONGO_URI
  const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/clothing-e-commerce';
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Clean up test user and close connection
  await User.deleteMany({ email: { $regex: '^test-.*@example\\.com$' } });
  await mongoose.connection.close();
});

describe('🔐 Auth Integration Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should successfully register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email.toLowerCase());
    });

    it('should fail registration with a duplicate email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('already registered');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should successfully log in an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
      expect(res.body.user).toHaveProperty('email', testUser.email.toLowerCase());
    });

    it('should fail log in with incorrect credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'WrongPassword!',
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Invalid email or password');
    });
  });
});
