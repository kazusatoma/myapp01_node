const db = require('../db/index')

exports.getUserInfo = (req, res) => {
    const sql = 'select id, username, nickname, email , avatar from users where id=?'
    db.query(sql, req.user.id, (err, result) => {
        if(err) return res.cc(err)

        if(result.length !== 1) return res.cc('cannot find this user')

        else{
            res.send(result[0])
        }
    })
}