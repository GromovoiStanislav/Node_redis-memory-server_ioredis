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

redis.set('mykey2', 'hello', 'EX', 10);
setTimeout(() => {
  redis.get('mykey2').then((result) => {
    console.log(result); // Prints "value"
  });
}, 15 * 1000);

///////////////
// if (redis) {
//   redis.disconnect();
// }
// if (redisServer) {
//   await redisServer.stop();
// }
