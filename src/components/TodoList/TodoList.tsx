import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import TodoItem from "../TodoItem/TodoItem";
import { fetchTodos } from "../../store/actions/todoActions";
import { useParams } from "react-router-dom";
import { Preloader } from "../../UI/Preloader";

const TodoList = () => {
    const todos = useAppSelector(store => store.todos);
    const error = useAppSelector(store => store.UIstate.errors.todos)
    const loading = useAppSelector(store => store.UIstate.loading.todos)
    const {id: groupId} = useParams();
    const dispatch = useAppDispatch();
    useEffect(()=> {
        if (groupId) {
            const hasTodosForThisGroup = todos.some(todo => todo.groupId === groupId);
            
            if (!hasTodosForThisGroup) {
                dispatch(fetchTodos(groupId));
            }
        }  
    }, [dispatch, groupId])
    const groupTodos = todos.filter(todo => todo.groupId === groupId);
    if (error) {
        return (
            <h1>Ошибка</h1>
        )
    }
    if (loading) {
        return (
            <div className="container">
                <Preloader/>
            </div>
        )
    }
    return (
        <div className="container">
            {groupTodos.map(todo => (<TodoItem key={todo.id} {...todo}/>))}
            
        </div>
    )
}
export default TodoList;