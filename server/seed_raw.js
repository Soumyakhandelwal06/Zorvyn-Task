const { Client } = require('pg');
require('dotenv').config();

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('Connected to PostgreSQL for raw seeding...');

    // 1. Get Admin User
    const adminEmail = 'admin@zorvyn.com';
    const userRes = await client.query('SELECT id FROM "User" WHERE email = $1', [adminEmail]);
    let userId;

    if (userRes.rows.length === 0) {
      console.log('Creating admin user...');
      const createRes = await client.query(
        'INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) RETURNING id',
        [adminEmail, '$2b$10$JvUj/mKHQvcrf752abBfd.csIrhxTONCn3I6ZLCd.M1Bhwqadf21m', 'ADMIN']
      );
      userId = createRes.rows[0].id;
    } else {
      userId = userRes.rows[0].id;
    }

    console.log(`Using Admin User ID: ${userId}`);

    // 2. Create Additional Users
    const extraUsers = [
      { email: 'analyst_pro@zorvyn.com', role: 'ANALYST' },
      { email: 'sarah.viewer@zorvyn.com', role: 'VIEWER' },
      { email: 'john.doe@zorvyn.com', role: 'VIEWER' },
      { email: 'compliance_officer@zorvyn.com', role: 'VIEWER' },
    ];
    
    const additionalUserIds = [];
    for (const u of extraUsers) {
      const res = await client.query(
        'INSERT INTO "User" (id, email, password, role, "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, NOW(), NOW()) ON CONFLICT (email) DO NOTHING RETURNING id',
        [u.email, '$2b$10$JvUj/mKHQvcrf752abBfd.csIrhxTONCn3I6ZLCd.M1Bhwqadf21m', u.role]
      );
      
      if (res.rows.length > 0) {
        additionalUserIds.push(res.rows[0].id);
      } else {
        const fetchRes = await client.query('SELECT id FROM "User" WHERE email = $1', [u.email]);
        additionalUserIds.push(fetchRes.rows[0].id);
      }
    }
    console.log(`Created ${additionalUserIds.length} additional users.`);

    // 3. Clear existing records and logs
    await client.query('DELETE FROM "AuditLog"');
    await client.query('DELETE FROM "FinancialRecord"');
    console.log('Cleared existing records and logs.');

    // 3. Seed 50 records
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

    console.log('Seeding 50 records...');
    for (let i = 0; i < 50; i++) {
      const cat = categories[Math.floor(Math.random() * categories.length)];
      const amount = cat.type === 'INCOME' 
        ? Math.floor(Math.random() * 5000) + 1000 
        : Math.floor(Math.random() * 800) + 50;
      
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 180));

      await client.query(
        'INSERT INTO "FinancialRecord" (id, amount, type, category, date, description, "userId", "createdAt", "updatedAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, NOW(), NOW())',
        [amount, cat.type, cat.name, date, `Raw Demo ${cat.name} entry ${i}`, userId]
      );
    }
    
    // 5. Seed 20 Audit Logs
    console.log('Seeding 20 Audit Logs...');
    const auditActions = ['USER_LOGIN', 'RECORD_CREATED', 'ROLE_UPDATED', 'REPORT_EXPORTED', 'RECORD_DELETED'];
    for (let i = 0; i < 20; i++) {
        const action = auditActions[Math.floor(Math.random() * auditActions.length)];
        const date = new Date();
        date.setHours(date.getHours() - Math.floor(Math.random() * 48)); // Last 48 hours
        
        let oldData = null;
        let newData = null;
        
        if (action === 'ROLE_UPDATED') {
            oldData = JSON.stringify({ role: 'VIEWER' });
            newData = JSON.stringify({ role: 'ANALYST' });
        } else if (action === 'RECORD_CREATED') {
            newData = JSON.stringify({ amount: Math.floor(Math.random() * 500) + 50, type: 'EXPENSE' });
        }
        
        const actorId = i % 3 === 0 ? userId : additionalUserIds[Math.floor(Math.random() * additionalUserIds.length)];
        
        await client.query(
            'INSERT INTO "AuditLog" (id, action, "resourceId", "oldData", "newData", "userId", "createdAt") VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6)',
            [action, `res_${Math.floor(Math.random() * 10000)}`, oldData, newData, actorId, date]
        );
    }

    console.log('Seeding complete! Admin/Audit panels and Dashboard should now be fully populated.');
  } catch (err) {
    console.error('Raw Seed Error:', err);
  } finally {
    await client.end();
  }
}

main();
