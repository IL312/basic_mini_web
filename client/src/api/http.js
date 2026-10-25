const API_URL = import.meta.env.VITE_API_URL || '/api';

export const request = async (path, options = {}) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_URL}${path}`, config);

    if (response.status === 204) return null;

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка запроса');
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') throw error;

    if (error instanceof TypeError) {
      throw new Error('Сервер недоступен', { cause: error });
    }

    throw error;
  }
};