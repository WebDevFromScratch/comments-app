import config from './server';

// Defining name of the bundle
config.bundle = 'app';
config.appPort = process.env.APP_PORT || 3500;

export default config;
