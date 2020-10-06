'use strict'
require('dotenv').config();
const fastify = require('./app')
fastify.register(require('fastify-formbody'));

const start = async () => {
    try {
        await fastify.listen(process.env.APP_PORT || 3000);

        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err);
        process.exit(1)
    }
};

start();