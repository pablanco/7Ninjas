import * as express from 'express';
import * as crypto from 'crypto';
import * as log4js from 'log4js';

// Import configuration for Redis
import { REDIS_DATA_PERSISTENCE } from '../../config/redis.config';
import { Planet } from '../../models/planet.model';

// Connection to Redis
let redisClient: any;

// Get the logger
const logger = log4js.getLogger('Server');

export function PlanetRedis(app: express.Application) {
    // Obtains connection to Redis
    redisClient = app.get('redisClient');
}
/////////////////////////////////
// Redis data access functions //
/////////////////////////////////

export function SavePlanet ( planet: Planet ): Promise<boolean> {

    // Checks null hash
    if (!planet) {
        throw new Error('Try to save nulled key registry');
    }

    // Update data
    return redisClient.hsetAsync('Planet', planet.id, JSON.stringify(planet))
    .then(
        (result: any) => {
            // Updates hash expiration time
            return redisClient.expireAsync('Planet', REDIS_DATA_PERSISTENCE);
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
            + ( err ? typeof err === 'string' ? err : err.message || err.description || '' : '');

            // Write Log error
            logger.warn(errorMsg);

            // Makes reject returns the error
            return Promise.reject(err);
        }
    );
}

export function GetPlanets (): Promise<Planet[]> {

    // Query to Redis data
    return redisClient.hgetallAsync('Planet')
    .then(
        (result: any) => {
            const planets: Planet[] = [];
            for (const id in result) {
                if (result.hasOwnProperty(id)) {
                    planets.push(JSON.parse(result[id]));
                }
            }
            return Promise.resolve(planets);
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

export function GetPlanet ( planetID: string ): Promise<Planet> {

    // Checks null hash
    if (!planetID) {
        throw new Error('Try to save nulled key planet');
    }

    // Query to Redis data
    return redisClient.hgetAsync('Planet', planetID)
    .then(
        (result: any) => {
            // Dato a devolver
            let planet: Planet;
            // Parse redis data to json
            try {
                planet = JSON.parse(result);
            } catch (err) {
                // If fails retunrs no data
                return Promise.resolve(null);
            }
            // Resturns result
            return Promise.resolve(planet);
        }
    ).catch(
        (err: any) => {
            // Obtains error message
            const errorMsg: string = 'Error executing: '
            + ( err ? typeof err === 'string' ? err : err.message || err.description || '' : '');

            // Write Log error
            logger.warn(errorMsg);

            // Makes reject returns the error
            return Promise.reject(err);
        }
    );
}

export function DeletePlanet ( planetID: string ): Promise<boolean> {

    // Checks null hash
    if (!planetID) { throw new Error('Try to delete nulled key planet'); }

    // Erase data if exists
    return redisClient.hdelAsync('Planet', planetID)
    .then(
        (result: number) => {
            // Resturns result
            return Promise.resolve(true);
        }
    ).catch(
        (err: any) => {
            // Obtains error message
            const errorMsg: string = 'Error executing: '
            + ( err ? typeof err === 'string' ? err : err.message || err.description || '' : '');

            // Write Log error
            logger.warn(errorMsg);

            // Makes reject returns the error
            return Promise.reject(err);
        }
    );
}
