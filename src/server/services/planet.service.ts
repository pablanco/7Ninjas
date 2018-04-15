import * as express from 'express';
import * as moment from 'moment';
import * as path from 'path';
import * as log4js from 'log4js';


// Import objetcs
import { DummyPromise } from '../shared/promises.shared';
import { Planet } from '../models/planet.model';
import { GetPlanetApi } from '../shared/star-wars-api';

// Import redis service
import { Redis } from '../db/redis.service';
import { forEach } from '@angular/router/src/utils/collection';
import { resetFakeAsyncZone } from '@angular/core/testing';

// Get the logger
const logger = log4js.getLogger('Server');

export function PlanetService(app: express.Application) {

    app.get('/api/planets/:id?/:page?',
        (req: express.Request, res: express.Response, next: any) => {

        logger.info('Requested ' + req.method + ' for \'' + req.path + '\'');
        // Request incoming data
        const planetID: string = req.params.id || '';
        const page: number = req.params.page || '';

        // Star with dummy promise to make try-catch
        DummyPromise()
        .then(
            result => {
                // Ejecuto consulta a base de datos
                let data: any = null;
                if (planetID) {
                    data = GetPlanet(planetID, page);
                } else {
                    data = GetPlanets();
                }
                return data;
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

    app.post('/api/planets',
        (req: express.Request, res: express.Response, next: any) => {

        logger.info('Requested ' + req.method + ' for \'' + req.path + '\'');

        // Request incoming data
        const planetId: string = req.body.planetId;

        // Star with dummy promise to make try-catch
        DummyPromise()
        .then(
            result => {
                // Guarda al usuario en redis
                return SavePlanet(planetId);
            }
        ).then(
            saved => {
                // Verifies if query fails
                if (!saved) { throw new Error('Could not found planet data'); }

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

    app.delete('/api/planets/:id',
        (req: express.Request, res: express.Response, next: any) => {

        logger.info('Requested ' + req.method + ' for \'' + req.path + '\'');
        // Request incoming data
        const planetID: string = req.params.id || '';

        // Star with dummy promise to make try-catch
        DummyPromise()
        .then(
            result => {
                // Ejecuto consulta a base de datos
                return Redis.DeletePlanet(planetID);
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

}

// Executes in Redis, if not exist request to the api
export function SavePlanet (planetID: string ): Promise<any> {

    // Redis save flag
    let cacheUpdateNeeded: boolean = false;

    return Redis.GetPlanet(planetID)
    .then(
        (redisSearch: Planet) => {
            // Check if data exist
            if (redisSearch) {
                // Resturns result found
                const result: any[] = [];
                result.push(redisSearch);
                return Promise.resolve(result);
            } else {
                // Update redis flag
                cacheUpdateNeeded = true;
                // Execute API
                return GetPlanetApi(planetID);
            }
        }
    ).then(
        (planet: any) => {
            // Check if data exist
            if (planet) {
                // Update cache data
                if (cacheUpdateNeeded) {
                    planet.forEach(element => {
                        Redis.SavePlanet(element);
                    });
                }
                // Resturns result found
                return Promise.resolve(planet);
            } else {
                // Data not exists in DB
                throw new Error('SavePlanet no data found on DB.');
            }
        }
    ).catch(
        (err: any) => {
            // Obtains error message
            const errMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'Error executing');
            // Write to log
            logger.warn('Error executing SavePlanet: ' + errMsg);
            return Promise.reject(err);
        }
    );
}

// Executes in Redis
export function GetPlanet (planetID: string, page?: number ): Promise<Planet> {

    return Redis.GetPlanet(planetID)
    .then(
        (planet: Planet) => {
            // Check if data exist
            if (planet) {
                // Resturns result found
                return Promise.resolve(planet);
            } else {
                // Data not exists in DB
                throw new Error('GetPlanet no data found on DB.');
            }
        }
    ).catch(
        (err: any) => {
            // Obtains error message
            const errMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'Error executing');
            // Write to log
            logger.warn('Error executing GetPlanet: ' + errMsg);
            return Promise.reject(err);
        }
    );
}

// Executes in Redis
export function GetPlanets (): Promise<Planet[]> {

    // Redis save flag
    return Redis.GetPlanets()
    .then(
        (result: any) => {
            // Verifica si hay datos
            if (result) {
                return Promise.resolve(result);
            } else {
                // Data not exists in DB
                throw new Error('No data found');
            }
        }
    )
    .catch(
        (err: any) => {
            // Obtains error message
            const errMsg: string = (typeof err === 'string' ? err : err.message || err.description || 'Error executing');
            // Write to log
            logger.warn('Error executing GetPlanets: ' + errMsg);
        }
    );
}
