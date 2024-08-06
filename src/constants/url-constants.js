// export const API_PROTOCOL = 'http'
// export const API_HOSTNAME = 'aim-api.codermatt.com';
// export const API_PORT = 80;

export const API_PROTOCOL = import.meta.env.VITE_RPC_PROTOCOL;
export const API_HOSTNAME = import.meta.env.VITE_RPC_HOSTNAME;
export const API_PORT = import.meta.env.VITE_RPC_PORT;

export const API_BASE_URL = `${API_PROTOCOL}://${API_HOSTNAME}:${API_PORT}`;

export const PATH_API_LOGIN = `${API_BASE_URL}/authenticate/`;

export const PATH_API_REGISTER = `${API_BASE_URL}/user/`;

export const PATH_API_TOP_TEN_SCORES = `${API_BASE_URL}/score/top-ten/`;

export const PATH_API_POST_SCORE = `${API_BASE_URL}/score/`;

export const PATH_API_GET_TOTAL_STATS = `${API_BASE_URL}/score/avg/`;

export const PATH_API_GET_LAST_SCORE = `${API_BASE_URL}/score/last/`;
