import * as express from 'express';
import * as redis from 'redis';
import * as path from 'path';
import * as bluebird from 'bluebird';
import * as log4js from 'log4js';

// Import configuration for Redis
import { REDIS_OPTIONS } from '../config/redis.config';

// Import services
import { PlanetRedis } from './redis/planet.redis';
import { CommentRedis } from './redis/comment.redis';

// Get the logger
const logger = log4js.getLogger('Server');

// Init connection function
export function RedisInit(app: express.Application): Promise<boolean> {

    // Build promises
    return new Promise<boolean>((resolve, reject) => {

        // Write log
        logger.info('Initializing Redis connection');

        // Init redis connection
        const redisClient: redis.RedisClient = redis.createClient(REDIS_OPTIONS)
        .on('error', function (err: any) {
            // Obtains error message
            const errMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'Error with request');

            // Write log
            logger.error('Redis could not be initialized: ' + errMsg);

            // Send error
            reject(err);
        })
        .on('connect', function () {
            // Write log
            logger.info('Redis connection established');

            // Resolve promise
            resolve(true);
        });

        // Redis function to promieses
        bluebird.promisifyAll(redisClient);

        // Set the connection to an object
        app.set('redisClient', redisClient);

        // Initizalize redis services
        PlanetRedis(app);
        CommentRedis(app);
    });
}
