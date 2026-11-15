const { createClient } = require('redis');

let client = null;

const initRedis = async () => {
  const host = process.env.REDIS_HOST || 'localhost';
  const port = process.env.REDIS_PORT || 6379;
  client = createClient({
    url: `redis://${host}:${port}`,
  });

  client.on('error', (err) => {
    // suppress connection noise
  });

  try {
    await client.connect();
    console.log('Connected to Redis successfully');
  } catch (err) {
    console.warn('Could not connect to Redis, caching disabled:', err.message);
  }
};

const getCache = async (key) => {
  if (!client || !client.isOpen) return null;
  try {
    return await client.get(key);
  } catch (e) {
    return null;
  }
};

const setCache = async (key, value, expireInSeconds = 3600) => {
  if (!client || !client.isOpen) return;
  try {
    await client.setEx(key, expireInSeconds, value);
  } catch (e) {
    // ignore
  }
};

const delCache = async (key) => {
  if (!client || !client.isOpen) return;
  try {
    await client.del(key);
  } catch (e) {
    // ignore
  }
};

const flushCache = async () => {
  if (!client || !client.isOpen) return;
  try {
    await client.flushAll();
  } catch (e) {
    // ignore
  }
};

module.exports = {
  initRedis,
  getCache,
  setCache,
  delCache,
  flushCache,
};
