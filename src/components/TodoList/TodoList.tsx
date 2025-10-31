import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import TodoItem from "../TodoItem/TodoItem";
import { fetchTodos } from "../../store/actions/todoActions";
import { useParams } from "react-router-dom";
import { Preloader } from "../../UI/Preloader";
import styles from "./TodoList.module.css"
import { ModalClose, ModalOpen } from "../../store/actions/UIactions";
import { CreateTodoModal } from "../createTodoModal/CreateTodoModal";
import { fetchGroups } from "../../store/actions/groupsActions";

const TodoList = () => {
    const todos = useAppSelector(store => store.todos);
    const error = useAppSelector(store => store.UIstate.errors.todos);
    const loading = useAppSelector(store => store.UIstate.loading.todos);
    const modal = useAppSelector(store => store.UIstate.modals.createTodo);
    const createLoading = useAppSelector(store => store.UIstate.loading.createTodo);
    const {id: groupId} = useParams();
    const group = useAppSelector(store => store.groups).find(group => group.id === groupId);
    const dispatch = useAppDispatch();
    const handleModal = () => {
        dispatch(ModalOpen("createTodo"))
    }
    useEffect(()=> {
        if (!group) {
            dispatch(fetchGroups())
        }
    })
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
            <div className={styles.addTodo}>
                {createLoading && (
                    <Preloader/>
                )}
                <button onClick={handleModal} className={styles.addTodoButton}>Добавить Задачу</button>
            </div>
            {modal && (
                <CreateTodoModal groupColor={group!.color} groupId={groupId}
                onClose={()=> {dispatch(ModalClose("createTodo"))}}
                />
            )}
            
        </div>
    )
}
export default TodoList;