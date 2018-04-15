// Logger configuration
export const LOGGER_CONFIG: any = {
    appenders: {
        out: { type: 'console' }
    },
    categories: {
        default: { appenders: [ 'out' ], level: 'info' }
    }
};
