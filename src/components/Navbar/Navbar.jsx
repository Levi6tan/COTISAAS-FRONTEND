import { Link } from 'react-router'
import AuthButtons from './AuthButtons'
import UserDropDown from './UserDropDown'
import CotiSaasLogo from '../Common/CotiSaasLogo'
import { useUser } from '../../context/UserContext.jsx'

const Navbar = () => {
    const { isAuthenticated } = useUser()

    return (
        <header className="w-full border-b border-[var(--border-hairline)] bg-[var(--bg-canvas)] sticky top-0 z-40">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo a la izquierda */}
                <div className="flex items-center gap-8">
                    <Link to="/" className="flex items-center">
                        <CotiSaasLogo />
                    </Link>

                    {/* Enlaces sutiles estilo documento editorial (solo en landing no autenticado) */}
                    {!isAuthenticated() && (
                        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-[var(--text-muted)]">
                            <a
                                href="#componentes"
                                className="hover:text-[var(--brand-navy)] transition-colors"
                            >
                                Componentes
                            </a>
                            <a
                                href="#funciones"
                                className="hover:text-[var(--brand-navy)] transition-colors"
                            >
                                Funciones
                            </a>
                        </nav>
                    )}
                </div>

                {/* Acciones a la derecha */}
                <div className="flex items-center gap-4">
                    {isAuthenticated() ? <UserDropDown /> : <AuthButtons />}
                </div>
            </div>
        </header>
    )
}

export default Navbar
