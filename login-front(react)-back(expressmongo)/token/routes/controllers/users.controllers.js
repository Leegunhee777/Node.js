const User = require('../../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const YOUR_SECRET_KEY = process.env.SECRET_KEY;

//token을 생성하는 createToken 메소드는
//req.body로 전달되는 id와 pw정보를 이용하여 user DB를 검색하고
//해당 user가 있는 경우에 jwt를 새로 생성하여 쿠키에 저장하고, 201응답을 반환한다.
exports.createToken = async function (req, res, next) {
    try {
            const user = await User.find(req.body);
            
            if (user.length) {
                const token = jwt.sign({user_id: user[0].user_id
                }, YOUR_SECRET_KEY, {expiresIn: '1h'});

                res.cookie('user', token);
                res.status(201).json({
                result: 'ok',
                token
                });
            } 
            else {
                res.status(400).json({ error: 'invalid user' });
            }
        } 
        catch (err) {
            console.error(err);
            next(err);
        }
};


//새로운 user를 생성하는 createNewUser메소드는
//req.body로 전달되는 정보를 DB에 저장하고 201 응답을 보낸다.
exports.createNewUser = async function (req, res, next) {
    try {
        const user = await new User(req.body).save();
        res.status(201).json({
result: 'ok',
user: user
});
    } 
    catch (err) {
        console.error(err);
        next(err);
    }
};

