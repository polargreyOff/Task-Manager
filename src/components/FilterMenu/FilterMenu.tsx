import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import styles from "./FilterMenu.module.css"
import { FiltersSet, FiltersReset } from "../../store/actions/UIactions";

const FilterMenu = () => {
    const { completed, sortOrder, priority } = useAppSelector(store => store.UIstate.filters.todos);
    const dispatch = useAppDispatch();
    const handleSortOrder = (order: string) => {
        if (order === "asc") {
            order = "desc"
        } else if (order === "desc") {
            order = "asc"
        }
        dispatch(FiltersSet("sortOrder", order))
    }
    const handleReset = () => {
        dispatch(FiltersReset());
    }
    return (
        <div className={styles.filters}>
            <div className={styles.select}>
                <select
                    value={completed}
                    onChange={(e) => dispatch(FiltersSet('completed', e.target.value))}
                >
                    <option value="all">Все задачи</option>
                    <option value="active">Только активные</option>
                    <option value="completed">Только выполненные</option>
                </select>
            </div>
            <div className={styles.select}>
                <select
                    value={priority}
                    onChange={(e) => dispatch(FiltersSet('priority', e.target.value))}
                >
                    <option value="all">Любой приоритет</option>
                    <option value="low">Низкий приоритет</option>
                    <option value="mid">Средний приоритет</option>
                    <option value="high">Высокий приоритет</option>
                </select>
            </div>
            <div className={styles.radio}>
                <button
                    onClick={() => { handleSortOrder(sortOrder) }}
                    className={sortOrder === 'asc' ? styles.active : ''}
                >
                    {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
            </div>
            <div className={styles.reset}>
                <button onClick={handleReset}>Сбросить фильтры</button>
            </div>
        </div>
    )
}

export default FilterMenu;