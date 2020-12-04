//웹클라이언트에서 POST방식으로 보낸 정보를(public폴더의 login.html과 연동)
//웹서버에서 처리하는 예제임 
//서버를 작동시키고 http://localhost:3000/public/login.html로 접근해봐라

//Express 기본 모듈 불러오기
var express = require('express'),http = require('http'),path = require('path');


//Express의 미들웨어 불러오기
var bodyParser = require('body-parser'), static = require('serve-static');
//Express 객체 생성
var app = express();

//기본 속성 설정
app.set('port',process.env.PORT || 3000);

//body-parser를 사용해 application/x-www-form-urlencoded파싱
app.use(bodyParser.urlencoded({extended:false}));

//body-parser를 사용해 application/json 파싱
app.use(bodyParser.json());

app.use('/public',static(path.join(__dirname,'public')));
//이걸써줘야 서버가동시 html에 접근하여 html파일을 열수있음
//http://localhost:3000/public/login.html로 접근해봐라


//미들웨어에서 파라미터 확인
app.use(function(req,res,next){
  console.log('첫번째 미들웨어에서 요청을 처리함');

  var paramId = req.body.id || req.query.id; //클라이언트 측의 post방식 body로 보낼때 req.body.id 로 받음
                                            //클라이언트 측의 url요청마라미터로 보낼떄 req.query.id로 받음
  var paramPassword = req.body.password || req.query.password;

  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
  res.write('<div><p>Param id:' + paramId+'</p></div>');
  res.write('<div><p>Param password:' + paramPassword+'</p></div>');
  res.end();
});

http.createServer(app).listen(3000,function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});