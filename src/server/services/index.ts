import * as express from 'express';
import * as log4js from 'log4js';

// Get the logger
const logger = log4js.getLogger('Server');

// Services
import { PlanetService } from './planet.service';
import { CommentService } from './comment.service';
import { UserService } from './user.service';

export function init(app: express.Application) {
    // Write to log
    logger.info('Initializing app services');
    // Initialize services
    PlanetService(app);
    CommentService(app);
    UserService(app);
}
