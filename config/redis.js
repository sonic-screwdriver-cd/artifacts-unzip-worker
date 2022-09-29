'use strict';

const config = require('config');

const queueConfig = config.get('queue');
const connectionType = queueConfig.connectionType;

if (!connectionType && (connectionType !== 'redis' || connectionType !== 'redisCluster')) {
    throw new Error(
        `'${connectionType}' is not supported in connectionType, 'redis' or 'redisCluster' can be set for the queue.connectionType setting`
    );
}

const redisConfig = queueConfig[`${connectionType}Connection`];
const connectionDetails = {
    redisOptions: {
        password: redisConfig.options && redisConfig.options.password,
        tls: redisConfig.options ? redisConfig.options.tls : false
    }
};

let queueNamespace;

// for redisCluster config
if (connectionType === 'redisCluster') {
    connectionDetails.redisClusterHosts = redisConfig.hosts;
    connectionDetails.slotsRefreshTimeout = redisConfig.slotsRefreshTimeout;
    // NOTE: node-resque has an issue  in multi-key operation for Redis Cluster
    // https://github.com/actionhero/node-resque/issues/786
    // so we have to set the namespace option with a hash tag so that the resque's keys are set in the same slots in Redis Cluster
    // https://redis.io/docs/manual/scaling/#redis-cluster-data-sharding
    queueNamespace = 'resque:{screwdriver-resque}';
} else {
    // for non-cluster redis config
    connectionDetails.redisOptions.host = redisConfig.host;
    connectionDetails.redisOptions.port = redisConfig.port;
    connectionDetails.redisOptions.database = redisConfig.database;
    queueNamespace = 'resque';
}
const queuePrefix = queueConfig.prefix || '';

module.exports = {
    connectionDetails,
    queueNamespace,
    queuePrefix
};
