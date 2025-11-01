import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchGroups } from "../../store/actions/groupsActions";
import { Preloader } from "../../UI/Preloader";
import { TaskItem } from "../TaskItem/TaskItem";
import styles from "./TaskList.module.css"
import CreateGroupModal from "../createGroupModal/CreateGroupModal";
import { ModalClose, ModalOpen } from "../../store/actions/UIactions";

const TaskList = () => {
    const groups = useAppSelector(store => store.groups);
    const { groups: loading, createGroup: createLoading } = useAppSelector(store => store.UIstate.loading);
    const error = useAppSelector(store => store.UIstate.errors.groups);
    const [search, setSearch] = useState<string>("");
    const dispatch = useAppDispatch();
    const modal = useAppSelector(store => store.UIstate.modals.createGroup)
    const searchGroups = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    }

    const handleOpenModal = () => {
        dispatch(ModalOpen("createGroup"))
    }

    const handleCloseModal = () => {
        dispatch(ModalClose("createGroup"))
    }

    const filteredGroups = useMemo(() => {
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
            <Preloader />
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
                <input onChange={searchGroups} placeholder="Поиск группы" type="text" name="search" />
            </div>
            {filteredGroups.length > 0 ? (
                <ul className={styles.row}>
                    {filteredGroups.map(group => (<TaskItem key={group.id} {...group} />))}

                    {createLoading && (
                        <div className={styles.row__item}>
                            <div className={styles.row__content}>
                                <Preloader />
                            </div>
                        </div>
                    )}

                    <div className={styles.row__item}>
                        <div
                        onClick={handleOpenModal}
                        className={styles.row__content} style={{backgroundColor: "grey"}}>
                            <div>
                                <h2 className={styles.row__title}>+</h2>
                            </div>
                        </div>
                    </div>
                </ul>

            ) : (
                <ul className={styles.row}>

                    {createLoading && (
                        <div className={styles.row__item}>
                            <div className={styles.row__content}>
                                <Preloader />
                            </div>
                        </div>
                    )}

                    <div className={styles.row__item}>
                        <div
                        onClick={handleOpenModal}
                        className={styles.row__content} style={{backgroundColor: "grey"}}>
                            <div>
                                <h2 className={styles.row__title}>+</h2>
                            </div>
                        </div>
                    </div> 

                </ul>
            )}
            {modal && (
                <CreateGroupModal onClose={handleCloseModal} />
            )}
        </div>


    )
}
export default TaskList;