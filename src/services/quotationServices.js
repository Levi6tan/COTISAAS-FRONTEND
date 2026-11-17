import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_URL + '/quotations'

// Obtener encabezado Authorization si existe token en localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('accessToken')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const getQuotationsService = async (search = '') => {
    try {
        const url = search.trim()
            ? `${API_URL}?search=${encodeURIComponent(search.trim())}`
            : API_URL
        const response = await axios.get(url, {
            headers: getAuthHeaders(),
            withCredentials: true,
        })
        return response.data?.quotations || []
    } catch (error) {
        console.error('Error al obtener cotizaciones:', error)
        throw error
    }
}

export const createQuotationService = async (data) => {
    try {
        const response = await axios.post(API_URL, data, {
            headers: getAuthHeaders(),
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        console.error('Error al crear cotización:', error)
        throw error
    }
}

export const updateQuotationService = async (id, data) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data, {
            headers: getAuthHeaders(),
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        console.error('Error al actualizar cotización:', error)
        throw error
    }
}

export const deleteQuotationService = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`, {
            headers: getAuthHeaders(),
            withCredentials: true,
        })
        return response.data
    } catch (error) {
        console.error('Error al eliminar cotización:', error)
        throw error
    }
}
