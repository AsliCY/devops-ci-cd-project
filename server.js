const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Güvenlik
app.use(cors()); // CORS
app.use(morgan('combined')); // Logging
app.use(express.json()); // JSON parser

// Basit veri deposu (gerçek projede veritabanı kullanın)
let users = [
  { id: 1, name: 'Ali Veli', email: 'ali@example.com', createdAt: new Date() },
  { id: 2, name: 'Ayşe Yılmaz', email: 'ayse@example.com', createdAt: new Date() }
];

// Routes

// Health Check - CI/CD için önemli
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Ana sayfa
app.get('/', (req, res) => {
  res.json({
    message: 'DevOps CI/CD Projesi API',
    version: '1.0.0',
    endpoints: [
      'GET /api/health',
      'GET /api/users',
      'POST /api/users',
      'GET /api/users/:id',
      'PUT /api/users/:id',
      'DELETE /api/users/:id'
    ]
  });
});

// Kullanıcıları listele
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    count: users.length,
    data: users
  });
});

// Tek kullanıcı getir
app.get('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find(u => u.id === id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'Kullanıcı bulunamadı'
    });
  }
  
  res.json({
    success: true,
    data: user
  });
});

// Yeni kullanıcı ekle
app.post('/api/users', (req, res) => {
  const { name, email } = req.body;
  
  // Basit validasyon
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Ad ve email gerekli'
    });
  }
  
  const newUser = {
    id: users.length + 1,
    name,
    email,
    createdAt: new Date()
  };
  
  users.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'Kullanıcı başarıyla eklendi',
    data: newUser
  });
});

// Kullanıcı güncelle
app.put('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Kullanıcı bulunamadı'
    });
  }
  
  const { name, email } = req.body;
  
  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  users[userIndex].updatedAt = new Date();
  
  res.json({
    success: true,
    message: 'Kullanıcı güncellendi',
    data: users[userIndex]
  });
});

// Kullanıcı sil
app.delete('/api/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex(u => u.id === id);
  
  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Kullanıcı bulunamadı'
    });
  }
  
  users.splice(userIndex, 1);
  
  res.json({
    success: true,
    message: 'Kullanıcı silindi'
  });
});

// 404 handler - Wildcard route'u daha güvenli hale getir
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint bulunamadı: ${req.method} ${req.path}`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Sunucu hatası'
  });
});

// Server başlat
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Server ${PORT} portunda çalışıyor`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  });
}

module.exports = app;