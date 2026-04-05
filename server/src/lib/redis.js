// Mock Redis implementation for local development without actual Redis server installed.
const mockCache = new Map();

const redisClient = {
  get: async (key) => {
    const data = mockCache.get(key);
    if (!data) return null;
    if (data.expiry && Date.now() > data.expiry) {
      mockCache.delete(key);
      return null;
    }
    return data.value;
  },
  setEx: async (key, durationSeconds, value) => {
    mockCache.set(key, {
      value,
      expiry: Date.now() + (durationSeconds * 1000)
    });
  },
  del: async (key) => {
    mockCache.delete(key);
  },
  connect: async () => {
    console.log('Mock Redis connected');
  },
  on: (event, handler) => {}
};

module.exports = redisClient;
