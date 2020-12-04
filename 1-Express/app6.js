//실행후에 브라우저에서 http://localhost:3000/?name=make2 로 접속해봐라 
//클라이언트에서 보내온 요청 파라미터에 있는 data를 서버쪽에서 받아서 사용할 수 있다.
//클라이언트측 요청파라미터를 req.query로 접근하여 가져올수 있다.

var express = require('express'),http = require('http')

var app = express();

app.use('/',function(req,res,next){
  console.log('첫번째 미들웨어에서 요청을 처리함');

  var userAgent = req.header('User-Agent');
  var paramName = req.query.name;

  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
  res.write('<div><p>User-Agent:' + userAgent+'</p></div>');
  res.write('<div><p>Param name:' + paramName+'</p></div>');
  res.end();
});

http.createServer(app).listen(3000,function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});