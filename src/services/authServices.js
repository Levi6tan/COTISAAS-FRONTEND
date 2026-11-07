import axios from 'axios'

// Configuración base de axios para autenticación
const API_URL = import.meta.env.VITE_BACKEND_URL + '/auth'

// http://localhost:3000/api/auth/register
// http://localhost:3000/api/auth/profile

// Para incluir la cookies en las peticiones
axios.defaults.withCredentials = true

export const getProfileService = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`)
        return response.data
    } catch (error) {
        // Si no está autenticado (400, 401, 404), retornamos null sin error 
        if (error.response && [400, 401, 404].includes(error.response.status)) {
            return null
        }
        console.error('Error al obtener el perfil:', error)
        throw new Error('Error al obtener el perfil', { cause: error })
    }
}

export const loginService = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/login`, credentials, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })
        return {
            success: true,
            data: response.data,
            message: response.data?.message || 'Inicio de sesión exitoso',
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        return {
            success: false,
            data: error.response?.data,
            message: error.response?.data?.message || 'Credenciales inválidas',
        }
    }
}

export const registerService = async (
    data,
    reset,
    setRedirect,
    checkSession,
) => {
    try {
        const response = await axios.post(`${API_URL}/register`, data, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        })

        if (response.status === 201) {
            // Verificar la sesión real del servidor después del registro
            if (checkSession) await checkSession()
            if (reset) reset()
            if (setRedirect) setRedirect(true)

            return {
                success: true,
                data: response.data,
                message: response.data?.message || 'Usuario registrado con éxito',
            }
        }

        return {
            success: false,
            data: response.data,
            message: response.data?.message || 'Error al registrar',
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error)
        return {
            success: false,
            data: error.response?.data,
            message:
                error.response?.data?.message ||
                'Error al registrar el usuario, intente más tarde',
        }
    }
}

export const logoutService = async () => {
    try {
        const response = await axios.post(`${API_URL}/logout`)
        return {
            success: true,
            data: response.data,
            message: response.data?.message || 'Sesión cerrada',
        }
    } catch (error) {
        console.error('Error al cerrar sesión:', error)
        return {
            success: false,
            data: error.response?.data,
            message: error.response?.data?.message || 'Error al cerrar sesión',
        }
    }
}
