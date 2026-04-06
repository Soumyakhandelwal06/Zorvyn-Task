const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const signup = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: role || 'VIEWER',
      },
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        id: user.id,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Signup Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin functions for user management
const getAllUsers = async (req, res) => {
  const { page = 1, limit = 10, role, email } = req.query;
  const p = parseInt(page);
  const l = parseInt(limit);
  const skip = (p - 1) * l;

  try {
    const where = {};
    if (role) where.role = role;
    if (email) {
      where.email = { contains: email, mode: 'insensitive' };
    }

    const total = await prisma.user.count({ where });
    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: l,
    });

    res.json({
      data: users,
      total,
      page: p,
      totalPages: Math.ceil(total / l),
    });
  } catch (error) {
    console.error('Fetch Users Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['VIEWER', 'ANALYST', 'ADMIN'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, email: true, role: true }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update Role Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { signup, login, getAllUsers, updateUserRole };
