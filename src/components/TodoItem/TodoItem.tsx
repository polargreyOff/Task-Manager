import { FC } from "react";
import { ITodo } from "../../types/types";
import styles from "./TodoItem.module.css"

const TodoItem: FC<ITodo> = ({ id, title, description, priority, date, completed, color }) => {
    const correctDate = new Date(date).toLocaleString('ru-RU', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    });
    const gradientStyle = {
        background: `linear-gradient(135deg, ${color} 0%, ${color}40 100%)`,
    };
    return (
        <div style={gradientStyle} className={styles.item}>
            <div className={styles.text}>
                 <h2>{title}</h2>
                <p>{description}</p>
            </div>
           
            <div className={styles.date}>
                <p>{correctDate}</p>
            </div>
        </div>
    )
}
export default TodoItem;