// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  await db.collection('users').createIndex({ email: 1 }, { unique: true });

  await db.collection('notes').deleteMany({});
  await db.collection('tasks').deleteMany({});
  await db.collection('projects').deleteMany({});
  await db.collection('users').deleteMany({});

  const [amiraHash, bilalHash] = await Promise.all([
    bcrypt.hash('password123', 10),
    bcrypt.hash('studyhard456', 10)
  ]);

  const usersResult = await db.collection('users').insertMany([
    {
      email: 'amira@example.com',
      passwordHash: amiraHash,
      name: 'Amira Khan',
      createdAt: new Date('2026-04-01T09:00:00Z')
    },
    {
      email: 'bilal@example.com',
      passwordHash: bilalHash,
      name: 'Bilal Ahmed',
      createdAt: new Date('2026-04-02T10:30:00Z')
    }
  ]);

  const amiraId = usersResult.insertedIds['0'];
  const bilalId = usersResult.insertedIds['1'];

  const projectsResult = await db.collection('projects').insertMany([
    {
      ownerId: amiraId,
      name: 'Final Year Project',
      description: 'Build the database and dashboard for the capstone app.',
      archived: false,
      createdAt: new Date('2026-04-03T08:00:00Z')
    },
    {
      ownerId: amiraId,
      name: 'Exam Prep',
      description: 'Track revision topics and practice sessions.',
      archived: false,
      createdAt: new Date('2026-04-04T11:15:00Z')
    },
    {
      ownerId: bilalId,
      name: 'Freelance Website',
      description: 'Client redesign with a content handoff checklist.',
      archived: false,
      createdAt: new Date('2026-04-05T13:45:00Z')
    },
    {
      ownerId: bilalId,
      name: 'Personal Admin',
      description: 'Bills, errands, and life logistics.',
      archived: true,
      createdAt: new Date('2026-04-06T07:20:00Z')
    }
  ]);

  const finalYearProjectId = projectsResult.insertedIds['0'];
  const examPrepId = projectsResult.insertedIds['1'];
  const freelanceWebsiteId = projectsResult.insertedIds['2'];
  const personalAdminId = projectsResult.insertedIds['3'];

  await db.collection('tasks').insertMany([
    {
      ownerId: amiraId,
      projectId: finalYearProjectId,
      title: 'Design MongoDB collections',
      status: 'in-progress',
      priority: 5,
      tags: ['database', 'backend', 'urgent'],
      subtasks: [
        { title: 'List entities', done: true },
        { title: 'Choose embed vs reference', done: true },
        { title: 'Draft schema notes', done: false }
      ],
      dueDate: new Date('2026-04-28T12:00:00Z'),
      createdAt: new Date('2026-04-10T09:00:00Z')
    },
    {
      ownerId: amiraId,
      projectId: finalYearProjectId,
      title: 'Implement dashboard aggregations',
      status: 'todo',
      priority: 4,
      tags: ['mongodb', 'aggregation'],
      subtasks: [
        { title: 'Count tasks by status', done: false },
        { title: 'Join project names', done: false }
      ],
      createdAt: new Date('2026-04-12T14:30:00Z')
    },
    {
      ownerId: amiraId,
      projectId: finalYearProjectId,
      title: 'Prepare demo screenshots',
      status: 'done',
      priority: 2,
      tags: ['submission', 'screenshots'],
      subtasks: [
        { title: 'Open dashboard', done: true },
        { title: 'Capture aggregation result', done: true }
      ],
      createdAt: new Date('2026-04-15T16:00:00Z')
    },
    {
      ownerId: amiraId,
      projectId: examPrepId,
      title: 'Revise transaction schedules',
      status: 'todo',
      priority: 3,
      tags: ['dbms', 'revision'],
      subtasks: [
        { title: 'Read lecture slides', done: false },
        { title: 'Solve past paper question', done: false }
      ],
      createdAt: new Date('2026-04-11T07:45:00Z')
    },
    {
      ownerId: amiraId,
      projectId: examPrepId,
      title: 'Practice aggregation pipelines',
      status: 'in-progress',
      priority: 4,
      tags: ['mongodb', 'practice'],
      subtasks: [
        { title: 'Match and group examples', done: true },
        { title: 'Lookup and unwind examples', done: false }
      ],
      dueDate: new Date('2026-04-30T18:00:00Z'),
      createdAt: new Date('2026-04-18T10:20:00Z')
    },
    {
      ownerId: bilalId,
      projectId: freelanceWebsiteId,
      title: 'Collect homepage copy',
      status: 'done',
      priority: 2,
      tags: ['content', 'client'],
      subtasks: [
        { title: 'Request final headline', done: true },
        { title: 'Approve service blurbs', done: true }
      ],
      createdAt: new Date('2026-04-09T12:00:00Z')
    },
    {
      ownerId: bilalId,
      projectId: freelanceWebsiteId,
      title: 'Optimize image delivery',
      status: 'in-progress',
      priority: 4,
      tags: ['frontend', 'performance'],
      subtasks: [
        { title: 'Compress hero assets', done: true },
        { title: 'Test lazy loading', done: false }
      ],
      createdAt: new Date('2026-04-17T09:40:00Z')
    },
    {
      ownerId: bilalId,
      projectId: personalAdminId,
      title: 'Pay electricity bill',
      status: 'todo',
      priority: 5,
      tags: ['finance', 'home'],
      subtasks: [
        { title: 'Check due amount', done: false }
      ],
      createdAt: new Date('2026-04-08T06:30:00Z')
    }
  ]);

  await db.collection('notes').insertMany([
    {
      ownerId: amiraId,
      projectId: finalYearProjectId,
      title: 'Schema idea',
      body: 'Keep subtasks embedded in tasks because they are always displayed and updated with the parent task.',
      tags: ['database', 'design'],
      createdAt: new Date('2026-04-10T10:00:00Z')
    },
    {
      ownerId: amiraId,
      projectId: examPrepId,
      title: 'Revision reminder',
      body: 'Focus on $lookup, $unwind, and $group examples before the quiz.',
      tags: ['revision', 'mongodb'],
      createdAt: new Date('2026-04-18T11:00:00Z')
    },
    {
      ownerId: amiraId,
      title: 'General productivity',
      body: 'Batch similar tasks together in the evening to reduce context switching.',
      tags: ['ideas', 'habits'],
      createdAt: new Date('2026-04-19T19:15:00Z')
    },
    {
      ownerId: bilalId,
      projectId: freelanceWebsiteId,
      title: 'Client call notes',
      body: 'Client prefers lighter colors and wants the contact section above the footer.',
      tags: ['client', 'design'],
      createdAt: new Date('2026-04-16T15:30:00Z')
    },
    {
      ownerId: bilalId,
      title: 'Weekend errands',
      body: 'Pick up printouts, renew library card, and buy stationery.',
      tags: ['home', 'errands'],
      createdAt: new Date('2026-04-20T08:45:00Z')
    },
    {
      ownerId: bilalId,
      projectId: personalAdminId,
      title: 'Budget idea',
      body: 'Track monthly recurring bills in one sheet and archive paid receipts.',
      tags: ['finance', 'planning'],
      createdAt: new Date('2026-04-21T13:10:00Z')
    }
  ]);

  console.log('Seed data inserted successfully.');
  process.exit(0);
})();
