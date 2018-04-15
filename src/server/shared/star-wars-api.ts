import * as rp from 'request-promise';
import * as log4js from 'log4js';

// Obtains configs and model
import { Planet } from '../models/planet.model';
import { Comment } from '../models/comment.model';
import { SW_API_URL } from '../config/server.config';

// Get the logger
const logger = log4js.getLogger('Server');

// Function to obtains planets data
export function GetPlanetApi(planetID?: string, page?: number): Promise<Planet[]> {

    const options = {
        uri: SW_API_URL + 'planets/' +
        (planetID ? '?search=' + planetID : '') +
        (page && planetID ? '&page=' + page : '')
    };

    logger.info('PlanetApi: ' + options.uri);

    return new Promise((resolve: any, reject: any) => {
        rp.get(options).then(
            (response: any) => {
                const json = JSON.parse(response);
                const results = (json && json.results) ? json.results : '';
                const count = (json && json.count) ? json.count : '';
                const next = (json && json.next) ? json.next : '';
                const previous = (json && json.previous) ? json.previous : '';
                const planets: Planet[] = [];

                results.forEach( (row: any) => {
                    planets.push(
                        new Planet(
                            row.name,
                            row.rotation_period,
                            row.orbital_period,
                            row.diameter,
                            row.climate,
                            row.gravity,
                            row.terrain,
                            row.surface_water,
                            row.population,
                            row.created
                        )
                    );
                });
                return resolve(planets);
        })
        .catch((err: any) => {
            logger.warn('GetPlanetApi: ' + err.message);
            return reject(err);
        });
    });
}
