import axios from 'axios'

// Configuración base de axios para autenticación
const API_URL = import.meta.env.VITE_BACKEND_URL + '/auth'

// http://localhost:3001/api/auth/register
// http://localhost:3001/api/auth/profile

// Para incluir la cookies en las peticiones
axios.defaults.withCredentials = true

export const getProfileService = async () => {
    try {
        const response = await axios.get(`${API_URL}/profile`)
        return response.data
    } catch (error) {
        console.log(error)
        throw new Error('Error al obtener el perfil')
    }
}

export const loginService = async () => {}

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

        console.log('respuesta', response)
        if (response.status === 201 || response.status === 200) {
            // Verificar la sesión real del servidor después del registro
            alert('registro exitoso de usuario')
            reset()
        }
    } catch (error) {
        alert('error al registrarse')
    }
}

export const logoutService = async () => {}
