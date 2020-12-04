const express = require('express');

const router = express.Router();

const todosController = require('./controllers/todos.controllers');

const { verifyToken } = require('./middlewares/authorization');

//todo 리스트 정보를 GET하는 요청이 client로 부터 왔다면 위와같이 처리한다.
//아까 만들어둔 verifyToken 미들웨어를 거쳐서 token이 유효한지 확인한다.
//token이 유효하다면 todosContoroller.getAll 을 호출한다.
router.get('/', verifyToken, todosController.getAll);
router.post('/ttt', todosController.createNewtodo);
module.exports = router;

