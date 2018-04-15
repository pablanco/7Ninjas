import * as http from 'http';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as compression from 'compression';
import * as path from 'path';
import * as express from 'express';
import * as log4js from 'log4js';
import * as fs from 'fs';
import * as services from './services';
import * as sessionShared from './shared/session.shared';
import { RedisInit } from './db/redis.init';

// Import server config
import { SERVER_MODE, HTTP_BINDING_HOST, HTTP_BINDING_PORT } from './config/server.config';
import { LOGGER_CONFIG } from './config/logger.config';

// Obtains Express Application
const app: express.Express = express();
const port = process.env.PORT || '3000';
let httpServer: http.Server;

export function init() {

    // Client route
    const clientPath: string = '../client';

    // Obtains logs folder route
    const logsPath: string = path.resolve(__dirname, 'logs');

    // Create log folder if not exist
    if (!fs.existsSync(logsPath)) { fs.mkdirSync(logsPath); }

    // Initialize logs
    log4js.configure(LOGGER_CONFIG);

    // Get the logger
    const logger: log4js.Logger = log4js.getLogger('Server');

    // Service startup
    logger.info('********************************************************');
    logger.info('*                Initializing service                  *');
    logger.info('********************************************************');

    // Initialize middleware for request
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json({ limit: '5mb' }));
    app.use(bodyParser.text({ limit: '5mb' }));
    app.use(compression());

    // CORS for cookies
    const corsOptions: cors.CorsOptions = {
        origin: true,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE']
    };
    // Activate CORS for requests
    app.all('/api|auth', cors(corsOptions));

    // User validation function
    app.use(sessionShared.ValidateUserSession);

    // Services initialize
    services.init(app);

    // Initialize Redis service
    return RedisInit(app).then(
        result => {
            // Initialize HTTP service
            return new Promise<boolean>((resolve, reject) => {

                // Write log
                logger.info('Initializing HTTP service');

                // Create HTTP server
                httpServer = http.createServer(app);
                httpServer.listen(HTTP_BINDING_PORT, HTTP_BINDING_HOST)
                .on('listening', () => {
                    // Write log
                    logger.info('-------------- 7NinjaTest ----------------');
                    logger.info('HTTP service listening on: ' + httpServer.address().address + ':' + HTTP_BINDING_PORT.toString());
                    logger.info('---------------------------------------------');
                    resolve(true);
                });
            });
        }
    ).catch(
        err => {
            // Obtains error message
            const errorMsg: string = (typeof err === 'string' ? err : err.message || err.description || '');
            // Write log
            logger.info('Error Initializing service' + errorMsg);
        }
    );
}
