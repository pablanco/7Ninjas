import * as express from 'express';
import * as path from 'path';
import * as log4js from 'log4js';

// Import objetcs
import { DummyPromise } from '../shared/promises.shared';
import { Comment } from '../models/comment.model';
import { GetPlanetApi } from '../shared/star-wars-api';

// Import redis service
import { Redis } from '../db/redis.service';

// Get the logger
const logger = log4js.getLogger('Server');

export function CommentService(app: express.Application) {

    app.get('/api/comments',
        (req: express.Request, res: express.Response, next: any) => {

        logger.info('Requested ' + req.method + ' for \'' + req.path + '\'');
        // Star with dummy promise to make try-catch
        DummyPromise()
        .then(
            result => {
                // Obtains comments from redis
                return GetComments();
            }
        ).then(
            result => {
                res.json({status: true, description: 'OK', data: result});
        }).catch(
            err => {
                // Obtains mensajes de error
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'Error executing');

                // Write Log error
                logger.warn('Error processing \'' + req.path + '\': ' + errorMsg);

                // If response sent, stops
                if (res.headersSent) {
                    return;
                }
                // Returns data
                res.json({status: false, description: errorMsg, error: errorMsg});
            }
        );
    });

    app.post('/api/comments',
        (req: express.Request, res: express.Response, next: any) => {

        logger.info('Requested ' + req.method + ' for \'' + req.path + '\'');

        // Request incoming data
        const planetID: string = req.body.planetID;
        const text: string     = req.body.text;

        // Star with dummy promise to make try-catch
        DummyPromise()
        .then(
            result => {
                // Save comment to redis
                const comment: Comment = new Comment(planetID, text);
                return Redis.SaveComment(comment);
            }
        ).then(
            saved => {
                // Verifies if query fails
                if (!saved) { throw new Error('Could not save comment data'); }

                // If response sent, stops
                if (res.headersSent) { return; }

                // Send response
                res.json({status: true, description: 'OK' , data: saved});
            }
        ).catch(
            err => {
                // Obtains mensajes de error
                const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'Error executing');

                // Write Log error
                logger.warn('Error processing \'' + req.path + '\': ' + errorMsg);

                // If response sent, stops
                if (res.headersSent) {
                    return;
                }
                // Returns data
                res.json({status: false, description: errorMsg, error: errorMsg});
            }
        );
    });

}

export function GetComments (): Promise<Comment[]> {

    return Redis.GetComments()
    .then(
        (comment: Comment[]) => {
            // Check if data exist
            if (comment) {
                // Resturns result found
                return Promise.resolve(comment);
            } else {
                // Data not exists in DB
                throw new Error('GetComments no data found on DB.');
            }
        }
    ).catch(
        (err: any) => {
            // Obtains error message
            const errMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'Error executing');
            // Write to log
            logger.warn('Error executing GetComments: ' + errMsg);
            return Promise.reject(err);
        }
    );
}


