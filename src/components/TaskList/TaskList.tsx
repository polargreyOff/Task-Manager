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
                <Preloader/>
        )
    }
    if (error) {
        return (
                <h1>Произошла ошибка</h1>
        )
    }
    return (
            <ul className={styles.row}>
            {groups.map(group => (<TaskItem key={group.id} {...group}/>))}
            </ul>
        
    )
}
export default TaskList;