import { Link } from 'react-router'
import Navbar from '../components/Navbar/Navbar'
import QuotationsDashboard from '../components/Quotations/QuotationsDashboard'
import { useUser } from '../context/UserContext'

const Home = () => {
    const { isAuthenticated, loading } = useUser()

    return (
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-10">
            <Navbar />
            <main>
                {loading ? (
                    <div className="text-center py-20 text-gray-500 text-sm">
                        Cargando...
                    </div>
                ) : isAuthenticated() ? (
                    <QuotationsDashboard />
                ) : (
                    <div className="mt-16 text-center py-16 px-6 border border-gray-200 rounded-lg bg-gray-50 max-w-2xl mx-auto shadow-xs">
                        <span className="text-xs uppercase tracking-wider font-semibold text-gray-500">
                            Software de Cotizaciones Técnicas
                        </span>
                        <h1 className="text-3xl font-bold text-gray-900 mt-2">
                            CoTISaas
                        </h1>
                        <p className="text-gray-600 mt-3 text-sm max-w-lg mx-auto">
                            Gestiona tus cotizaciones de servicios técnicos e instalaciones de forma rápida, personal y organizada.
                        </p>
                        <div className="mt-8 flex justify-center gap-3">
                            <Link to="/login" className="btn btn-neutral btn-sm px-6">
                                Iniciar sesión
                            </Link>
                            <Link to="/register" className="btn btn-outline btn-sm px-6">
                                Crear cuenta
                            </Link>
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Home
