const fastify = require('fastify')({
    logger: true //aktifkan ini untuk menerima log setiap request dari fastify.
});
fastify.register(require('fastify-formbody'));
const routes = require('./routes')
fastify.register(routes);

module.exports = fastify