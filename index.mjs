import Redis from 'ioredis';
import { RedisMemoryServer } from 'redis-memory-server';

const redisServer = new RedisMemoryServer();
const host = await redisServer.getHost();
const port = await redisServer.getPort();
const redis = new Redis({
  host,
  port,
});

redis.set('mykey1', 'value');

redis.get('mykey1', (err, result) => {
  if (err) {
    console.error(err);
  } else {
    console.log(result); // Prints "value"
  }
});

redis.get('mykey1').then((result) => {
  console.log(result); // Prints "value"
});

redis.set('mykey2', 'hello', 'EX', 3);
setTimeout(() => {
  redis.get('mykey2').then((result) => {
    console.log(result); // Prints "value"
  });
}, 4 * 1000);

redis.zadd('sortedSet', 1, 'one', 2, 'dos', 4, 'quatro', 3, 'three');
redis.zrange('sortedSet', 0, 2, 'WITHSCORES').then((elements) => {
  console.log(elements);
});

setTimeout(async () => {
  if (redis) {
    redis.disconnect();
  }
  if (redisServer) {
    await redisServer.stop();
  }
}, 5 * 1000);
