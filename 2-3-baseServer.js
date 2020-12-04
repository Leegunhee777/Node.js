//파일 이미지를 읽어 클라이언트의 요청에 응답하는 예제

var http = require('http');
var fs = require('fs');


//웹서버 객체를 만듭니다.
var server = http.createServer();

//웹서버를 시작하여 3000번 포트에서 대기하도록 설정합니다.
var port = 3000;

server.listen(port,function(){
    console.log('웹 서버가 시작되었습니다: %d',port);
});

server.on('request',function(req,res){
    console.log('클라이언트 요청이 들어왔습니다.');

    var filename = 'house.png';
    fs.readFile(filename,function(err,data){
        res.writeHead(200,{"Content-Type":"image/png"});
        res.write(data);
        res.end();
    });
});
