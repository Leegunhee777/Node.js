//여기서부터가 서버의 찐 요청 처리 중요한 부분 시작이라고 볼수 있음
//요청 라우팅하기
//exprexx 모듈의 router 미들웨어 이용하여 처리!!!!
//라우터 미들웨어는 Path를 기준으로 get,post,put,delete,all 요청을 처리함
//path기준 처리이기 때문에 html에서도 post방식에서 action에 path를 명시해줘야 그곳으로 request가 감

//웹클라이언트에서 POST방식으로 보낸 정보를(public폴더의 login2.html과 연동)
//웹서버에서 처리하는 예제임 
//서버를 작동시키고 http://localhost:3000/public/login2.html로 접근해봐라
//static미들웨어는 특정 폴더의 파일들을 특정 패스로 접근할 수 있도록해준다


//웹클라이언트가 웹서버로 데이터를보낼때
//1. POST 방식으로 form이용해 보내는방식  => req.body. 로 처리
//2. URL뒤에 ? 기호를 붙여 요청 파라미터로 데이터 보내는 방식 => req.query. 로 처리 (app6.js참고)
//3. URL파라미터를 이용해 URL 주소의 일부에 넣는 방법  => req.params. 로 처리

/////////////////////////////////////////////////////////////////////////////////////1번 처리에 대한 방법진행 예제임,(2번처리까지 커버됨)
//해당 js파일은 login2.html과 연동됨

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
//static미들웨어는 특정 폴더의 파일들을 특정 패스로 접근할 수 있도록해준다
//이걸써줘야 서버가동시 html에 접근하여 html파일을 열수있음
//이걸써워야 서버가동후 에서 다른폴더에 있는html을 열수있다는말임
//나의 html파일이 public폴어에 있으니 /public을 써준것임
//http://localhost:3000/public/login2.html로 접근해봐라


//라우터 객체 참조
var router = express.Router();


//process/login경로의 post요청에 대한 처리임
//라우팅 함수 등록
router.route('/process/login').post(function(req,res){
    console.log('/process/login 처리함.');

    var paramId = req.body.id || req.query.id;//클라이언트 측의 post방식 body로 보낼때 req.body.id 로 받음
    //클라이언트 측의 url뒤에 ? 기호붙여 ,요청마라미터로 보낼떄 req.query.id로 받음
    var paramPassword = req.body.password || req.query.password;
    
  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
  res.write('<div><p>Param id:' + paramId+'</p></div>');
  res.write('<div><p>Param password:' + paramPassword+'</p></div>');
  res.write("<br><br><a href='/public/login2.html'>로그인페이지로 돌아가기 </a>");
  res.end();

})



//라우터 객체를 app 객체에 등록
app.use('/',router);
http.createServer(app).listen(3000,function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});