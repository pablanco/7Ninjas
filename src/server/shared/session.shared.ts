import * as express from 'express';
import * as url from 'url';
import * as path from 'path';
import * as jwt from 'jsonwebtoken';
import * as log4js from 'log4js';

// Import configuration for JWT
import { JWT_SECRET } from '../config/jwt.config';

// Import dummy promises
import { DummyPromise } from '../shared/promises.shared';

// Get the logger
const logger = log4js.getLogger('Server');

export function ValidateUserSession(req: express.Request, res: express.Response, next: any) {

    // Only validates api a auth urls
    if (!req.url.match('^\/(api|auth)\/')) { console.log('>>>> ' + req.url); return next(); }
    // Session data obtained
    let requestSession: any;

    // Is request auth?
    const isLoginRequest: boolean = !!(req.url === '/api/auth/login');
    const isLogoutRequest: boolean = !!(req.url === '/api/auth/logout');

    // Si es un request de login no hace falta lo siguiente
    if (isLoginRequest) { return next(); }

    // User session
    let userId: string;

    // Star with dummy promise to make try-catch
    DummyPromise()
    .then(
        result => {
            // Obtains autentition token
            requestSession = (req.headers['authorization'] || '');
            requestSession = requestSession.replace('bearer ', '');
            requestSession = requestSession.replace(/"/g, '');

            // Check if token exist
            if (!requestSession) { throw new Error('Token not found for auth.'); }

            // Save the session to the app
            req.app.locals.session = requestSession;

            // Obtains user id
            userId = GetUserIdFromSession(req.app.locals.session);

            // Check userid not null
            if (!userId) { throw new Error('UserId Not valid or empty'); }

            // Save the user id to the app
            req.app.locals.userId = userId;

            // return user
            return userId;
        }
    ).then(
        result => {
            // If result, valid session
            if (result) { return next(); }
        }
    ).catch(
        (err: any) => {
            // Obtains error message
            const errMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'Error executing');

            // Write to log
            logger.error('Error processing \'' + req.path + '\': ' + errMsg);

            // If response sent, stops
            if (res.headersSent) { return; }

            // Returns 401 if not valid token
            res.status(401).json({description: 'Invalid session token', error: 'Invalid session'});

        }
    );
}

export function GetUserIdFromSession(session: string): string {

    try {
        // If no session retuns
        if (session) {
            // Clear user token
            const decoded: any = jwt.verify(session, JWT_SECRET);
            // Returns user id decoded
            if (decoded.userId) { return decoded.userId.toLowerCase(); }
        }
    } catch (err) {
        // Obtains error message
        const errMsg: string = (typeof err === 'string' ? err : err.message || err.description || '');
        // Write to log
        logger.error('Error decoding session: ' + errMsg);
    }
    // User not found
    return null;
}
