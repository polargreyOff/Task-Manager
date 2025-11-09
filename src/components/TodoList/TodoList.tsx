import { useEffect } from "react";
import { useAppDispatch, useAppSelector, useFilteredItems } from "../../hooks/hooks";
import TodoItem from "../TodoItem/TodoItem";
import { fetchTodos } from "../../store/actions/todoActions";
import { useParams } from "react-router-dom";
import { Preloader } from "../../UI/Preloader";
import styles from "./TodoList.module.css"
import { ModalClose, ModalOpen } from "../../store/actions/UIactions";
import { CreateTodoModal } from "../createTodoModal/CreateTodoModal";
import { deleteGroup, fetchGroups } from "../../store/actions/groupsActions";
import FilterMenu from "../FilterMenu/FilterMenu";
import { useNavigate } from "react-router-dom";

const TodoList = () => {
    const todos = useAppSelector(store => store.todos);
    const error = useAppSelector(store => store.UIstate.errors.todos);
    const { todos: loading, createTodo: createLoading } = useAppSelector(store => store.UIstate.loading);
    const modal = useAppSelector(store => store.UIstate.modals.createTodo);
    const filters = useAppSelector(store => store.UIstate.filters.todos)
    const { id: groupId } = useParams();
    const group = useAppSelector(store => store.groups).find(group => group.id === groupId);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleModal = () => {
        dispatch(ModalOpen("createTodo"))
    }
    const filteredTodos = useFilteredItems(todos, filters, groupId);

    const handleDeleteGroup = (e: React.MouseEvent, groupId: string) => {
        e.preventDefault();
        e.stopPropagation();
        if (window.confirm(`Вы точно хотите удалить группу ${group!.title} со всеми её задачами`)) {
            dispatch(deleteGroup(groupId))
            navigate("/");
        }
    }

    useEffect(() => {
        if (!group) {
            dispatch(fetchGroups())
        }
    }, [group, dispatch])
    useEffect(() => {
        if (groupId) {
            const hasTodosForThisGroup = todos.some(todo => todo.group_id === groupId);

            if (!hasTodosForThisGroup) {
                dispatch(fetchTodos(groupId));
            }
        }
    }, [dispatch, groupId])
    if (error) {
        return (
            <div className="container">
                <h1>Ошибка</h1>
            </div>

        )
    }
    if (loading) {
        return (
            <div className="container">
                <Preloader />
            </div>
        )
    }
    if (!group) {
        return (
            <div className="container">
                <h1>Такой группы нет</h1>
            </div>
        )
    }
    return (
        <div className="container">
            <FilterMenu />
            {filteredTodos.map(todo => (<TodoItem key={todo.id} {...todo} />))}
            <div className={styles.addTodo}>
                {createLoading && (
                    <Preloader />
                )}
            </div>
            <div className={styles.buttonsRow}>
                <div className={styles.button}>
                    <button onClick={handleModal} className={styles.addTodoButton}>Добавить Задачу</button>
                </div>
                <div className={styles.button}>
                    <button onClick={(e,) => { handleDeleteGroup(e, groupId!) }} className={styles.deleteGroupButton}>Удалить группу</button>
                </div>
            </div>

            {modal && (
                <CreateTodoModal group_color={group!.color} group_id={groupId}
                    onClose={() => { dispatch(ModalClose("createTodo")) }}
                />
            )}

        </div>
    )
}
export default TodoList;