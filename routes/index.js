let users = require('../controller/users');
let auth = require('../controller/auth');
let news = require('../controller/news');


async function routes (fastify, options) {
    fastify.get('/', function (request, reply) {
        reply.send({message: 'ping success', code: 200})
    });
    fastify.post('/api/users/register', users.register);
    fastify.post('/api/users/login', users.login);
    fastify.post('/api/token', auth.createToken);
    // fastify.get('/news', news.getNewsList);
    // fastify.get('/news/:id', news.getNewsDetail);
}

module.exports = routes;

