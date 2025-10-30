import { useNavigate } from "react-router-dom";
import styles from "./header.module.css";

const Header = () => {
    const navigate = useNavigate()
    return (
        <div className={styles.header}>
            <div className="container">
                <div className={styles.row}>
                    <h1 
                    onClick={()=> {navigate("/")}}
                    className={styles.title}>Task Manager</h1>
                    <div className={styles.search}>
                        <p>Войти</p>
                    </div>
                </div>

            </div>
        </div>  

    )
}

export default Header;