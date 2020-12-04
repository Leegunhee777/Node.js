//Express 기본 모듈 불러오기
//js 파일 실행은 node app.js 로 실행시킨다
var express = require('express')
,http = require('http');

//익스프레스 객체 생성
var app = express();

//기본 포트를 app 객체에 속성으로 설정
app.set('port',process.env.PORT || 3000);

//Express 서버시작

http.createServer(app).listen(app.get('port'),function(){
    console.log('익스프레스 서버를 시작했습니다:'+ app.get('port'));
});