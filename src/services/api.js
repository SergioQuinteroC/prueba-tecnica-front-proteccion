import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// Crear instancia de axios con configuración base
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Función para crear una instancia de API con token
export const createApiInstance = (token) => {
    const apiInstance = axios.create({
        baseURL: API_BASE_URL,
        headers: {
            "Content-Type": "application/json",
        },
    });

    // Interceptor para agregar el token de autenticación
    apiInstance.interceptors.request.use(
        (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Interceptor para manejar errores de respuesta
    apiInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Redirigir al login en caso de token inválido
                window.location.href = "/login";
            }
            return Promise.reject(error);
        }
    );

    return apiInstance;
};

// Servicios de autenticación (sin token)
export const authService = {
    login: async (credentials) => {
        console.log(
            "Haciendo petición de login a:",
            `${API_BASE_URL}/auth/login`
        );
        const response = await api.post("/auth/login", credentials);
        console.log("Respuesta del servidor:", response.data);
        return response.data;
    },

    register: async (userData) => {
        console.log(
            "Haciendo petición de registro a:",
            `${API_BASE_URL}/auth/register`
        );
        const response = await api.post("/auth/register", userData);
        console.log("Respuesta del servidor:", response.data);
        return response.data;
    },
};

// Servicios de tareas (requieren token)
export const createTaskService = (token) => {
    const apiInstance = createApiInstance(token);

    return {
        getTasks: async (filters = {}) => {
            const response = await apiInstance.get("/tasks", {
                params: filters,
            });
            return response.data;
        },

        getTask: async (id) => {
            const response = await apiInstance.get(`/tasks/${id}`);
            return response.data;
        },

        createTask: async (taskData) => {
            const response = await apiInstance.post("/tasks", taskData);
            return response.data;
        },

        updateTask: async (id, taskData) => {
            const response = await apiInstance.put(`/tasks/${id}`, taskData);
            return response.data;
        },

        deleteTask: async (id) => {
            const response = await apiInstance.delete(`/tasks/${id}`);
            return response.data;
        },
    };
};

// Servicios de usuarios (requieren token)
export const createUserService = (token) => {
    const apiInstance = createApiInstance(token);

    return {
        getUsers: async () => {
            const response = await apiInstance.get("/users");
            return response.data;
        },

        getCurrentUser: async () => {
            const response = await apiInstance.get("/users/me");
            return response.data;
        },
    };
};

export default api;
