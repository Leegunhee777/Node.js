//웹클라이언트가 웹서버로 데이터를보낼때
//1. POST 방식으로 form이용해 보내는방식  => req.body. 로 처리
//2. URL뒤에 ? 기호를 붙여 요청 파라미터로 데이터 보내는 방식 => req.query. 로 처리
//3. URL파라미터를 이용해 URL 주소의 일부에 넣는 방법  => req.params. 로 처리
/////////////////////////////////////////////////////////////////////////////////////3번 POST방식처리에 대한 방법진행 예제임
//public폴더의 login3.html과 연동
//서버 가동후 http://localhost:3000/public/login3.html 로 로그인해봐라

var express = require('express'),http = require('http'),path = require('path');



var bodyParser = require('body-parser'), static = require('serve-static');

var app = express();


app.set('port',process.env.PORT || 3000);


app.use(bodyParser.urlencoded({extended:false}));


app.use(bodyParser.json());

app.use('/public',static(path.join(__dirname,'public')));


var router = express.Router();

//3번 처리에 대한 방법진행
// 이것은 /process/login/뒤에 오는 값을 파라미터로 처리하겠다는것임 , 이렇게 지정된파라미터는 req.params 객체안으로 들어간다.
//:name으로 표시된 부분에 넣어 전달된 값은 req.params.name 으로 접근가능하다. 이것을 토큰(Token)이라고한다.
router.route('/process/login/:name').post(function(req,res){
    console.log('/process/login/:name 처리함.');

    var paramName = req.params.name;

    var paramId = req.body.id || req.query.id;//클라이언트 측의 post방식 body로 보낼때 req.body.id 로 받음
                                              //클라이언트 측의 url뒤에 ? 기호붙여 ,요청마라미터로 보낼떄 req.query.id로 받음
    var paramPassword = req.body.password || req.query.password;
    
  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
  res.write('<div><p>Param name:' + paramName+'</p></div>');
  res.write('<div><p>Param id:' + paramId+'</p></div>');
  res.write('<div><p>Param password:' + paramPassword+'</p></div>');
  res.write("<br><br><a href='/public/login3.html'>로그인페이지로 돌아가기 </a>");
  res.end();

})


//라우터 객체를 app 객체에 등록
app.use('/',router);
http.createServer(app).listen(3000,function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});