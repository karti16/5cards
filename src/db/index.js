import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { groups } from './schema';
import { eq } from 'drizzle-orm';

const client = createClient({
  url: import.meta.env.VITE_DATABASE_URL,
  authToken: import.meta.env.VITE_DATABASE_AUTH_TOKEN,
});
export const db = drizzle(client);

export const isGroupInDB = async (groupId) => {
  const group = await db.select().from(groups).where(eq(groups.group_id, groupId));
  console.log(group);
  return group.length > 0;
};
