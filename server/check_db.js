const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const count = await prisma.financialRecord.count();
  console.log('Record Count:', count);
  
  if (count > 0) {
    const firstFive = await prisma.financialRecord.findMany({ take: 5 });
    console.log('First 5 records:', JSON.stringify(firstFive, null, 2));
  }

  const users = await prisma.user.count();
  console.log('User Count:', users);

  const logs = await prisma.auditLog.count();
  console.log('Audit Log Count:', logs);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
