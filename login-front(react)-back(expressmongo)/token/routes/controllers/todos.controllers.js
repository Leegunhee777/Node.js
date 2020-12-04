const Todo = require('../../models/Todo');

//todo 요청을 받았을 경우 아까 미들웨어함수에서 res.locals에 저장했던
//user_id에 해당하는 todo 리스트를 찾아서 response로 보낸다.
exports.getAll = async function (req, res, next) {
    try {
        console.log("안녕 get요청>")
        const allTodos = await Todo.find({user_id :res.locals.userId});
        console.log(allTodos);
        res.json({ todos: allTodos });
        
    } 
    catch (err) {
        next(err);
    }
};

exports.createNewtodo = async function (req, res, next) {
    try {
        const user = await new Todo(req.body).save();
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
