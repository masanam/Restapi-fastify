const fastify = require('fastify')({
    logger: true //aktifkan ini untuk menerima log setiap request dari fastify.
});
const routes = require('./routes')
fastify.register(routes);
fastify.register(require('fastify-formbody'));

module.exports = fastify