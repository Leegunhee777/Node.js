/**
 * 
 * MySQL 데이터베이스 사용하기
 *
 * 웹브라우저에서 아래 주소의 페이지를 열고 웹페이지에서 요청
 * (먼저 사용자 추가 후 로그인해야 함)
 *    http://localhost:3000/public/login.html
 *    http://localhost:3000/public/adduser2.html
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

// 익스프레스 객체 생성
var app = express();


// 기본 속성 설정
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


//MySQL 데이터베이스를 사용할 수 있는 mysql 모듈 불러오기
var mysql = require('mysql');
const { ifError } = require('assert');
const { isRegExp } = require('util');
const { runInNewContext } = require('vm');

//MySQL 데이터베이스 연결설정 (연결할 MySQL정보를 입력하는것임)이 설정이면 DB연결은 끝!!!!
var pool = mysql.createPool({
	connectionLimit:10,
	host:'localhost',
	user:'root',
	password:'1234',
	database:'test',
	debug: false
});


//===== 라우팅 함수 등록 =====//

// 라우터 객체 참조
var router = express.Router();

// 로그인 처리 함수
router.route('/process/login').post(function(req, res) {
	console.log('/process/login 호출됨.');

	// 요청 파라미터 확인
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
	
    console.log('요청 파라미터 : ' + paramId + ', ' + paramPassword);
	
    // pool 객체가 초기화된 경우, authUser 함수 호출하여 사용자 인증
	if (pool) {
		authUser(paramId, paramPassword, function(err, rows) {
			// 에러 발생 시, 클라이언트로 에러 전송
			if (err) {
                console.error('사용자 로그인 중 에러 발생 : ' + err.stack);
                
                res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h2>사용자 로그인 중 에러 발생</h2>');
                res.write('<p>' + err.stack + '</p>');
				res.end();
                
                return;
            }
			
            // 조회된 레코드가 있으면 성공 응답 전송
			if (rows) {
				console.dir(rows);
				//console.log(rows[1]);
				//console.log(rows[1].name);
				//데이터베이스에서 조회한 사용자 데이터는 rows파라미터에 들어있으므로
				//rows 객체의 첫번째 배열 요소를 참조한후 사용자 이름을 확인한다(정보조회의 경우 정상적이라면 1개의 계정이존재할것이므로)
				//rows[0]을찾는다.
				//디비 정보에 동일 아이디, 비번가지고 있는 회원이 2개있을 경우 rows[1], rows[1].name으로 접근가능 
                // 조회 결과에서 사용자 이름 확인
				var username = rows[0].name;
				
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인 성공</h1>');
				res.write('<div><p>사용자 아이디 : ' + paramId + '</p></div>');
				res.write('<div><p>사용자 이름 : ' + username + '</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
			
			} else {  // 조회된 레코드가 없는 경우 실패 응답 전송
				res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
				res.write('<h1>로그인  실패</h1>');
				res.write('<div><p>아이디와 패스워드를 다시 확인하십시오.</p></div>');
				res.write("<br><br><a href='/public/login.html'>다시 로그인하기</a>");
				res.end();
			}
		});
	} else {  // 데이터베이스 객체가 초기화되지 않은 경우 실패 응답 전송
		res.writeHead('200', {'Content-Type':'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결 실패</h2>');
		res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
		res.end();
	}
	
});

//사용자 추가 라우팅 함수
router.route('/process/adduser').post(function(req,res){
	console.log('/process/adduser 호출됨.');

	var paramId = req.body.id || req.query.id ;
	var paramPassword = req.body.password || req.query.password;
	var paramName = req.body.name || req.query.name;
	var paramAge = req.body.age || req.query.age;

	console.log('요청 파라미터 : ' + paramId+','+paramPassword+','+paramName+','+paramAge);

	//pool객체가 초기화 된 경우, addUser 함수 호출하여 사용자 추가
	if(pool){
		addUser(paramId,paramName,paramAge,paramPassword,function(err, addedUser){
			//동일한 id 로 추가할 때 오류 발생 - 클라이언트로 오류 전송
			if(err){
				console.error('사용자 추가 중 오류 발생: ' + err.stack);

				res.writeHead('200',{'Content-Type':'text/html;charset=uft8'});
				res.write('<h2>사용자 추가 중 오류 발생 </h2>');
				res.write('<p>' + err.stack + '</p>');
				res.end();
				return ;
			}

			//결과객체 있으면 성곡응답전송 callback함수인 function(err,addedUser)에서 
			//쿼리에 대한 결과를 사용하기 위해서 addUser함수의 마지막부분에서 쿼리 성공후 그에대한 결과를
			//callback(null,result)로 반환하여 그 결과를 사용할수 있게 해준다.
			if(addedUser){
				console.dir(addedUser);
				
				
				console.log('inserted' + addedUser.affectedRows +'rows');

				var insertId = addedUser.insertId;
				console.log ('추가한 레코드의 아이디: '+ insertId);

				res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 성공 </h2>');
				res.end();
			}
			else{
				res.writeHead('200',{'Content-Type': 'text/html;charset=utf8'});
				res.write('<h2>사용자 추가 실패 </h2>');
				res.end();
			}
		});
	}
	else{ //데이터베이스 객체가 초기화 되지 않은 경우 실패 응답 전송
		res.writeHead('200',{'Contnet-Type': 'text/html;charset=utf8'});
		res.write('<h2>데이터베이스 연결실패</h2>');
		res.end();

	}
});

// 라우터 객체 등록
app.use('/', router);



var authUser = function(id, password, callback) {
	console.log('authUser 호출됨 : ' + id + ', ' + password);
	
	// 커넥션 풀에서 연결 객체를 가져옴
	pool.getConnection(function(err, conn) {
        if (err) {
        	if (conn) {
                conn.release();  // 반드시 해제해야 함
            }
            callback(err, null);
            return;
        }   
        console.log('데이터베이스 연결 스레드 아이디 : ' + conn.threadId);
          
        var columns = ['id', 'name', 'age'];
        var tablename = 'users';
 
        // SQL 문을 실행합니다.
        var exec = conn.query("select ?? from ?? where id = ? and password = ?", [columns, tablename, id, password], function(err, rows) {
            conn.release();  // 반드시 해제해야 함
            console.log('실행 대상 SQL : ' + exec.sql);
            
            if (rows.length > 0) {
    	    	console.log('아이디 [%s], 패스워드 [%s] 가 일치하는 사용자 찾음.', id, password);
    	    	callback(null, rows);
            } else {
            	console.log("일치하는 사용자를 찾지 못함.");
    	    	callback(null, null);
            }
        });
    });
	
}

//사용자를 등록하는 함수 
//addUser함수에는 다섯개의 파라미터를 전달함
//id,name,age,password 파라미터는 웹 브라이저에서 요청할 때 전달한 요청 파라미터
//callback은 결과를 처리할!!!!!!!! 콜백함수이다.
var addUser = function(id, name, age, password, callback) {
	console.log('addUser 호출됨');

	//컨넥션 풀에서 연결 객체를 가져옵니다.
	//pool객체의 getConnetion 메소드를 호출하면 커넥션 풀에서 연결객체를 하나 가져올 수 있다.
	//연결객체를 성공적으로 가져오면 콜백함수가 호출됨(정해져있는거임 시스템상)
	//콜백함수가 호출되면서 conn파라미터로 연결객체가 전달된다.
	//연결객체에는 query 메소드가 있어 SQL문을 실행할 수 있다. 
	pool.getConnection(function(err,conn){
		if(err){
			if(conn){
				conn.release(); // 반드시 해제해야 합니다.
			}

			callback(err, null);
			return;
		}

		console.log('데이터베이스 연결 스레드 아이디: ' + conn.threadId);

		//데이터를 객체로 만듭니다.
		var data = {id:id, name:name, age:age, password:password};

		//SQL문을 실행합니다.
		//SQL문 안에 ? 기호를 넣을 수 있는데 이 기호는 query메소드를 호출할때 전달되는
		//추가파라미터를 사용해 대체한 후 실행된다. 여기서는 data값이 ?로 들어가 실행된다는말.
		//아래의 실행쿼리는 insert into users set id='test01',name='김준수',age= 20,password='123456'
		//의 형식으로 실제쿼리가 되어진다.
		//SQL문이 실행되면 콜백함수가 호출되면서 결과가 result 파라미터로 전달된다.ex)function(err,result)
		//SQL문을 실행한 후에는 연결객체의 release메소드를  호출하여 연결 객체를 커넥션 풀로 반환해야한다.
		//쿼리의 실행결과는 콜백함수 쪽에서 처리할수 있도록 callback(null,result)코드를 넣어
		//콜백함수를 실행합니다.
		var exec = conn.query('insert into users set ?',data, function(err,result){
			conn.release(); //반드시 해제해야합니다.
			console.log('실행 대상 SQL '+ exec.sql);

			if(err){
				console.log('SQL 실행 시 오류 발생함.');
				console.dir(err);

				callback(err,null);

				return;
			}

			callback(null,result);
		});
	});
}

// 404 에러 페이지 처리
var errorHandler = expressErrorHandler({
 static: {
   '404': './public/404.html'
 }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );


// Express 서버 시작
http.createServer(app).listen(app.get('port'), function(){
  console.log('서버가 시작되었습니다. 포트 : ' + app.get('port'));

});
