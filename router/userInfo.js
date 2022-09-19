const express = require('express')
const router = express.Router()
const userInfoHandler = require('../router_handler/userinfo_handler.js')

//get userinfo route
router.get('/userinfo' ,userInfoHandler.getUserInfo)
module.exports = router