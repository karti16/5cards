import { Hono } from 'hono';

export const testRoute = new Hono()
  .get('/', (c) => {
    return c.text('Hello, world!');
  })
  .post('/', (c) => {
    return c.json({ message: 'Post Hello, world!' });
  });
