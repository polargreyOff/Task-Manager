import { useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import styles from "./header.module.css";
import { logout } from "../../../store/actions/authActions";

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {username, isAuthenticated} = useAppSelector(state => state.auth);
    const userLogout = () => {
        dispatch(logout());
    }
    return (
        <div className={styles.header}>
            <div className="container">
                <div className={styles.row}>
                    <h1 
                    onClick={()=> {navigate("/")}}
                    className={styles.title}>Task Manager</h1>
                    <div className={styles.search}>
                        {!isAuthenticated ?
                            (
                                <div onClick={()=> {navigate("/login")}}>
                                    <p>Войти</p>
                                </div>
                            )
                        :
                        (
                            <div className={styles.logout__row}>
                                <p>{username}</p>
                                <button onClick={userLogout}>Выйти</button>
                            </div>
                        )
                        }
                    </div>
                </div>

            </div>
        </div>  

    )
}

export default Header;