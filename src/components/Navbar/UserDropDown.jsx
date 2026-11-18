import { useUser } from '../../context/UserContext.jsx'
import { logoutService } from '../../services/authServices.js'
import toast from 'react-hot-toast'

const UserDropDown = () => {
    const { userInfo, checkSession } = useUser()

    const handleLogout = async () => {
        const result = await logoutService()
        await checkSession()
        if (result?.success) {
            toast.success('Sesión finalizada')
        }
    }

    // Solo la inicial del primer nombre
    const firstInitial = userInfo?.username?.trim()
        ? userInfo.username.trim().charAt(0).toUpperCase()
        : 'C'

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="w-8 h-8 rounded-full bg-[var(--brand-navy)] text-white flex items-center justify-center font-bold text-sm shadow-2xs cursor-pointer hover:opacity-90 transition-opacity select-none"
                title={userInfo?.username || 'Cotizador'}
            >
                {firstInitial}
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content mt-2 z-50 p-2 bg-white border border-[var(--border-hairline)] rounded-[6px] shadow-md w-56 text-xs space-y-1"
            >
                <li className="px-3 py-2 border-b border-[var(--border-hairline)]">
                    <p className="font-semibold text-[var(--text-main)] truncate">
                        {userInfo?.username}
                    </p>
                    <p className="text-[11px] text-[var(--text-muted)] truncate font-tech">
                        {userInfo?.email}
                    </p>
                </li>
                <li>
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-[4px] font-medium transition-colors cursor-pointer"
                    >
                        Cerrar sesión
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown
