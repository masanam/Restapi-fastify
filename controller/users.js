let response = require('../response');
let connection = require('../connection');
let sha1 = require('sha1');
let moment = require('moment');
let crypto = require('crypto');

async function register (request, reply) {

    let now = moment().format('YYYY-MM-DD HH:mm:ss').toString();
    let name = request.body.name;
    let email = request.body.email;
    let password = sha1(request.body.password);
    let token = crypto.randomBytes(32).toString('hex');
    let created_at = now;
    let updated_at = now;

    let sql = `INSERT INTO users (name, email, password, remember_token, created_at, updated_at)
      values(?, ?, ?, ?, ?, ?)`;

    //Menggunakan promise apabila membutuhkan data yang akan dikembalikan setelah callback
    let data = await new Promise((resolve) =>
        connection.query(sql,
            [name, email, password, token, created_at, updated_at], function (error, rows) {
            if(error){
                //Check terlebih dahulu untuk data yang sudah ada.
                if(error.code === 'ER_DUP_ENTRY'){
                    return response.badRequest('', `E-mail ${email} telah digunakan!`, reply)
                }

                //Jika bukan duplicate entry maka cetak error yang terjadi.
                console.log(error);
                return response.badRequest('', `${error}`, reply)
            }

            return resolve({ name: name, email: email, token :  token});
        })
    );

    return response.ok(data, `Berhasil registrasi pengguna baru - ${email}`, reply);
}module.exports = {
    register
};

