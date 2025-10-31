import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchGroups } from "../../store/actions/groupsActions";
import { Preloader } from "../../UI/Preloader";
import { TaskItem } from "../TaskItem/TaskItem";
import styles from "./TaskList.module.css"

const TaskList = () => {
   const groups = useAppSelector(store => store.groups);
    const loading = useAppSelector(store => store.UIstate.loading.groups);
    const error = useAppSelector(store => store.UIstate.errors.groups);
    const [search, setSearch] = useState<string>("");
    const dispatch = useAppDispatch();

    const searchGroups = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const filteredGroups = useMemo(()=> {
        if (search.trim().length === 0) {
            return groups
        }
        return groups.filter(group => (
            group.title.toLowerCase().includes(search.toLowerCase())
        ))
    }, [search, groups])

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
        <div>
            <div className={styles.input}>
                <input onChange={searchGroups} placeholder="Поиск группы" type="text" name="search"/>
            </div>
            {filteredGroups.length > 0 ? (
                <ul className={styles.row}>
                    {filteredGroups.map(group => (<TaskItem key={group.id} {...group}/>))}
                </ul>
                
            ): (
                <p>Группы не найдены</p>
            )}
        </div>
            
        
    )
}
export default TaskList;