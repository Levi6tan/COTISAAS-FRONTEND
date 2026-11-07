import { Link } from 'react-router'
import AuthButtons from './AuthButtons'
import UserDropDown from './UserDropDown'
import { useUser } from '../../context/UserContext.jsx'

const Navbar = () => {
    const { isAuthenticated } = useUser()

    return (
        <header>
            <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
                <div className="navbar-start">
                    <Link className="btn btn-ghost text-xl" to="/">
                        COTISAAS
                    </Link>
                </div>
                <div className="navbar-end gap-3">
                    <a className="btn btn-neutral btn-outline">Componentes</a>
                    <a className="btn btn-neutral btn-outline">Funcionalidad</a>
                    {isAuthenticated() ? <UserDropDown /> : <AuthButtons />}
                </div>
            </nav>
        </header>
    )
}

export default Navbar
