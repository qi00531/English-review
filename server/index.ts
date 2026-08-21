import { serve } from '@hono/node-server';
import { Hono } from 'hono';

const app = new Hono();
app.get('/api/health', (context) => context.json({ status: 'ok' }));

serve({ fetch: app.fetch, port: 8787 });
