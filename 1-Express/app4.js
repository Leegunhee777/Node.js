//send()메소드는 응답 데이터를 좀더 간단하게 전송하기 위해 익스프레스에서 추가된것이다.//만약 하나의 미들웽 에서 클라이언트에 바로 응답을 보내는 방식이아니라

var express = require('express'),http = require('http')

var app = express();

app.use('/',function(req,res,next){
   console.log('첫번 째 미들웨어에서 요청을 처리함');

   res.send({name:'소녀시대',age:20});
});

http.createServer(app).listen(3000,function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});

