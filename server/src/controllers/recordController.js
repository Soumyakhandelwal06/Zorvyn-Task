const prisma = require('../lib/prisma');
const redisClient = require('../lib/redis');
const { Parser } = require('json2csv');

const invalidateCache = async (userId) => {
  try {
    await redisClient.del(`dashboard_summary_${userId}`);
    await redisClient.del(`dashboard_summary_global`);
  } catch (error) {
    console.error('Redis Cache Invalidation Error', error);
  }
};

const createRecord = async (req, res) => {
  const { amount, type, category, date, description } = req.body;

  try {
    const record = await prisma.financialRecord.create({
      data: {
        amount: parseFloat(amount),
        type,
        category,
        date: date ? new Date(date) : new Date(),
        description,
        userId: req.user.id,
      },
    });

    // Audit Log for CREATE
    await prisma.auditLog.create({
      data: {
        action: 'CREATE',
        resourceId: record.id,
        newData: JSON.stringify(record),
        userId: req.user.id,
      }
    });

    await invalidateCache(req.user.id);
    res.status(201).json(record);
  } catch (error) {
    console.error('Create Record Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRecords = async (req, res) => {
  const { category, type, startDate, endDate } = req.query;

  const where = {};
  if (category) where.category = category;
  if (type) where.type = type;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  try {
    const records = await prisma.financialRecord.findMany({
      where,
      orderBy: { date: 'desc' },
      include: {
        user: {
          select: { email: true, role: true },
        },
      },
    });

    res.json(records);
  } catch (error) {
    console.error('Get Records Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getRecordById = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await prisma.financialRecord.findUnique({
      where: { id },
      include: {
        user: {
          select: { email: true, role: true },
        },
      },
    });

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(record);
  } catch (error) {
    console.error('Get Record By ID Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateRecord = async (req, res) => {
  const { id } = req.params;
  const { amount, type, category, date, description } = req.body;

  try {
    const oldRecord = await prisma.financialRecord.findUnique({ where: { id } });
    if (!oldRecord) return res.status(404).json({ message: 'Record not found' });

    const record = await prisma.financialRecord.update({
      where: { id },
      data: {
        amount: amount ? parseFloat(amount) : undefined,
        type,
        category,
        date: date ? new Date(date) : undefined,
        description,
      },
    });

    // Audit Log for UPDATE
    await prisma.auditLog.create({
      data: {
        action: 'UPDATE',
        resourceId: record.id,
        oldData: JSON.stringify(oldRecord),
        newData: JSON.stringify(record),
        userId: req.user.id,
      }
    });

    await invalidateCache(record.userId);
    res.json(record);
  } catch (error) {
    console.error('Update Record Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteRecord = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await prisma.financialRecord.findUnique({ where: { id }});
    if (record) {
      await prisma.financialRecord.delete({ where: { id } });
      
      // Audit Log for DELETE
      await prisma.auditLog.create({
        data: {
          action: 'DELETE',
          resourceId: record.id,
          oldData: JSON.stringify(record),
          userId: req.user.id,
        }
      });

      await invalidateCache(record.userId);
    }
    res.json({ message: 'Record deleted successfully' });
  } catch (error) {
    console.error('Delete Record Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const exportCSV = async (req, res) => {
  try {
    const records = await prisma.financialRecord.findMany({
      orderBy: { date: 'desc' },
      include: {
        user: { select: { email: true } },
      },
    });

    const fields = [
      { label: 'Date', value: (row) => new Date(row.date).toISOString().split('T')[0] },
      'user.email',
      'type',
      'category',
      'amount',
      'description',
    ];

    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(records);

    res.header('Content-Type', 'text/csv');
    res.attachment('financial_records.csv');
    return res.send(csv);
  } catch (error) {
    console.error('Export CSV Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRecord,
  getRecords,
  getRecordById,
  updateRecord,
  deleteRecord,
  exportCSV,
};
