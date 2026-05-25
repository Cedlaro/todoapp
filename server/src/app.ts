import path from 'path';
import fs from 'fs';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import taskRoutes from './routes/task.routes';

const app = express();
const isProd = process.env.NODE_ENV === 'production';

if (!isProd) {
  app.use(cors({
    origin: process.env.CLIENT_ORIGIN ?? 'http://localhost:4200',
    credentials: true,
  }));
}

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

if (isProd) {
  // Angular build output — new application builder puts files in browser/
  const browserDir = path.join(__dirname, '../../dist/todo/browser');
  const fallbackDir = path.join(__dirname, '../../dist/todo');
  const staticDir = fs.existsSync(browserDir) ? browserDir : fallbackDir;

  app.use(express.static(staticDir));

  // SPA fallback — any non-API route returns index.html
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

export default app;
