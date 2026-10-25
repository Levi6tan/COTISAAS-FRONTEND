import { Link } from 'react-router'

const AuthButtons = () => {
    return (
        <>
            <Link className="btn btn-neutral btn-outline" to="/login">
                Iniciar sesion
            </Link>
            <Link className="btn btn-neutral btn-outline" to="/register">
                Crear Cuenta
            </Link>
        </>
    )
}

export default AuthButtons
