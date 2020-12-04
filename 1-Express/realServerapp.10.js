//사용자가 로그인한 상태인지 아닌지 확인하고 싶을 때에는 쿠키나 세션을 사용한다.
//쿠키는 클라이언트 웹 브라우저에 저장되는정보
//세션은 웹 서버에 저장되는 정보이다.

//realServerapp.10.js는 쿠기에 대한 예제이다.
//use()메소드를 사용해 cooKie-parser 미들웨어를 사용하도록 만들면
//요청 객체(요청객체임!!!!!!!!)에 cookies속성이 추가된다.
//3000/process/showCookie 에 접속하면 클라이언트(웹브라이저)의 쿠키저장소의 쿠키를 보여준다.
var express = require('express'),http = require('http'),path = require('path');

var cookieParser = require('cookie-parser');

var bodyParser = require('body-parser'), static = require('serve-static');

var app = express();

var expressErrorHandler = require('express-error-handler');
//외장 모듈이므로 npm install express-error-handler --save해야함

app.set('port',process.env.PORT || 3000);


app.use(bodyParser.urlencoded({extended:false}));


app.use(bodyParser.json());


app.use('/public',static(path.join(__dirname,'public')));

app.use(cookieParser());

var router = express.Router();

router.route('/process/showCookie').get(function(req,res){
    console.log('/process/showCookie 호출됨.');
    res.send(req.cookies);//클라이언트(웹브라이저)의 cookie 저장소에 저장된 정보를 보여주는것임
});

router.route('/process/setUserCookie').get(function(req,res){
    console.log('/process/setUserCookie 호출됨');

    //쿠키 설정
    res.cookie('user',{ //응답 객체(응답객체임!!!!!!1)의 cooKie()메소드로 쿠키를추가한다(여기선 user라는 이름의 쿠키가추가됨). 그러면 쿠키가 클라이언트 웹 브라우저에 설정된다.
        id:'mike',
        name:'소녀시대',
        authorized: true
    });

    //redirect로 응답 특정패스로 연결해줌
    res.redirect('/process/showCookie');
});


//오류페이지를 처리하기위한 외장모듈 핸들러 public폴더의 404.html을 오류페이지로 보여줌
var errorHandler = expressErrorHandler({
    static:{
        '404': './public/404.html'
    }
});



//라우터 객체를 app 객체에 등록
app.use('/',router);

//router객체 등록 밑에다가 에러 핸들러 등록해야 , 등록된 라우터가 없을 경우 에러처리가 되는것이지
//app.use('/',router); 위에다가 해버리면 라우터처리되기도전에 모든경로에다 에러페이지를 보여주게됨


//등록되지 않은 패스에 대해 페이지 오류 응답방법 (1)
app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

/*
//등록되지 않은 패스에 대해 페이지 오류 응답방법 (2)
app.all('*',function(req,res){
    res.status(404).send('<h1>ERROR-페이지오류XXX</h1>');
});
*/

http.createServer(app).listen(3000,function(){
    console.log('Express 서버가 3000번 포트에서 시작됨');
});