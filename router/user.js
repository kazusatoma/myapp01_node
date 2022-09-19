const express = require('express')
const router = express.Router()
const userHandler = require('../router_handler/user_handler')

router.post('/register',userHandler.register)
router.post('/login',userHandler.login)

module.exports = router