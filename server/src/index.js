const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const rateLimit = require('express-rate-limit');
const authRoutes = require('./routes/authRoutes');
const recordRoutes = require('./routes/recordRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const auditRoutes = require('./routes/auditRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Global Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Apply rate limiting to all /api routes
app.use('/api', apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/audit', auditRoutes);

// Error Handler
app.use((err, req, res, next) => {
  console.error('GLOBAL ERROR:', err);
  res.status(500).json({
    message: 'Internal Server Error',
    error: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

app.get('/', (req, res) => {
  res.send('Finance Backend API is running...');
});

const prisma = require('./lib/prisma');
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`[BOOT] Server running on port ${PORT}`);
  console.log(`[BOOT] DATABASE_URL: ${process.env.DATABASE_URL?.substring(0, 20)}...`);
  
  try {
    const count = await prisma.financialRecord.count();
    console.log(`[BOOT] Database Heartbeat: Found ${count} financial records.`);
  } catch (err) {
    console.error(`[BOOT] Database Connection Error: ${err.message}`);
  }
});
