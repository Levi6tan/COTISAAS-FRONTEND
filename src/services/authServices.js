import axios from 'axios'

// Configuración base de axios para autenticación
const API_URL = import.meta.env.VITE_BACKEND_URL + '/auth'

// Interceptor global de Axios para adjuntar siempre withCredentials y el token Bearer si existe
axios.interceptors.request.use((config) => {
    config.withCredentials = true
    const token = localStorage.getItem('accessToken')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

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
        })

        // Guardar token en localStorage como respaldo a las cookies
        if (response.data?.token) {
            localStorage.setItem('accessToken', response.data.token)
        }

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
        })

        if (response.status === 201) {
            // Guardar token en localStorage como respaldo
            if (response.data?.token) {
                localStorage.setItem('accessToken', response.data.token)
            }

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
        localStorage.removeItem('accessToken')
        const response = await axios.post(`${API_URL}/logout`)
        return {
            success: true,
            data: response.data,
            message: response.data?.message || 'Sesión cerrada',
        }
    } catch (error) {
        localStorage.removeItem('accessToken')
        console.error('Error al cerrar sesión:', error)
        return {
            success: false,
            data: error.response?.data,
            message: error.response?.data?.message || 'Error al cerrar sesión',
        }
    }
}

export const forgotPasswordService = async (email) => {
    try {
        const response = await axios.post(`${API_URL}/forgot-password`, { email })
        return {
            success: true,
            data: response.data,
            message: response.data?.message || 'Cuenta verificada',
        }
    } catch (error) {
        console.error('Error al solicitar recuperación de contraseña:', error)
        return {
            success: false,
            data: error.response?.data,
            message: error.response?.data?.message || 'Error al verificar el correo',
        }
    }
}

export const resetPasswordService = async ({ email, newPassword }) => {
    try {
        const response = await axios.post(`${API_URL}/reset-password`, {
            email,
            newPassword,
        })
        return {
            success: true,
            data: response.data,
            message: response.data?.message || 'Contraseña actualizada',
        }
    } catch (error) {
        console.error('Error al restablecer contraseña:', error)
        return {
            success: false,
            data: error.response?.data,
            message: error.response?.data?.message || 'Error al actualizar la contraseña',
        }
    }
}
