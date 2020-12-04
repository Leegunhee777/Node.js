const jwt = require('jsonwebtoken');
const YOUR_SECRET_KEY = process.env.SECRET_KEY;
require('dotenv').config();

//로그인을 하고 난후 보내는 API 요청마다 쿠기 정보를 검사하여
//쿠기에 있는 jwt가 유효한지 검사해야한다.
//jwt가 유효한지 확인할 때는 jwt.verify()메소드를 사용한다.
//만약 jwt가 유효하다면 사용자 정보가 담긴 객첵 반환될것이고
//jwt가 유효하지 않거나 expired되었다면 에러가 발생할것이다.

//만약 jwt가 유효하여 사용자 정보가 담긴 객체를 반환받았다면,
//객체에 든 내용은 res.locals에 저장하여 다음에 호출될 함수에 값을 전달한다.

const verifyToken = (req, res, next) => {
    try {
        const clientToken = req.cookies.user;
        const decoded = jwt.verify(clientToken, YOUR_SECRET_KEY);

        if (decoded) {
        res.locals.userId = decoded.user_id;
        next();
        }
        else {
        res.status(401).json({ error: 'unauthorized' });
        }
    } 
    catch (err) {
    res.status(401).json({ error: 'token expired' });
    }
};

exports.verifyToken = verifyToken;

