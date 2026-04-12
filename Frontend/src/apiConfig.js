const getApiBase = () => {
  if (import.meta.env.VITE_API_BASE) return import.meta.env.VITE_API_BASE;
  if (window.location.hostname === 'localhost') return 'http://localhost:8080/api';
  return 'https://missionsakhi.onrender.com/api';
};

export const API_BASE = getApiBase();
export const BACKEND_URL = API_BASE.replace(/\/api\/?$/, "");
export const AUTH_BASE = `${API_BASE}/users`;
export const CHATBOT_BASE = `${API_BASE}/chatbot`;
export const ROOMS_BASE = `${API_BASE}/rooms`;
export const MESSAGE_BASE = `${API_BASE}/messages`;
export const RESOURCE_BASE = `${API_BASE}/resources`;
