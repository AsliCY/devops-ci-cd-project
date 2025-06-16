const request = require('supertest');
const app = require('../server');

describe('DevOps CI/CD API Tests', () => {
  
  // Health Check Tests
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);
      
      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('version');
    });
  });

  // Ana sayfa testi
  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);
      
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('endpoints');
      expect(Array.isArray(response.body.endpoints)).toBe(true);
    });
  });

  // Users API Tests
  describe('Users API', () => {
    
    describe('GET /api/users', () => {
      it('should return all users', async () => {
        const response = await request(app)
          .get('/api/users')
          .expect(200);
        
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('count');
        expect(response.body).toHaveProperty('data');
        expect(Array.isArray(response.body.data)).toBe(true);
      });
    });

    describe('POST /api/users', () => {
      it('should create a new user', async () => {
        const newUser = {
          name: 'Test User',
          email: 'test@example.com'
        };

        const response = await request(app)
          .post('/api/users')
          .send(newUser)
          .expect(201);
        
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('name', newUser.name);
        expect(response.body.data).toHaveProperty('email', newUser.email);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('createdAt');
      });

      it('should return 400 if name is missing', async () => {
        const invalidUser = {
          email: 'test@example.com'
        };

        const response = await request(app)
          .post('/api/users')
          .send(invalidUser)
          .expect(400);
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message');
      });

      it('should return 400 if email is missing', async () => {
        const invalidUser = {
          name: 'Test User'
        };

        const response = await request(app)
          .post('/api/users')
          .send(invalidUser)
          .expect(400);
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message');
      });
    });

    describe('GET /api/users/:id', () => {
      it('should return a specific user', async () => {
        const response = await request(app)
          .get('/api/users/1')
          .expect(200);
        
        expect(response.body).toHaveProperty('success', true);
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('id', 1);
      });

      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .get('/api/users/999')
          .expect(404);
        
        expect(response.body).toHaveProperty('success', false);
        expect(response.body).toHaveProperty('message');
      });
    });

    describe('PUT /api/users/:id', () => {
      it('should update an existing user', async () => {
        const updateData = {
          name: 'Updated Name'
        };

        const response = await request(app)
          .put('/api/users/1')
          .send(updateData)
          .expect(200);
        
        expect(response.body).toHaveProperty('success', true);
        expect(response.body.data).toHaveProperty('name', updateData.name);
        expect(response.body.data).toHaveProperty('updatedAt');
      });

      it('should return 404 for non-existent user', async () => {
        const updateData = {
          name: 'Updated Name'
        };

        const response = await request(app)
          .put('/api/users/999')
          .send(updateData)
          .expect(404);
        
        expect(response.body).toHaveProperty('success', false);
      });
    });

    describe('DELETE /api/users/:id', () => {
      it('should return 404 for non-existent user', async () => {
        const response = await request(app)
          .delete('/api/users/999')
          .expect(404);
        
        expect(response.body).toHaveProperty('success', false);
      });
    });
  });

  // 404 Test
  describe('404 Handler', () => {
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app)
        .get('/unknown-endpoint')
        .expect(404);
      
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message');
    });
  });
});