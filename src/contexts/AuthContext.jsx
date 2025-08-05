import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Al cargar la aplicación, no hay token guardado
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      console.log('Intentando login con:', credentials);
      const response = await authService.login(credentials);
      console.log('Respuesta del login:', response);
      
      const { token: newToken, user: userData } = response;
      
      // Si la respuesta solo tiene token, crear un usuario básico
      if (newToken && !userData) {
        console.log('Token recibido, creando usuario básico');
        const basicUser = {
          id: 'user',
          email: credentials.email,
          name: credentials.email.split('@')[0] // Usar parte del email como nombre
        };
        
        setToken(newToken);
        setUser(basicUser);
        
        return { success: true };
      }
      
      // Si la respuesta tiene tanto token como user
      if (newToken && userData) {
        console.log('Token y usuario recibidos');
        setToken(newToken);
        setUser(userData);
        
        return { success: true };
      }
      
      console.error('Respuesta inválida del servidor:', response);
      return { 
        success: false, 
        error: 'Respuesta inválida del servidor' 
      };
    } catch (error) {
      console.error('Error en login:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Intentando registro con:', userData);
      const response = await authService.register(userData);
      console.log('Respuesta del registro:', response);
      
      const { token: newToken, user: newUser } = response;
      
      // Si la respuesta solo tiene token, crear un usuario básico
      if (newToken && !newUser) {
        console.log('Token recibido, creando usuario básico');
        const basicUser = {
          id: 'user',
          email: userData.email,
          name: userData.email.split('@')[0]
        };
        
        setToken(newToken);
        setUser(basicUser);
        
        return { success: true };
      }
      
      // Si la respuesta tiene tanto token como user
      if (newToken && newUser) {
        setToken(newToken);
        setUser(newUser);
        
        return { success: true };
      }
      
      console.error('Respuesta inválida del servidor:', response);
      return { 
        success: false, 
        error: 'Respuesta inválida del servidor' 
      };
    } catch (error) {
      console.error('Error en registro:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Error al registrarse' 
      };
    }
  };

  const logout = () => {
    console.log('Cerrando sesión');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!token && !!user
  };

  console.log('Estado actual del contexto:', { user, token, isAuthenticated: !!token && !!user });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 