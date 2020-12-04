//만약 하나의 미들웽 에서 클라이언트에 바로 응답을 보내는 방식이아니라
// 여러 개의 미들웨어를 등록하여 어러가지 기능을 수행하도록 만들고 싶다면
//각각의 미들웨어 안에서 마지막에 next()메소드를 호출하여 다음 미들웨어로 처리결과를 넘겨주어야한다.
var express = require('express'),http = require('http')

var app = express();

app.use(function(req,res,next){
    console.log('첫번째 미들웨어에서 요청을 처리함');
    req.user = 'mike';
    next();
});

app.use('/',function(req,res,next){
    console.log('두번째 미들웨어 에서 요청을 처리함');

    res.writeHead('200',{'Content-Type':'text/html; charset=utf8'});
    res.end('<h1>Express 서버에서 ' + req.user+'가 응답한 결과입니다.</h1>');
});

http.createServer(app).listen(3000,function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});