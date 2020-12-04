//redirect()메소드를 호출하면서 구글 사이트의 주소를 마라미터로 전달하여
//웹서버 실행후 웹브라우저로 접속하면 구글 사이트가 결과 페이지로 나타난다.
//redirect()메소드를 사용하면 URL주소뿐아니라, 프로젝트 폴더안에있는 다른 페이지를 보여줄수있다.

var express = require('express'),http = require('http')

var app = express();

app.use('/',function(req,res,next){
   console.log('첫번 째 미들웨어에서 요청을 처리함');

    res.redirect('http://google.co.kr');
});

http.createServer(app).listen(3000,function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});