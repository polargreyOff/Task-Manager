import { FC } from "react";
import { ITodo } from "../../types/types";
import styles from "./todayTaskItem.module.css"

const TodayTasksItem: FC<ITodo> = ({title, group_color}) => {
    const border ={borderLeft: `6px solid ${group_color}`} 
    return (
        <div className={styles.borderRadius}>
            <div style={border} className={styles.todoItem}>
                <h3>{title}</h3>
            </div>
        </div>
    )
}

export default TodayTasksItem;