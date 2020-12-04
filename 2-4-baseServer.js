//http를 이용하여 다른 웹서버에 요청을하여 data를 가져올수도 있다.

var http = require('http');

var options = {
    host: 'www.google.com',
    port: 80,
    path:'/'
};

var req = http.get(options, function(res){
    //응답처리
    var resData = '';
    res.on('data',function(chunk){
        resData += chunk;
    });


    res.on('end',function(){
        console.log(resData);
    });
});

req.on('error',function(err){
    console.log("오류발생:" +err.message);
});