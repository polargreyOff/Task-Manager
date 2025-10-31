import { useEffect } from "react";
import { useAppDispatch, useAppSelector, useFilteredItems } from "../../hooks/hooks";
import TodoItem from "../TodoItem/TodoItem";
import { fetchTodos } from "../../store/actions/todoActions";
import { useParams } from "react-router-dom";
import { Preloader } from "../../UI/Preloader";
import styles from "./TodoList.module.css"
import { ModalClose, ModalOpen } from "../../store/actions/UIactions";
import { CreateTodoModal } from "../createTodoModal/CreateTodoModal";
import { fetchGroups } from "../../store/actions/groupsActions";
import FilterMenu from "../FilterMenu/FilterMenu";

const TodoList = () => {
    const todos = useAppSelector(store => store.todos);
    const error = useAppSelector(store => store.UIstate.errors.todos);
    const {todos: loading, createTodo: createLoading} = useAppSelector(store => store.UIstate.loading);
    const modal = useAppSelector(store => store.UIstate.modals.createTodo);
    const filters = useAppSelector(store => store.UIstate.filters.todos)
    const {id: groupId} = useParams();
    const group = useAppSelector(store => store.groups).find(group => group.id === groupId);
    const dispatch = useAppDispatch();
    const handleModal = () => {
        dispatch(ModalOpen("createTodo"))
    }
    const filteredTodos = useFilteredItems(todos, filters, groupId);
    
    useEffect(()=> {
        if (!group) {
            dispatch(fetchGroups())
        }
    }, [group, dispatch])
    useEffect(()=> {
        if (groupId) {
            const hasTodosForThisGroup = todos.some(todo => todo.groupId === groupId);
            
            if (!hasTodosForThisGroup) {
                dispatch(fetchTodos(groupId));
            }
        }  
    }, [dispatch, groupId])
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
            <FilterMenu/>
            {filteredTodos.map(todo => (<TodoItem key={todo.id} {...todo}/>))}
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