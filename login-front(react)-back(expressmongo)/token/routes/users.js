var express = require('express');
var router = express.Router();

const usersController = require('./controllers/users.controllers');

//user 정보와 관련된 요청들은 모두 POST 요청들이다.
//login할때 token을 새로 생성하는 것도 POST 요청이고,
//새로운 user정보를 db에 저장하는 것도 POST 요청이다.
router.post('/login', usersController.createToken);
router.post('/new', usersController.createNewUser);

module.exports = router;


