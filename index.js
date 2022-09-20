const express = require('express')
const app = express()
const cors = require('cors')
const expressJWT = require('express-jwt');
const userRouter = require('./router/user')
const userinfoRouter = require('./router/userInfo')
const config  = require('./config');
const dotenv = require("dotenv").config()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
console.log(process.env.dbPass)

app.use((req, res, next) => {
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

//registe mw and routes
app.use(expressJWT({secret:config.jwtSecretKey}).unless({path:[/^\/user/]}))
app.use('/user', userRouter)
app.use('/my', userinfoRouter)


process.on('uncaughtException', function (error) {
    console.log(error.stack);
})
//run server
app.listen(3007, function () {
    console.log('api server running at http://127.0.0.1:3007')
})