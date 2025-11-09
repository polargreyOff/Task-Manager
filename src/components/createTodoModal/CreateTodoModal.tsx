// components/CreateTodoModal/CreateTodoModal.tsx
import { useState } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { createTodo } from '../../store/actions/todoActions';
import styles from './CreateTodoModal.module.css';
import { fetchTodayTodos } from '../../store/actions/todayTodosActions';

interface CreateTodoModalProps {
    group_id: string | undefined;
    group_color: string;
    onClose: () => void;
}

// Палитра цветов для выбора
const COLOR_PRESETS = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
    '#10ac84', '#ee5a24', '#0984e3', '#a29bfe', '#fd79a8'
];

export const CreateTodoModal: React.FC<CreateTodoModalProps> = ({ 
    group_id, 
    group_color,
    onClose 
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'mid' | 'high'>('mid');
    const [selectedColor, setSelectedColor] = useState(group_color);
    const [dueDate, setDueDate] = useState('');
    const dispatch = useAppDispatch();

    // Устанавливаем минимальную дату (сегодня) и дефолтную (завтра)
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const minDate = today.toISOString().split('T')[0];
    const defaultDate = tomorrow.toISOString().split('T')[0];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!group_id || !title.trim()) return;

        // Если дата не выбрана, используем завтрашнюю
        const finalDueDate = dueDate 
            ? new Date(dueDate).toISOString()
            : new Date(defaultDate).toISOString();

        dispatch(createTodo({
            group_id,
            title: title.trim(),
            description: description.trim(),
            priority,
            completed: false,
            date: finalDueDate,
            color: selectedColor,
            group_color
        }));
        dispatch(fetchTodayTodos());

        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const formatDateDisplay = (dateString: string) => {
        if (!dateString) return 'Не выбрана';
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <h2>Новая задача</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Название *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введите название задачи"
                            required
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Описание</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Описание задачи (необязательно)"
                            rows={3}
                        />
                    </div>

                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <label>Приоритет</label>
                            <select 
                                value={priority} 
                                onChange={(e) => setPriority(e.target.value as any)}
                            >
                                <option value="low">Низкий</option>
                                <option value="mid">Средний</option>
                                <option value="high">Высокий</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor='dueDate'>Дедлайн</label>
                            <input
                                id="dueDate"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                min={minDate}
                                className={styles.dateInput}
                            />
                            <div className={styles.dateDisplay}>
                                {formatDateDisplay(dueDate)}
                            </div>
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Цвет задачи</label>
                        <div className={styles.colorPicker}>
                            {COLOR_PRESETS.map((color) => (
                                <button
                                    key={color}
                                    type="button"
                                    className={`${styles.colorOption} ${
                                        selectedColor === color ? styles.colorOptionActive : ''
                                    }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                    title={color}
                                />
                            ))}
                        </div>
                        <div className={styles.selectedColor}>
                            Выбранный цвет: 
                            <span 
                                className={styles.colorPreview} 
                                style={{ backgroundColor: selectedColor }}
                            />
                            <span className={styles.colorHex}>{selectedColor}</span>
                        </div>
                    </div>

                    <div className={styles.buttons}>
                        <button type="button" onClick={onClose}>
                            Отмена
                        </button>
                        <button type="submit" disabled={!title.trim()}>
                            Создать
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};