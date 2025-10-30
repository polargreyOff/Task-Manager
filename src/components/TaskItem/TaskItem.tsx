import { FC } from "react"
import styles from "./TaskItem.module.css"
import { useNavigate } from "react-router-dom"

import { IGroup } from "../../types/types"

export const TaskItem: FC<IGroup> = ({ title, color, id }) => {
    const navigate = useNavigate()
    const gradientStyle = {
        background: `linear-gradient(135deg, ${color} 0%, ${color}30 100%)`,
        boxShadow: `0 4px 12px ${color}30`,
        border: `1px solid ${color}40`
    };
    return (
        <div 
        onClick={()=> {navigate(`/todolist/${id}`)}}
        className={styles.row__item}>
            <div className={styles.row__content} style={gradientStyle}>
                <div className={styles.row__title}>
                    <h2>{title}</h2>
                    <p>доступно задач: 5</p>
                </div>
            </div>
        </div>
    )

}