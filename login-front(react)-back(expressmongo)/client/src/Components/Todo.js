import React, {useState, useEffect} from 'react';

const Todo = ({setHasCookie, removeCookie,cookies,hasCookie }) =>{

    const [todos, setTodos] = useState('');
    
    const [ userId2, setUserId2] = useState('');
    const [ content, setUsercontent] = useState('');
   
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        const getAllTodoApi = () => {
            return new Promise((resolve, reject) => {
                fetch('/todos',{
                    signal: signal,
                    method: 'GET',
                    headers: {
                        'Content-Type' : 'application/json'
                    }
                })
                .then(res => resolve(res.json()))
                .catch(err => reject(err));
            });
        };

        const onTodoLoad = async() => {
            try {
                const response = await getAllTodoApi();
                console.log(response.todos);
                
                if(response.error === 'token expired'){
                    setHasCookie(false);
                }
                else {
                    setTodos(response.todos[0].content);
                  //  setTodos(response.todos);
                }
            }
            catch(err){
                console.log(err);
            }
        };

        if(!todos){
            onTodoLoad();
        }

        return() => {
            abortController.abort();
        }
    },[todos,setHasCookie]);


    
    const createtodoApi = (user) => {
        return fetch('/todos/ttt', {
            method:'POST',
            body: JSON.stringify(user),
            headers: {
                'Content-Type' : 'application/json'
            }
        }).then(response => response.json());
    };


const handleSubmit2 = async (e) => {
    e.preventDefault();

    try {
         await createtodoApi({
            user_id : userId2,
            content : content,
            
        });

    }
    catch(err){
        console.error('login error',err);
        alert('회원가입에 실패하였습니다. 잠시 후 다시 시도해주시요.');
    }
};
    return(
        <div>할일입력하기 

{cookies}
<br/>
{todos && <div>{todos}+"11111"</div>}
{hasCookie && <div>쿠키를가지고있다.</div>} 
            <h2>
                Todo
                <button
                type = "button"
                onClick ={removeCookie}
                >
                    logout
                </button>

            </h2>
            <h2>Join</h2>
            <form 
                onSubmit = {handleSubmit2}
                >
                    <input
                    type = "text"
                    name = "user_id"
                    value = {userId2}
                    onChange ={e => setUserId2(e.target.value)}
                    placeholder = "id"
                    />

                    <input
                    type = "password"
                    name = "content"
                    value = {content}
                    onChange ={e => setUsercontent(e.target.value)}
                    placeholder = "content"
                    />


                    <button
                        type = "submit"
                        >
                            제출
                        </button>
            </form>
            {/*
            <ul>
                {todos && (
                    todos.map(todo => (
                        <li key={todo._id}>
                            <span>{todo.content}</span>
                            <span>{todo.created_at}</span>

                            <input
                                type ="checkbox"
                                value = {todo.complete}/>
                                    
                        </li>
                    ))
                )}
            </ul>*/}
        </div>
    );
};

export default Todo;