import * as express from 'express';
import * as moment from 'moment';
import * as path from 'path';
import * as log4js from 'log4js';
import * as jwt from 'jsonwebtoken';

// Import objetcs
import { DummyPromise } from '../shared/promises.shared';

// Get the logger
const logger = log4js.getLogger('Server');

// Import redis service
import { Redis } from '../db/redis.service';

// Import configuration for JWT
import { JWT_SECRET, JWT_EXPIRATION_TIME } from '../config/jwt.config';

export function UserService(app: express.Application) {

    app.post('/api/auth/login',
        (req: express.Request, res: express.Response, next: any) => {

            logger.info('Requested ' + req.method + ' for \'' + req.path + '\'');

            // Request incoming data
            const userId: string = req.body.userId;
            const password: string = req.body.password;

            // Session data
            let data: any;
            let sessionToken: string;

        // Star with dummy promise to make try-catch
        DummyPromise()
        .then(
            saved => {
                // Verifies if query fails
                if (userId !== password) { throw new Error('Wrong user login data.'); }

                // If response sent, stops
                if (res.headersSent) { return; }

                // Generates token session
                sessionToken = jwt.sign({userId: userId}, JWT_SECRET, {expiresIn: JWT_EXPIRATION_TIME});

                // Build object
                data = {
                    session: sessionToken,
                    loggedUser: {id: 1, lastName: 'Ford', name: userId, country: 'SW'}
                };

                // Send response
                res.json({status: true, description: 'OK' , data: data});
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
