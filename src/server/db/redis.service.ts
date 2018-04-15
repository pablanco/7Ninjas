import * as PlanetRedis from './redis/planet.redis';
import * as CommentRedis from './redis/comment.redis';

// Exports redis functions in the same object
const Redis: any = {};
Object.assign(
    Redis,
    PlanetRedis,
    CommentRedis
);

export { Redis };
