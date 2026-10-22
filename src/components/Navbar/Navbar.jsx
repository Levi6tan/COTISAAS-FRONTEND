import AuthButtons from './AuthButtons'
import UserDropDown from './UserDropDown'

const Navbar = () => {
    return (
        <header>
            <AuthButtons />
            <nav className="navbar bg-base-100 shadow-sm lg:rounded-box w-full">
                <div className="navbar-start">
                    <a className="btn btn-ghost text-xl" to="/">
                        COTISAAS
                    </a>
                </div>
                <div className="navbar-end gap-3">
                    <a className="btn btn-neutral btn-outline">Componentes</a>
                    <a className="btn btn-neutral btn-outline">Funcionalidad</a>
                    <button className="btn btn-neutral btn-outline">
                        Iniciar sesion
                    </button>
                    <button className="btn btn-neutral btn-outline">
                        Crear Cuenta
                    </button>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
