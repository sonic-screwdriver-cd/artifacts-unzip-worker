'use strict';

const config = require('config');

const queueConfig = config.get('queue');
const redisConfig = queueConfig.redisConnection;
const connectionDetails = {
    pkg: 'ioredis',
    host: redisConfig.host,
    options: {
        password: redisConfig.options && redisConfig.options.password,
        tls: redisConfig.options ? redisConfig.options.tls : false
    },
    port: redisConfig.port,
    database: redisConfig.database
};
const queuePrefix = queueConfig.prefix || '';

module.exports = {
    connectionDetails,
    queuePrefix
};
