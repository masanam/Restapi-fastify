let response = require('../response');
let connection = require('../connection');
let moment = require('moment');
let crypto = require('crypto');

async function createToken (request, reply) {

    let now = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    let secret = request.body.secret;
    let token = request.body.token;
    let created_at = now;
    let updated_at = now;

    //Mengambil id pengguna
    let user_id = await getUser(token);

    //Mengambil id secret key
    let secret_id = await getSecret(secret);

    //Kedua id harus ada di tiap table, kalau tidak ada salah satu maka harus dilemparkan message error.
    if(!secret_id || !user_id){
        return response.badRequest('','Token atau Secret key kamu salah!', reply);
    }

    //Menciptakan random string sebanyak kurang lebih 20 karakter
    let id = crypto.randomBytes(25).toString('hex');

    //Membuat tanggal hari ini + 30 hari kedepan untuk masa aktif token.
    let expires_at = moment().add(30, 'days').format('YYYY-MM-DD HH:mm:ss').toString();

    let sql = `INSERT INTO authentication (id, user_id, secret_id, expires_at, created_at, updated_at)
      values(?, ?, ?, ?, ?, ?)`;
    let data = await new Promise((resolve) =>
        connection.query(sql,
            [id, user_id, secret_id, expires_at, created_at, updated_at], function (error, rows) {
                if(error){
                    console.log(error);
                    return response.badRequest('', `${error}`, reply)
                }

                let array = {
                    token : id,
                    expires_at : expires_at
                };

                return resolve(array);
            })
    );

    return response.ok(data, `Berhasil membuat autentikasi!`, reply);
}

async function getUser (token) {
    return new Promise((resolve) =>
        connection.query('SELECT id FROM users WHERE remember_token = ?', [token], function (error, rows) {
            if(error){
                console.log(error);
            }

            return rows.length > 0 ? resolve(rows[0].id) : resolve(false);
        })
    );
}

async function getSecret (secret) {
    return new Promise((resolve) =>
        connection.query('SELECT id FROM secret WHERE secret = ?', [secret], function (error, rows) {
            if(error){
                console.log(error);
            }

            return rows.length > 0 ? resolve(rows[0].id) : resolve(false);
        })
    );
}

module.exports = {
    createToken
};