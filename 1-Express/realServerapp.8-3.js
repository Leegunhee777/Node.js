
//8-2는 Post방식의 요청에 따른 라우터 처리였지만
/////////////////////////////////////////////////////////////////////////////////////////////////8-3은 get방식의 토큰, URL의 파라미터data 처리임
//이 파일을 실행시키고 웹브라우저에서 http://localhost:3000/process/users/2 로 접속해보아라
//URL에 포함된 URL 파라미터의 토큰 사용법이다.
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

//여기서 콜론 (:)을 붙인 id값을 토큰이라한다. 
router.route('/process/users/:id').get(function(req,res){
    console.log('/process/users/:id 처리함.');

    var paramId = req.params.id;
    console.log('/process/users와 토큰 %s를 이용해 처리함',paramId);
  res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
  res.write('<h1>Express 서버에서 응답한 결과입니다.</h1>');
  res.write('<div><p>Param id:' + paramId+'</p></div>');
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