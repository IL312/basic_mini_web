require('dotenv').config({ quiet: true });

const app = require('./app');
const db = require('./config/db');

const PORT = Number(process.env.PORT || 5000);

if (!Number.isInteger(PORT) || PORT <= 0) {
  throw new Error('Переменная окружения PORT должна быть положительным числом');
}

const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

let shuttingDown = false;

async function shutdown(signal) {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;

  console.log(`${signal} received. Starting graceful shutdown...`);

  server.close(async () => {
    try {
      await db.$pool.end();
      console.log('Database pool closed');
      process.exit(0);
    } catch (error) {
      console.error('Error during graceful shutdown:', error);
      process.exit(1);
    }
  });

  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000).unref();
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
  process.exit(1);
});