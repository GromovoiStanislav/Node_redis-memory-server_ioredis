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

redis.del('mykey1');
redis.get('mykey1').then((result) => {
  console.log(result); // Prints "null"
});

redis.set('mykey2', 'hello', 'EX', 3); //Удалится через 3 сек
setTimeout(() => {
  redis.get('mykey2').then((result) => {
    console.log(result); // Prints "null"
  });
}, 4 * 1000);

//Сортированный список
redis.zadd('sortedSet', 1, 'one', 2, 'dos', 4, 'quatro', 3, 'three');
redis.zrange('sortedSet', 0, 2, 'WITHSCORES').then((elements) => {
  console.log(elements);
});

//Конвеер
const pipeline = redis.pipeline();
pipeline.set('foo', 'bar');
pipeline.del('cc');
pipeline.exec((err, results) => {
  console.log(results); //Print [ [ null, 'OK' ], [ null, 0 ] ]
});

const promise = redis.pipeline().set('foo', 'bar').get('foo').exec();
promise.then((results) => {
  console.log(results); //[Print [ null, 'OK' ], [ null, 'bar' ] ]
});

redis
  .pipeline()
  .set('foo', 'bar')
  .get('foo', (err, result) => {
    console.log(result); //Print 'bar'
  })
  .exec((err, results) => {
    console.log(results); //[Print [ null, 'OK' ], [ null, 'bar' ] ]
    console.log(results[1][1]); //'/Print 'bar'
  });

redis
  .pipeline([
    ['set', 'foo', 'bar'],
    ['get', 'foo'],
  ])
  .exec((err, results) => {
    console.log(results); //[Print [ null, 'OK' ], [ null, 'bar' ] ]
  });

//Exit
setTimeout(async () => {
  if (redis) {
    redis.disconnect();
  }
  if (redisServer) {
    await redisServer.stop();
  }
}, 10 * 1000);
