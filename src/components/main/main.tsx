import TaskList from "../TaskList/TaskList";
import TodayTasks from "../TodayTasks/TodayTasks";
import styles from "./main.module.css"

const MainBlock = () => {
    return (
        <div className="container">
            <div className={styles.row}>
                <div className={styles.rowTaskList}>
                    <TaskList />
                </div>
                <div className={styles.rowTodayTasks}>
                    <TodayTasks />
                </div>

            </div>
        </div>

    )
}

export default MainBlock;