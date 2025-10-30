import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import styles from "./TodayTasks.module.css"
import { Preloader } from "../../UI/Preloader";
import { fetchTodayTodos } from "../../store/actions/todayTodosActions";
import TodayTasksItem from "../todayTasksItem/todayTasksItem";

const TodayTasks = () => {
    const todayTodos = useAppSelector(state => state.todayTodos);
    const error = useAppSelector(store => store.UIstate.errors.todayTodos)
    const loading = useAppSelector(store => store.UIstate.loading.todayTodos)
    const loaded = useAppSelector(store => store.UIstate.loaded.todayTodos)
    const dispatch = useAppDispatch();


    useEffect(()=>{
        if (!loaded) {
            dispatch(fetchTodayTodos());
        }
    }, [dispatch,loaded])
    if (error) {
        return (
            <div className={styles.item}>
                <h2>Произошла Ошибка</h2>
            </div>
        )
    }
    if (loading) {
        return (
            <div className={styles.item}>
                <Preloader/>
            </div>
        )
    }
    return (
        <div className={styles.item}>
            <div className={styles.tasksBody}>
                <h1 className={styles.title}>{new Date().toLocaleDateString()}</h1>
                {todayTodos.length === 0 ? (
                    <p>На сегодня задач нет</p>
                ): (
                    todayTodos.map(todo => <TodayTasksItem key={todo.id} {...todo}/>)
                )}
            </div>
        </div>


    )
}

export default TodayTasks;