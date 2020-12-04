//등록된 경로가 아닌경우에 에러페이지 public폴더의 404.html페이지 보여주는 방법
//에러 처리라고보면됨

var express = require('express'),http = require('http'),path = require('path');



var bodyParser = require('body-parser'), static = require('serve-static');

var app = express();

var expressErrorHandler = require('express-error-handler');
//외장 모듈이므로 npm install express-error-handler --save해야함

app.set('port',process.env.PORT || 3000);


app.use(bodyParser.urlencoded({extended:false}));


app.use(bodyParser.json());

app.use('/public',static(path.join(__dirname,'public')));


var router = express.Router();

router.route('/process/login/:name').post(function(req,res){
    console.log('/process/login/:name 처리함.');

    var paramName = req.params.name;

    var paramId = req.body.id || req.query.id;

    var paramPassword = req.body.password || req.query.password;
    
  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
  res.write('<div><p>Param name:' + paramName+'</p></div>');
  res.write('<div><p>Param id:' + paramId+'</p></div>');
  res.write('<div><p>Param password:' + paramPassword+'</p></div>');
  res.write("<br><br><a href='/public/login3.html'>로그인페이지로 돌아가기 </a>");
  res.end();

})

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