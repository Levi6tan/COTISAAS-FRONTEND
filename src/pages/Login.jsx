import { Link } from 'react-router'
import LoginForm from '../components/Login/LoginForm'
import CotiSaasLogo from '../components/Common/CotiSaasLogo'

const Login = () => {
    return (
        <div className="min-h-screen bg-[var(--bg-subtle)] text-[var(--text-main)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
                <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                    <CotiSaasLogo showTagline={true} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-[var(--text-main)]">
                        Acceso a tu cuenta
                    </h2>
                    <p className="text-xs text-[var(--text-muted)] mt-1">
                        Ingresa tus credenciales para gestionar tus presupuestos técnicos.
                    </p>
                </div>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
                <div className="card-precision bg-white p-6 sm:p-8 shadow-xs">
                    <LoginForm />
                </div>

                <div className="mt-6 text-center text-xs text-[var(--text-muted)]">
                    <Link to="/" className="hover:text-[var(--text-main)] underline underline-offset-2">
                        ← Volver a la página principal
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login
