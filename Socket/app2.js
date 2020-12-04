/**
 * 소켓관련임//웹서버에 소켓을 연결하여 대기시키고, 
 * 웹클라이언트에서 소켓의 연결요청을하여 웹클라이언트와, 웹서버의소켓을 connect하는 예제임
 * +추가적으로 app.js에다가 chat02.html에서 소켓을 이용해 웹서버로 메세지를 보내고
 * 웹서버는 해당 메세지를 받아 웹서버소켓에 연결되있는 모든!!!! 클라이언트에게
 * 받은 메세지를 그대로 다시 돌려주게하는 예제임
 * 
 * 
 * http://localhost:3000/public/chat02.html로 접속하여
 * 연결요청할 웹 서버의IP와 포트번호를 입력하여 연결을하면
 * app.js의 웹서버에서 대기하고있던 socket이 클라이언트의 요청을 받아 처리함
 * 
 *
 * @date 2016-11-10
 * @author Mike
 */
 

// Express 기본 모듈 불러오기
var express = require('express')
  , http = require('http')
  , path = require('path');

// Express의 미들웨어 불러오기
var bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , static = require('serve-static')
  , errorHandler = require('errorhandler');

// 에러 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어 불러오기
var expressSession = require('express-session');
  


//socket.io 모듈불러들이기
var socketio = require('socket.io');

//cors 사용 - 클라이언트에서 ajax로 요청하면 CORS 지원
var cors = require('cors');


 


// 익스프레스 객체 생성
var app = express();
app.set('port', process.env.PORT || 3000);
 

// body-parser를 이용해 application/x-www-form-urlencoded 파싱
app.use(bodyParser.urlencoded({ extended: false }))

// body-parser를 이용해 application/json 파싱
app.use(bodyParser.json())

// public 폴더를 static으로 오픈
app.use('/public', static(path.join(__dirname, 'public')));
 
// cookie-parser 설정
app.use(cookieParser());

// 세션 설정
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));



//cors를 미들웨어로 사용하도록 등록
app.use(cors());


//===== 404 에러 페이지 처리 =====//
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


//===== 서버 시작 =====//

//확인되지 않은 예외 처리 - 서버 프로세스 종료하지 않고 유지함
process.on('uncaughtException', function (err) {
	console.log('uncaughtException 발생함 : ' + err);
	console.log('서버 프로세스 종료하지 않고 유지함.');
	
	console.log(err.stack);
});

// 프로세스 종료 시에 데이터베이스 연결 해제
process.on('SIGTERM', function () {
    console.log("프로세스가 종료됩니다.");
    app.close();
});

app.on('close', function () {
	console.log("Express 서버 객체가 종료됩니다.");
	if (database.db) {
		database.db.close();
	}
});

// 시작된 서버 객체를 리턴받도록 합니다. 
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

   
});

//socket.io 서버를 시작합니다.
//socket 서버를 웹 서버 위에서 동작하도록 설정하면 웹 소켓과 관련된 요청은
//모두 socket.io에서 처리한다.
var io = socketio.listen(server);

console.log('socket.io 요청을 받아들일 준비가 되었습니다.');


//클라이언트가 연결했을 떄의 이벤트처리
//클라이언트에서 웹 소켓으로 연결했을 때 발생하는 가장 기본적인 이벤트는 connection 이벤트이다.
//연결이끊어지면 클라이언트쪽에 disconnect이벤트가 발생한다.
//서버쪽에서도 클라이언트가 연결된 소켓객체에 disconnect이벤트가 발생한다.
io.sockets.on('connection',function(socket){
	
	console.log('connection info(client): ',socket.request.connection._peername);
	//출력정보=>connection info(client):  { address: '::ffff:127.0.0.1', family: 'IPv6', port: 63207 }
	//address는 요청을보낸 client의 IP정보, port정보 등을 알수있다.
	
	//on()메소드로 connection 이벤트를 처리하는 콜백 함수를 등록하면 콜백 함수 쪽으로
	//소켓 객체가 전달된다. 이 소켓 객체에는 접속한 클라이언트의 IP주소와 포트 번호를 확인할 수있는
	//속성이 들어있으므로 그 속성값을 확인해 접속한 클라이언트의 정보를 로그로 출력한다.
	//io 변수에 할당된 socket객체는 클라이언트가 접속하거나 데이터를 전송했을때,
	//이벤트를 발생시킨다. 이벤트를 처리할 함수를 on()메소드로 등록하면,
	//이벤트에 대한 필요한 기능을 실행시킬수 있다.
	
	socket.remoteAddress = socket.request.connection._peername.address;
	socket.remotePort = socket.request.connection._peername.port;
    //소켓 객체에 클라이언트 Host, Port 정보 속성으로 추가하는과정
    
    //////////////////////////////////////////////////////////////////////////////
    //chat02.html과 관련, 'message'이벤트를 받았을 때의 처리
    socket.on('message',function(message){
        console.log('message 이벤트를 받았습니다.');
        console.dir(message);
       
        if(message.recepient == 'All'){
            
            //나를 포함한 모든 클라이언트에게 메세지 전달
            console.dir('나를 포함한 모든 클라이언트에게 message 이벤트를 전송합니다.');

            //여기서 "나"를 이라는것은 메세지를 처음에 보낸사람을 의미함
            //io.sockets.emit()은 웹서버에 , 메세지를 보낸사람을 포함한 모든 연결된 클라이언트에게 
            //전송하는것이고

            //socket.bradcast.emit()은, 메세지를 보내온 사람(클라이언트)을 제외한
            //모든클라이언트에게 전송하는것이다.
            
            io.sockets.emit('message',message);
            //socket.broadcast.emit('message',message);
        }
    });
});