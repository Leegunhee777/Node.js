var http = require('http');

//웹서버 객체를 만듭니다.
var server = http.createServer();

//웹서버를 시작하여 3000번 포트에서 대기하도록 설정합니다.
var port = 3000;
server.listen(port,function(){
    console.log('웹 서버가 시작되었습니다: %d',port);
});

//클라이언트 연결 이벤트 처리 (1)
//:웹 브라우저와 같은 클라이언트가 웹 서버에 연결되면 connection 이벤트가 발생한다.
//:'connection'이벤트를 첫번째 파라미터로 전달하고,
//연결이 만들어져 콜백함수가 호출될 떄는 Socket객체가 파라미터로 전달된다.
//이 객체는 클라이언트 연결 정보를 담고 있으므로 address()메소드를 호출하여
//클라이언트 측의 IP와 포트 정보를 확인할 수 있따.
server.on('connection',function(socket){
    var addr = socket.address();
    console.log('클라이언트가 접속했습니다 : %s, %d',addr.address,addr.port);
})

//클라이언트 연결 이벤트 처리 (2)
//클라이언트가 특정 패스로 요청을 하면 request이벤트가 발생한다.다.
//콜백 메소드로 전될되는 요청 객체를 console.dir()메소드를 통해 어떤 정보가 들어있는지 확인할 수 있다.
//서버에서 응답을 보내도록 request이벤트를 처리하는 콜백함수 안에 res를 이용해 요청에,응답해보자
server.on('request',function(req,res){
    console.log('클라이언트 요청이 들어왔습니다.');
   // console.dir(req);
    res.writeHead(200,{"Content-Type":"text/html;charset=utf-8"});
    res.write("<!DOCTYPE html>");
    res.write("<html>");
    res.write("<head>");
    res.write("<title>응답페이지</title>");
    res.write("</head>");
    res.write("<body>");
    res.write("<h1>노드제이에스로부터의 응답 페이지<h1>");
    res.write("</body>");
    res.write("</html>");
    res.end();
});

//서버 종료 이벤트 처리
server.on('close',function(){
    console.log('서버가 종료됩니다.');
});



//웹 서버를 실행시키고, 웹브라우저를 열어 주소창에 localhost:3000을 입력하여 사이트를 열어보자.