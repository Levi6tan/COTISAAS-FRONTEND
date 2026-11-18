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

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="flex items-center gap-2 p-1.5 rounded-[4px] border border-[var(--border-hairline)] bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
            >
                <div className="w-7 h-7 rounded-[3px] bg-[var(--brand-navy)] text-[var(--bg-canvas)] flex items-center justify-center font-tech text-xs font-bold">
                    {userInfo?.username?.slice(0, 2).toUpperCase() || 'US'}
                </div>
                <span className="hidden sm:inline text-xs font-semibold text-[var(--text-main)] max-w-[120px] truncate">
                    {userInfo?.username}
                </span>
                <svg
                    className="w-3.5 h-3.5 text-[var(--text-muted)]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
            <ul
                tabIndex={0}
                className="dropdown-content mt-2 z-30 p-2 bg-[var(--bg-card)] border border-[var(--border-hairline)] rounded-[6px] shadow-sm w-56 text-xs space-y-1"
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
                        className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-[4px] font-medium transition-colors"
                    >
                        Cerrar sesión
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown
