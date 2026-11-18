import { Link } from 'react-router'

const AuthButtons = () => {
    return (
        <div className="flex items-center gap-4 sm:gap-6">
            <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-[var(--text-main)] hover:text-[var(--brand-navy)] hover:underline underline-offset-4 transition-colors"
            >
                Iniciar sesión
            </Link>
            <Link
                to="/register"
                className="btn-precision-navy px-3.5 py-1.5 text-xs sm:text-sm font-semibold shadow-2xs hover:shadow-xs inline-flex items-center gap-1.5"
            >
                Crear cuenta
            </Link>
        </div>
    )
}

export default AuthButtons
