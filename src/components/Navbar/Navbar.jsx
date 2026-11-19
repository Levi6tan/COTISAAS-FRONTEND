import { Link } from 'react-router'
import AuthButtons from './AuthButtons'
import UserDropDown from './UserDropDown'
import CotiSaasLogo from '../Common/CotiSaasLogo'
import { useUser } from '../../context/UserContext.jsx'

const Navbar = () => {
    const { isAuthenticated } = useUser()

    return (
        <header className="w-full border-b border-[var(--border-hairline)] bg-white sticky top-0 z-40">
            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                {/* Logo a la izquierda */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <CotiSaasLogo />
                    </Link>
                </div>

                {/* Enlaces centrados y con tamaño de letra visible (solo en landing pública) */}
                {!isAuthenticated() ? (
                    <nav className="hidden md:flex items-center justify-center gap-10 text-sm font-medium text-[var(--text-muted)]">
                        <a
                            href="#componentes"
                            className="hover:text-[var(--text-main)] transition-colors py-1 hover:border-b-2 hover:border-[var(--brand-navy)]"
                        >
                            Componentes
                        </a>
                        <a
                            href="#funcionalidades"
                            className="hover:text-[var(--text-main)] transition-colors py-1 hover:border-b-2 hover:border-[var(--brand-navy)]"
                        >
                            Funcionalidades
                        </a>
                    </nav>
                ) : (
                    <div className="hidden md:block">
                        <span className="text-xs font-tech text-[var(--text-muted)]">
                            Panel de Cotizadores
                        </span>
                    </div>
                )}

                {/* Acciones a la derecha */}
                <div className="flex items-center gap-4">
                    {isAuthenticated() ? <UserDropDown /> : <AuthButtons />}
                </div>
            </div>
        </header>
    )
}

export default Navbar
