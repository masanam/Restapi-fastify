let news = require('../controller/news');
let users = require('../controller/users');

async function routes (fastify, options) {
    fastify.get('/', function (request, reply) {
        reply.send({message: 'ping success', code: 200})
    })
    // fastify.get('/news', news.getNewsList);
    // fastify.get('/news/:id', news.getNewsDetail);
    fastify.post('/api/users/register', users.register);
}

module.exports = routes;

