const { drizzle } = require('drizzle-orm/postgres-js');
const postgres = require('postgres');
const { eq } = require('drizzle-orm');
const schema = require('./schema.ts');
const { groups } = schema;
const dotenv = require('dotenv');
dotenv.config();
// https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786


const client = postgres(process.env.DATABASE_URL);

const db = drizzle(client, { schema });

const isGroupInDB = async (groupId = 'knft1') => {
  const group = await db.select().from(groups).where(eq(groups.group_id, groupId));
  return group.length > 0;
};

module.exports = { db, isGroupInDB };
