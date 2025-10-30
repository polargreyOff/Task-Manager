import styles from "./footer.module.css"

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className="container">
                <h2 className={styles.copyright}>© 2025 TodoList. Все права защищены.</h2>
            </div>
        </div>
    )
}

export default Footer;