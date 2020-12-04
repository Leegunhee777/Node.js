//사용자가 로그인한 상태인지 아닌지 확인하고 싶을 때에는 쿠키나 세션을 사용한다.
//쿠키는 클라이언트 웹 브라우저에 저장되는정보
//세션은 웹 서버에 저장되는 정보이다.
//해당 파일은 세션을 이용하여
//user라는 세션의 유무를 확인하여(로그인되있는지,안되있는지확인), 
//세션이있는 자에겐(로그인되있는) 요청한페이지를보여주고
//없는 자(로그인안되있는)에겐 로그인 페이지를 유도하는 예제이다.
//http://localhost:3000/process/product 를 입력해보아라

var express = require('express'),http = require('http'),path = require('path');

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
//세션을 사용하기 위해선 npm install express-session --save를 해줘야함
var bodyParser = require('body-parser'), static = require('serve-static');

var app = express();

var expressErrorHandler = require('express-error-handler');
//외장 모듈이므로 npm install express-error-handler --save해야함

app.set('port',process.env.PORT || 3000);


app.use(bodyParser.urlencoded({extended:false}));


app.use(bodyParser.json());


app.use('/public',static(path.join(__dirname,'public')));

app.use(cookieParser());
app.use(expressSession({ //express-session모듈은 미들웨어로 사용되기때문에 use()메소드를 사용해 미들웨어에 추가해줘야함
    secret:'my key',
    resave: true,
    saveUninitialized:true
}));

var router = express.Router();

//상품 정보 라우팅 함수
router.route('/process/product').get(function(req,res){
    console.log('/process/product 호출됨');

    if(req.session.user){
        res.redirect('/public/product.html');
    }else{
        res.redirect('/public/login2.html');
    }
});

//로그인 라우팅 함수 - 로그인 후 세션 저장함
router.route('/process/login').post(function(req,res){
    console.log('/process/login 호출됨');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    if(req.session.user){
        //이미 로그인된 상태
        console.log('이미 로그인되어 상품페이지로 이동합니다.');
        res.redirect('/public/product.html');
    }
    else {
        //세션 저장
        req.session.user = {
            id:paramId,
            name:'소녀시대',
            authorized:true
        
    };

    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h1>로그인성공</h1>');
    res.write('<div><p>Param id : '+ paramId+'</p></div>');
    res.write('<div><p>Param password :' + paramPassword+'</p></div>');
    res.write("<br><br><a href= '/process/product'>상풍 페이지로 이동하기 </a>");
    res.end();
}
});

//로그아웃 라우팅 함수 -로그아웃 후 세션 삭제함
router.route('/process/logout').get(function(req,res){
    console.log('/process/logout 호출됨');

    if(req.session.user){
        //로그인된상태
        console.log('로그아웃합니다.');
        req.session.destroy(function(err){
            if(err) {throw err;}
            
            console.log('세션을 삭제하고 로그아웃되었습니다.');
            res.redirect('/public/login2.html');
        });
    }
    else{
        //로그인 안된 상태
        console.log('아직 로그인되어 있지 않습니다.');
        res.redirect('/public/login2.html');
    }
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

//오류페이지를 처리하기위한 외장모듈 핸들러 public폴더의 404.html을 오류페이지로 보여줌
var errorHandler = expressErrorHandler({
    static:{
        '404': './public/404.html'
    }
});


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