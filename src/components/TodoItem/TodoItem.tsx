import { FC, ReactEventHandler } from "react";
import { ITodo } from "../../types/types";
import styles from "./TodoItem.module.css"
import { useAppDispatch } from "../../hooks/hooks";
import { TodoToggle } from "../../store/actions/todoActions";
// import { toggleTodoRequest } from "../../services/fakeapi";
import { toggleTodoRequest } from "../../services/api";
import { deleteTodo } from "../../store/actions/todoActions";
import { fetchTodayTodos } from "../../store/actions/todayTodosActions";

const TodoItem: FC<ITodo> = ({ id, title, description, priority, date, completed, color }) => {
    const correctDate = new Date(date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const dispatch = useAppDispatch()
    const handleToggle = (id: string) => {
        dispatch(TodoToggle(id));
        toggleTodoRequest(id);
    }

    const handleDelete = (event: React.MouseEvent, id: string) => {
        event.stopPropagation();
        if (window.confirm(`Удалить задачу ${title}?`)) {
            dispatch(deleteTodo(id));
            dispatch(fetchTodayTodos());
        }
    }

    const gradientStyle = {
        background: `linear-gradient(135deg, ${color} 0%, ${color}40 100%)`,
    };
    return (
        <div onClick={() => { handleToggle(id) }} style={gradientStyle} className={styles.item}>
            <div className={styles.row}>
                <div className={styles.info}>
                    <div className={`${styles.text} ${completed ? styles.completed : ''}`}>
                        <h2>{title}</h2>
                        <p>{description}</p>
                    </div>

                    <div className={styles.date}>
                        <p>{correctDate}</p>
                    </div>
                </div>
                <div className={styles.priority}>
                    <h2>приоритет: {priority}</h2>
                    {completed && (
                        <div>
                            <button onClick={(e)=> {handleDelete(e,id)}} className={styles.deleteButton}>Удалить</button>
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}
export default TodoItem;