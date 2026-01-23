import { randomUUID } from 'crypto';
import 'dotenv/config';
import { hashPassword } from '../app/src/services/auth.service.js';
import { prisma } from './client.js';
import { AnalysisStatus } from './generated/prisma/index.js';

const TOTAL_RECORDS = 50;

const run = async () => {
  const password = 'not-a-real-password';
  const passwordHash = await hashPassword(password);
  const testUser = await prisma.user.create({
    data: {
      id: randomUUID(),
      email: `test-seed-${Date.now()}@example.com`,
      password: passwordHash,
    },
  });

  console.log(`Created test user: ${testUser.id} (${testUser.email})`);

  const now = new Date();
  const records = Array.from({ length: TOTAL_RECORDS }, (_, i) => {
    const daysAgo = Math.floor(i / 2); // ~2 records per day, spanning 25 days
    const committedAt = new Date(now);
    committedAt.setDate(committedAt.getDate() - daysAgo);
    committedAt.setHours(12 + (i % 2), 0, 0, 0); // stagger hours within the day

    return {
      id: randomUUID(),
      userId: testUser.id,
      status: AnalysisStatus.COMMITTED,
      mealTitle: `Meal ${i + 1}`,
      totalCalories: 200 + i * 10,
      committedAt,
      createdAt: committedAt,
    };
  });

  await prisma.ingredientAnalysis.createMany({ data: records });

  console.log(`Inserted ${TOTAL_RECORDS} analysis records`);
  console.log(`User ID for testing: ${testUser.id}`);
  console.log(
    `Date range: ${records[records.length - 1].committedAt.toISOString()} → ${records[0].committedAt.toISOString()}`
  );
};

run()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
