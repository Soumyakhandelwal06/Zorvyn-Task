const prisma = require('../lib/prisma');
const redisClient = require('../lib/redis');

const getDashboardSummary = async (req, res) => {
  try {
    const cacheKey = `dashboard_summary_${req.user?.id || 'global'}`;
    
    // Check if data exists in Redis
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log(`[DASHBOARD-AUDIT] Serving from Redis cache for key: ${cacheKey}`);
      return res.json(JSON.parse(cachedData));
    }

    console.log(`[DASHBOARD-AUDIT] Fetching fresh data from Prisma for user: ${req.user?.id || 'GLOBAL'}`);

    const aggregations = await prisma.financialRecord.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: 'INCOME',
      },
    });

    const totalIncome = aggregations._sum.amount || 0;
    console.log(`[DASHBOARD-AUDIT] Aggregated Total Income: ${totalIncome}`);

    const expenseAggregations = await prisma.financialRecord.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        type: 'EXPENSE',
      },
    });

    const totalExpenses = expenseAggregations._sum.amount || 0;
    const netBalance = totalIncome - totalExpenses;
    console.log(`[DASHBOARD-AUDIT] Aggregated Total Expenses: ${totalExpenses}, Net: ${netBalance}`);

    const categoryTotals = await prisma.financialRecord.groupBy({
      by: ['category', 'type'],
      _sum: {
        amount: true,
      },
    });

    // Recent activity (last 5 records)
    const recentActivity = await prisma.financialRecord.findMany({
      take: 5,
      orderBy: { date: 'desc' },
      include: {
        user: { select: { email: true } },
      },
    });

    // Smart Insight Calculation (Bonus)
    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    const currentMonthExpensesAgg = await prisma.financialRecord.aggregate({
      _sum: { amount: true },
      where: { type: 'EXPENSE', date: { gte: startOfCurrentMonth } }
    });
    const currentMonthExpenses = currentMonthExpensesAgg._sum.amount || 0;

    const prevMonthExpensesAgg = await prisma.financialRecord.aggregate({
      _sum: { amount: true },
      where: { type: 'EXPENSE', date: { gte: startOfPrevMonth, lte: endOfPrevMonth } }
    });
    const prevMonthExpenses = prevMonthExpensesAgg._sum.amount || 0;

    let smartInsight = "Great job tracking your finances!";
    if (prevMonthExpenses > 0) {
      const diff = currentMonthExpenses - prevMonthExpenses;
      const percentage = ((diff / prevMonthExpenses) * 100).toFixed(0);
      if (percentage > 0) {
        smartInsight = `Watch out, you spent ${percentage}% more this month than last month.`;
      } else if (percentage < 0) {
        smartInsight = `Awesome! Your expenses are down ${Math.abs(percentage)}% compared to last month.`;
      } else {
        smartInsight = `Your spending is exactly on track with last month.`;
      }
    } else if (currentMonthExpenses > 0) {
      smartInsight = `You've tracked your first expenses this month. Keep it up!`;
    }

    const responseData = {
      totalIncome,
      totalExpenses,
      netBalance,
      categoryTotals,
      recentActivity,
      smartInsight
    };

    // Cache the data for 5 minutes (300 seconds)
    await redisClient.setEx(cacheKey, 300, JSON.stringify(responseData));

    res.json(responseData);
  } catch (error) {
    console.error('Dashboard Summary Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getTrends = async (req, res) => {
  try {
    // Basic trend analysis: Group by month/year
    // Note: Prisma 7 doesn't have native 'date_trunc' in groupBy yet without raw SQL
    // We'll fetch all records for the last 6 months and aggregate in JS for simplicity
    // OR use raw query if needed. Let's start with a fetch.

    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const records = await prisma.financialRecord.findMany({
      where: {
        date: { gte: sixMonthsAgo },
      },
      select: { amount: true, type: true, date: true },
    });

    // Process trends in JS
    const trendsMap = records.reduce((acc, curr) => {
      const monthKey = `${curr.date.getFullYear()}-${String(curr.date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = curr.date.toLocaleString('default', { month: 'short', year: 'numeric' });
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          month: monthLabel, 
          income: 0, 
          expense: 0,
          sortKey: monthKey 
        };
      }
      
      if (curr.type === 'INCOME') acc[monthKey].income += curr.amount;
      else acc[monthKey].expense += curr.amount;
      return acc;
    }, {});

    // Sort by chronological key
    const sortedTrends = Object.values(trendsMap).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

    res.json(sortedTrends);
  } catch (error) {
    console.error('Trends Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getDashboardSummary, getTrends };
