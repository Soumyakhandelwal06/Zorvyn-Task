require('dotenv').config();
const prisma = require('./src/lib/prisma');

async function main() {
  const adminEmail = 'admin@zorvyn.com';
  let user = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!user) {
    console.log('User not found. Creating admin user...');
    user = await prisma.user.create({
      data: {
        email: adminEmail,
        password: 'admin123', // Note: In real app use hash. This is for quick demo seeding.
        role: 'ADMIN',
      }
    });
  }

  const userId = user.id;

  const categories = [
    { name: 'Salary', type: 'INCOME' },
    { name: 'Freelance', type: 'INCOME' },
    { name: 'Dividends', type: 'INCOME' },
    { name: 'Rent', type: 'EXPENSE' },
    { name: 'Groceries', type: 'EXPENSE' },
    { name: 'Utilities', type: 'EXPENSE' },
    { name: 'Entertainment', type: 'EXPENSE' },
    { name: 'Dining', type: 'EXPENSE' },
    { name: 'Transport', type: 'EXPENSE' },
    { name: 'Healthcare', type: 'EXPENSE' },
    { name: 'Shopping', type: 'EXPENSE' },
  ];

  console.log('Seeding financial records...');
  for (let i = 0; i < 50; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const amount = cat.type === 'INCOME' 
      ? Math.floor(Math.random() * 5000) + 1000 
      : Math.floor(Math.random() * 800) + 50;

    // Random date in last 6 months
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 180));

    await prisma.financialRecord.create({
      data: {
        amount,
        type: cat.type,
        category: cat.name,
        date: date,
        description: `Demo ${cat.name} entry ${i}`,
        userId: userId,
      }
    });
  }

  console.log('Seeding users...');
  for (let i = 0; i < 15; i++) {
    const email = `user${i}@demo.zorvyn.com`;
    const password = 'user123';
    const firstRole = i % 2 === 0 ? 'ANALYST' : 'VIEWER';
    
    const newUser = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        password,
        role: firstRole,
      }
    });

    // Seed some logs for each user
    await prisma.auditLog.create({
      data: {
        userId: user.id, // Corrected to use the UUID id of the logged-in admin user
        action: 'CREATE',
        resourceId: newUser.id,
        newData: JSON.stringify({ email: newUser.email, role: newUser.role }),
      }
    });
  }

  console.log('Seeding audit logs...');
  // Create random logs for variety
  const actions = ['CREATE', 'UPDATE', 'DELETE'];
  for (let i = 0; i < 60; i++) {
    await prisma.auditLog.create({
      data: {
        userId: user.id, // Corrected to use the UUID id
        action: actions[Math.floor(Math.random() * 3)],
        resourceId: `res-${Math.floor(Math.random() * 10000)}`,
        oldData: JSON.stringify({ field: 'value', id: i }),
        newData: JSON.stringify({ field: 'updated-value', id: i }),
      }
    });
  }

  console.log('Seeding complete! 50 records, 15 users, and 75 audit logs added.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
