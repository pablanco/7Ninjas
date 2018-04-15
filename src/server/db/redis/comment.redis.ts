import * as express from 'express';
import * as crypto from 'crypto';
import * as moment from 'moment';
import * as log4js from 'log4js';

// Import configuration for Redis
import { REDIS_DATA_PERSISTENCE } from '../../config/redis.config';
import { Comment } from '../../models/comment.model';

// Connection to Redis
let redisClient: any;

// Get the logger
const logger = log4js.getLogger('Server');

export function CommentRedis(app: express.Application) {
    // Obtains connection to Redis
    redisClient = app.get('redisClient');
}
/////////////////////////////////
// Redis data access functions //
/////////////////////////////////

export function SaveComment(comment: Comment): Promise<boolean> {

    // Checks null hash
    if (!comment || !comment.planetID || !comment.text) {
        throw new Error('Try to save nulled key registry');
    }
    const nowUtc: Date = moment().utc().toDate();

    // Update data
    return redisClient.hsetAsync('Comment', nowUtc, JSON.stringify(comment))
        .then(
            (result: any) => {
                // Updates hash expiration time
                return redisClient.expireAsync('Comment', REDIS_DATA_PERSISTENCE);
            }
        ).then(
            (result: any) => {
                // Resturns result
                return Promise.resolve(true);
            }
        ).catch(
        (err: any) => {
            // Obtains error message
            const errorMsg: string = 'Error executing: '
                + (err ? typeof err === 'string' ? err : err.message || err.description || '' : '');

            // Write Log error
            logger.warn(errorMsg);

            // Makes reject returns the error
            return Promise.reject(err);
        }
        );
}

export function GetComments (): Promise<Comment[]> {

    // Query to Redis data
    return redisClient.hgetallAsync('Comment')
    .then(
        (result: any) => {
            const comment: Comment[] = [];
            for (const id in result) {
                if (result.hasOwnProperty(id)) {
                    comment.push(JSON.parse(result[id]));
                }
            }
            return Promise.resolve(comment);
        }
    ).catch(
        (err: any) => {
            // Obtains error message
            const errorMsg: string = 'Error executing: '
            + ( err ? typeof err === 'string' ? err : err.message || err.description || '' : '');

            // Makes reject returns the error
            return Promise.reject(err);
        }
    );
}
