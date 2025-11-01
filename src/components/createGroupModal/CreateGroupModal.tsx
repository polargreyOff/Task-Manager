// components/CreateGroupModal/CreateGroupModal.tsx
import { useState } from 'react';
import { useAppDispatch } from '../../hooks/hooks';
import { createGroup } from '../../store/actions/groupsActions';
import styles from './createGroupModal.module.css';

interface CreateGroupModalProps {
    onClose: () => void;
}

// Палитра цветов для групп
const GROUP_COLOR_PRESETS = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57',
    '#ff9ff3', '#54a0ff', '#5f27cd', '#00d2d3', '#ff9f43',
    '#10ac84', '#ee5a24', '#0984e3', '#a29bfe', '#fd79a8',
    '#bdc581', '#9b59b6', '#1abc9c', '#f1c40f', '#e67e22'
];

const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ 
    onClose 
}) => {
    const [title, setTitle] = useState('');
    const [selectedColor, setSelectedColor] = useState(GROUP_COLOR_PRESETS[0]);
    const dispatch = useAppDispatch();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!title.trim()) return;

        dispatch(createGroup({
            title: title.trim(),
            color: selectedColor
        }));

        onClose();
    };

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <h2>Новая группа</h2>
                
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Название группы *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Введите название группы"
                            required
                            autoFocus
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Цвет группы</label>
                        <div className={styles.colorPicker}>
                            {GROUP_COLOR_PRESETS.map((color) => (
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
                            Создать группу
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;