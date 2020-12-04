//노드에 기본으로 들어있는 http 모듈을 사용하면 웹 서버 기능을 담당하는 서버 객체를 만들수 있다.
//http 모듈을 로딩했을 때 반환되는 객체에는 createServer()메소드가 정의 되어있다.
// 따라서 이 메소드를 호출하면 서버 객체를 만들수 있다.
//http모듈을 사용하여 웹서버를 만들수 있으나
//요즘엔 express모듈을 주로 사용하여 웹서버를 만든다!!!!!!!!!!!!!!!

var http = require('http');

//웹 서버 객체를 만듭니다.
var server = http.createServer();

//웹 서버를 시작하여 3000번 포트에서 대기합니다.
var port = 3000;
server.listen(port,function(){
    console.log('웹 서버가 시작되었습니다.: %d',port);
});