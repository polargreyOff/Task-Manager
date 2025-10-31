import { FC } from "react";
import { ITodo } from "../../types/types";
import styles from "./TodoItem.module.css"
import { useAppDispatch } from "../../hooks/hooks";
import { TodoToggle } from "../../store/actions/todoActions";

const TodoItem: FC<ITodo> = ({ id, title, description, priority, date, completed, color }) => {
    const correctDate = new Date(date).toLocaleString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const dispatch = useAppDispatch()
    const handleClick = (id: string) => {
        dispatch(TodoToggle(id))
    }

    const gradientStyle = {
        background: `linear-gradient(135deg, ${color} 0%, ${color}40 100%)`,
    };
    return (
        <div onClick={() => { handleClick(id) }} style={gradientStyle} className={styles.item}>
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
                            <button className={styles.deleteButton}>Удалить</button>
                        </div>
                    )}
                </div>

            </div>

        </div>
    )
}
export default TodoItem;