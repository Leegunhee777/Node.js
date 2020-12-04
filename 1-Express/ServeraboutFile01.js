//  public/photo.html과 관련
var express = require('express'),http = require('http'),path = require('path');

var bodyParser = require('body-parser')
    ,cookieParser = require('cookie-parser')
    ,static = require('serve-static')
    ,errorHandler = require('errorhandler');

//오류 핸들러 모듈사용
var expressErrorHandler = require('express-error-handler');

//Session 미들웨어 불러오기
var expressSession = require('express-session');
//세션을 사용하기 위해선 npm install express-session --save를 해줘야함
 
//파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

//클라이언트에서 ajax로 요청했을 때 CORS(다중 서버 접속)지원
var cors = require('cors');
//설치해야함 npm install cors --save 

var app = express();


app.set('port',process.env.PORT || 3000);


app.use(bodyParser.urlencoded({extended:false}));


app.use(bodyParser.json());

//public 폴더와 uploads 폴더 오픈
app.use('/public',static(path.join(__dirname,'public')));
app.use('./uploads',static(path.join(__dirname,'uploads')));

app.use(cookieParser());

app.use(expressSession({ //express-session모듈은 미들웨어로 사용되기때문에 use()메소드를 사용해 미들웨어에 추가해줘야함
    secret:'my key',
    resave: true,
    saveUninitialized:true
}));

//클라이언트에서 ajax로 요청했을때 CORS(다중 서버 접속)지원
app.use(cors());

//multer 미들웨어 사용: 미들웨어 사용 순서 중요 body-parser -> multer -> router
//파일 제한 : 10개 ,1G
var storage = multer.diskStorage({
    destination: function(req,file,callback){
        callback(null,'uploads')
    },
    filename:function(req,file,callback){
        callback(null,file.originalname+ Date.now())
    }
});

var upload = multer({
    storage:storage,
    limits: {
        files:10,
        fileSize: 1024 * 1024 * 1024
    }
});


var router = express.Router();


router.route('/process/photo').post(upload.array('photo',1),function(req,res){
    console.log('/process/photo 호출됨');

    try{
        var files = req.files;

        console.dir('#===== 업로드된 첫번째 파일 정보 =====#')
        console.dir(req.files[0]);
        console.dir('#=====#')

        //현재의 파일 정보를 저장할 변수 선언
        var originalname = '',
            filename='',
            mimetype = '',
            size = 0;

            if(Array.isArray(files)){//배열에 들어가 있는 경우(설정에서 1개의 파일도 배열에 넣게했음)
            console.log("배열에 들어있는 파일 갯수 : %d",files.length);

            for(var index = 0 ; index < files.length ; index++){
                originalname = files[index].originalname;
                filename = files[index].originalname;
                mimetype = files[index].mimetype;
                size = files[index].size;
            }
        }
    else{ //배열에 들어가 있지 않는 경우 ( 현재 설정에서는 없음)
        console.log("파일 갯수 : 1");

        originalname = files[index].originalname;
        filename = files[index].name;
        mimetype = files[index].mimetype;
        size = files[index].size;
    }

    console.log('현재 파일 정보: '+ originalname+ ','+ filename+ ','
    +mimetype+','+size);

    //클라이언트에 응답 전송
    res.writeHead('200',{'Content-Type':'text/html;charset=utf8'});
    res.write('<h3> 파일 업로드 성공 </h3>');
    res.write('<hr/>');
    res.write('<p>원본 파일 이름 : ' + originalname +' -> 저장파일명: '+filename +'</p>');
    res.write('<p> MIME TYPE : ' + mimetype + '</p>');
    res.write('<p>파일 크기'+ size + '</p>');
    res.end();
    }

    catch(err){
        console.dir(err.stack);
    }
});


//라우터 객체를 app 객체에 등록
app.use('/',router);

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