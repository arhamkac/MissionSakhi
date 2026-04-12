export const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : window.location.origin;

export const API_BASE = `${BACKEND_URL}/api`;
export const AUTH_BASE = `${API_BASE}/users`;
export const CHATBOT_BASE = `${API_BASE}/chatbot`;
export const ROOMS_BASE = `${API_BASE}/rooms`;
export const MESSAGE_BASE = `${API_BASE}/messages`;
export const RESOURCE_BASE = `${API_BASE}/resources`;
