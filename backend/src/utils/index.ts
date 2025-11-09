// Конвертация дат между фронтом и бэкендом
export const formatDateForDB = (dateString: string): string => {
  // Преобразуем из фронтенд формата в DATE для БД
  return new Date(dateString).toISOString().split('T')[0];
};

export const formatDateForFrontend = (date: Date | string): string => {
  // Преобразуем из БД DATE в строку для фронтенда
  if (typeof date === 'string') {
    return date;
  }
  return date.toISOString().split('T')[0];
};

// Получение сегодняшней даты в нужном формате
export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};