const formidable = require('formidable');
const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../config')
const fs = require('fs')
const path = require('path')

exports.register = (req, res) => {
    //use formidable to parse form data received from frond end
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) return res.cc(err)
        else {
            let userEmail = fields.user_email
            let userPassword = fields.password
            const sqlstr = 'select * from users where username=?'
            //sql query
            db.query(sqlstr, userEmail, (err, result) => {
                if (err) {
                    return res.cc(err)
                }
                if (result.length > 0) {
                    return res.cc("this email is used")
                }
                else {
                    const sql = "insert into users set ?"
                    userPassword = bcrypt.hashSync(userPassword, 10)
                    db.query(sql, { username: userEmail, password: userPassword ,avatar:files.img.originalFilename}, (err, result) => {
                        if (err) return res.cc(err)


                        if (result.affectedRows !== 1) {
                            return res.cc("failed to register")
                        }
                        else {
                            let rootPath = path.resolve(__dirname,'..')
                            let myPath = path.join(rootPath,'/public',files.img.originalFilename)
                            console.log(myPath)
                            fs.copyFileSync(files.img.filepath,myPath,0,(err) => {
                                if (err) throw err;
                            })
                            return res.cc("registered", 0)
                        }
                    })
                }
            })
        }
    });
}


exports.login = (req, res) => {
    const form = formidable({ multiples: true });
    form.parse(req, (err, fields, files) => {
        if (err) return res.cc(err)
        else {
            let userEmail = fields.user_email
            let userPassword = fields.password
            const sql = "select * from users where username=?"
            db.query(sql, userEmail, (err, result) => {
                //sql error
                if(err) return res.cc(err)
                //check username
                if(result.length !== 1) return res.cc("incorrect username or password")
                //check password
                else {
                    const compareResult = bcrypt.compareSync(userPassword,result[0].password)
                    if(!compareResult) return res.cc("incorrect password")
                    else {
                        const user = {...result[0], password:"", avatar:""}
                        const tokenStr = jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
                        return res.send({
                            status:0,
                            message:"Login OK",
                            token:"Bearer " + tokenStr,
                        })
                    }
                }
            })
        }
    });
}