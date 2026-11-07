import { useUser } from '../../context/UserContext.jsx'
import { logoutService } from '../../services/authServices.js'
import toast from 'react-hot-toast'

const UserDropDown = () => {
    const { userInfo, checkSession } = useUser()

    const handleLogout = async () => {
        const result = await logoutService()
        await checkSession()
        if (result?.success) {
            toast.success('Sesión cerrada')
        }
    }

    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar placeholder"
            >
                <div className="bg-neutral text-neutral-content rounded-full w-10">
                    <span className="text-xs uppercase">
                        {userInfo?.username?.slice(0, 2) || 'US'}
                    </span>
                </div>
            </div>
            <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52"
            >
                <li className="menu-title px-4 py-2">
                    <span className="font-semibold block truncate">
                        {userInfo?.username}
                    </span>
                    <span className="text-xs text-gray-500 block truncate">
                        {userInfo?.email}
                    </span>
                </li>
                <li>
                    <button onClick={handleLogout} className="text-red-500">
                        Cerrar sesión
                    </button>
                </li>
            </ul>
        </div>
    )
}

export default UserDropDown
