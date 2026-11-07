import { useContext, useState, useEffect, createContext } from 'react'
import { getProfileService } from '../services/authServices.js'

export const UserContext = createContext({})

export const UserContextProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({})
    const [loading, setLoading] = useState(true)

    // Funcion para verificar la sesión del usuario
    const checkSession = async () => {
        try {
            const userData = await getProfileService()
            setUserInfo(userData || {})
        } catch {
            setUserInfo({})
        } finally {
            setLoading(false)
        }
    }

    // Funcion para obtener el id del usuario authenticado
    const getUserId = () => {
        return userInfo?.id || null
    }

    // Verificar si el usuario está autenticado o no
    const isAuthenticated = () => {
        return !!userInfo?.id
    }

    useEffect(() => {
        let isMounted = true

        getProfileService()
            .then((userData) => {
                if (isMounted) {
                    setUserInfo(userData || {})
                    setLoading(false)
                }
            })
            .catch(() => {
                if (isMounted) {
                    setUserInfo({})
                    setLoading(false)
                }
            })

        return () => {
            isMounted = false
        }
    }, [])

    return (
        <UserContext.Provider
            value={{
                userInfo,
                setUserInfo,
                loading,
                checkSession,
                getUserId,
                isAuthenticated,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
