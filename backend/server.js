const env = require('./src/config/env');
const app = require('./src/app');

async function start() {
  if (env.dbMode === 'mongo') {
    const { connectMongo } = require('./src/config/db');
    await connectMongo();
  } else {
    console.log('[db] using in-memory storage (DB_MODE=memory) — data will not persist across restarts');
  }

  app.listen(env.port, () => {
    console.log(`Concise API listening on http://localhost:${env.port}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
