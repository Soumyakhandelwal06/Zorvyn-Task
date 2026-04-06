const prisma = require('../lib/prisma');

const getAuditLogs = async (req, res) => {
  const { page = 1, limit = 10, action, resourceId } = req.query;
  const p = parseInt(page);
  const l = parseInt(limit);
  const skip = (p - 1) * l;

  try {
    const where = {};
    if (action) where.action = action;
    if (resourceId) {
      where.resourceId = { contains: resourceId, mode: 'insensitive' };
    }

    const total = await prisma.auditLog.count({ where });
    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: l,
      include: {
        user: { select: { email: true } },
      },
    });

    res.json({
      data: logs,
      total,
      page: p,
      totalPages: Math.ceil(total / l),
    });
  } catch (error) {
    console.error('Get Audit Logs Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getAuditLogs };
