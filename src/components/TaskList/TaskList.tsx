import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchGroups } from "../../store/actions/groupsActions";
import { Preloader } from "../../UI/Preloader";
import { TaskItem } from "../TaskItem/TaskItem";
import styles from "./TaskList.module.css"

const TaskList = () => {
   const groups = useAppSelector(store => store.groups);
    const loading = useAppSelector(store => store.UIstate.loading.groups);
    const error = useAppSelector(store => store.UIstate.errors.groups);
    const dispatch = useAppDispatch();
    useEffect(() => {
        if (groups.length === 0) {
            dispatch(fetchGroups());
        }
    }, [dispatch, groups.length])

    if (loading) {
        return (
            <div className="container">
                <Preloader/>
            </div>
        )
    }
    if (error) {
        return (
            <div className="container">
                <h1>Произошла ошибка</h1>
            </div>
        )
    }
    return (
        <div className="container">
            <ul className={styles.row}>
            {groups.map(group => (<TaskItem key={group.id} {...group}/>))}
            </ul>
        </div>
        
    )
}
export default TaskList;