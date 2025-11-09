import Header from "./components/layout/header/Header";
import Footer from "./components/layout/footer/Footer";
import TaskList from "./components/TaskList/TaskList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoList from "./components/TodoList/TodoList";
import styles from "./app.module.css"
import { store } from "./store";
import { Provider } from "react-redux";
import MainBlock from "./components/main/main";
import NotFound from "./components/NotFound/NotFound";

const app = () => {
  return (
    <Provider store={store}>
      <Router>
        <div className={styles.app}>
          <Header />
          <div className={styles.mainContent}>
            <Routes>
              <Route path="/" element={<MainBlock/>} />
              <Route path="/todoList/:id" element={<TodoList />} />
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>

  )
}
export default app;