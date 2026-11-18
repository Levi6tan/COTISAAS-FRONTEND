import { Link } from 'react-router'
import Navbar from '../components/Navbar/Navbar'
import QuotationsDashboard from '../components/Quotations/QuotationsDashboard'
import HeroTechnicalQuotation from '../components/Home/HeroTechnicalQuotation'
import CotiSaasLogo from '../components/Common/CotiSaasLogo'
import { useUser } from '../context/UserContext'

const Home = () => {
    const { isAuthenticated, loading } = useUser()

    return (
        <div className="min-h-screen bg-[var(--bg-canvas)] text-[var(--text-main)] flex flex-col">
            <Navbar />

            <main className="flex-1">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-28 text-sm text-[var(--text-muted)]">
                        <span className="loading loading-spinner loading-md text-[var(--brand-navy)]"></span>
                        <p className="mt-3 font-medium">Cargando CotiSaaS...</p>
                    </div>
                ) : isAuthenticated() ? (
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16">
                        <QuotationsDashboard />
                    </div>
                ) : (
                    /* LANDING PAGE MINIMALISTA Y EDITORIAL (SIN CLICHÉS DE IA) */
                    <div className="w-full">
                        {/* 1. HERO EN BLANCO PURO (#FFFFFF) */}
                        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 lg:pt-18 lg:pb-24">
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                                {/* Columna Izquierda: Directo al título sin píldoras */}
                                <div className="lg:col-span-6 space-y-5 text-left">
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[var(--text-main)] leading-[1.14]">
                                        Cotizaciones al instante para técnicos
                                    </h1>

                                    <p className="text-base sm:text-lg text-[var(--text-muted)] font-normal max-w-lg leading-relaxed">
                                        Crea, envía y formaliza presupuestos profesionales en segundos desde cualquier lugar.
                                    </p>

                                    {/* Botones de Acción */}
                                    <div className="flex flex-wrap items-center gap-3 pt-2">
                                        <Link
                                            to="/register"
                                            className="btn-precision-orange px-6 py-2.5 text-sm inline-flex items-center gap-2 shadow-2xs font-semibold"
                                        >
                                            Empieza gratis
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </Link>
                                        <Link
                                            to="/login"
                                            className="btn-precision-outline px-5 py-2.5 text-sm font-medium"
                                        >
                                            Iniciar sesión
                                        </Link>
                                    </div>

                                    {/* Indicadores de Confianza Sobrios */}
                                    <div className="pt-4 border-t border-[var(--border-hairline)] flex flex-wrap gap-6 text-xs text-[var(--text-muted)]">
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <svg className="w-4 h-4 text-[var(--brand-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            Rápido y fácil
                                        </div>
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <svg className="w-4 h-4 text-[var(--brand-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            Desde cualquier dispositivo
                                        </div>
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <svg className="w-4 h-4 text-[var(--brand-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                            Normativa DIAN 19%
                                        </div>
                                    </div>
                                </div>

                                {/* Columna Derecha: Maqueta Realista de Cotización */}
                                <div className="lg:col-span-6">
                                    <HeroTechnicalQuotation />
                                </div>
                            </div>
                        </section>

                        {/* 2. COMPONENTES (SECCIÓN CON FONDO GRIS ULTRA SUTIL #F8F9FA) */}
                        <section id="componentes" className="w-full border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)] py-16">
                            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                                <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                        Componentes
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
                                        Todo lo que necesitas, en un solo lugar
                                    </h2>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Herramientas pensadas para técnicos, enfocadas en tu día a día.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Tarjeta 1 - Ícono limpio sin caja gris */}
                                    <div className="card-precision p-6 bg-white hover:border-[#D0D7DE] transition-colors space-y-3">
                                        <svg className="w-6 h-6 text-[var(--brand-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                        <h3 className="font-bold text-base text-[var(--text-main)]">
                                            Catálogo de servicios
                                        </h3>
                                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                            Organiza tus servicios, materiales y precios unitarios para cotizar en segundos.
                                        </p>
                                    </div>

                                    {/* Tarjeta 2 */}
                                    <div className="card-precision p-6 bg-white hover:border-[#D0D7DE] transition-colors space-y-3">
                                        <svg className="w-6 h-6 text-[var(--brand-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <h3 className="font-bold text-base text-[var(--text-main)]">
                                            Plantillas de cotización
                                        </h3>
                                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                            Personaliza tus propuestas con datos comerciales, validez y términos de pago.
                                        </p>
                                    </div>

                                    {/* Tarjeta 3 */}
                                    <div className="card-precision p-6 bg-white hover:border-[#D0D7DE] transition-colors space-y-3">
                                        <svg className="w-6 h-6 text-[var(--brand-navy)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                        <h3 className="font-bold text-base text-[var(--text-main)]">
                                            Firma y validez
                                        </h3>
                                        <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                            Tus clientes revisan y aprueban la propuesta formal desde su celular sin papeleos.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 3. FUNCIONES (SECCIÓN EN BLANCO PURO) */}
                        <section id="funciones" className="w-full py-16 lg:py-20 bg-white border-t border-[var(--border-hairline)]">
                            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
                                <div className="text-center max-w-xl mx-auto space-y-2">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                                        Funciones
                                    </span>
                                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
                                        Diseñada para hacer tu trabajo más fácil
                                    </h2>
                                    <p className="text-sm text-[var(--text-muted)]">
                                        Cálculos automáticos y entrega ágil para cerrar proyectos más rápido.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {/* Función 1: Sin números 01, tarjeta blanca con desglose limpio */}
                                    <div className="card-precision p-6 bg-white flex flex-col justify-between space-y-5 hover:border-[#D0D7DE] transition-colors">
                                        <div className="bg-[var(--bg-subtle)] p-4 rounded-[4px] border border-[var(--border-hairline)] font-tech text-xs space-y-1.5">
                                            <div className="flex justify-between text-[var(--text-muted)]">
                                                <span>Subtotal:</span>
                                                <span className="text-[var(--text-main)] font-medium">$ 5.550.000</span>
                                            </div>
                                            <div className="flex justify-between text-[var(--text-muted)]">
                                                <span>IVA (19%):</span>
                                                <span className="text-[var(--text-main)] font-medium">$ 1.054.500</span>
                                            </div>
                                            <div className="pt-2 border-t border-[var(--border-hairline)] flex justify-between font-bold text-sm text-[var(--text-main)]">
                                                <span>Total:</span>
                                                <span>$ 6.604.500</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base text-[var(--text-main)] mb-1">
                                                Cálculo automático de IVA
                                            </h3>
                                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                                Evita errores manuales. CotiSaaS liquida base gravable e impuestos colombianos al instante.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Función 2: Sin números 02 */}
                                    <div className="card-precision p-6 bg-white flex flex-col justify-between space-y-5 hover:border-[#D0D7DE] transition-colors">
                                        <div className="bg-[var(--bg-subtle)] p-4 rounded-[4px] border border-[var(--border-hairline)] flex items-center justify-center gap-3 py-6">
                                            <span className="px-3 py-1.5 bg-emerald-600 text-white rounded-[4px] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                                                WhatsApp
                                            </span>
                                            <span className="text-xs text-[var(--text-muted)] font-tech">+</span>
                                            <span className="px-3 py-1.5 bg-[var(--brand-navy)] text-white rounded-[4px] text-xs font-semibold flex items-center gap-1.5 shadow-2xs">
                                                PDF / Correo
                                            </span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base text-[var(--text-main)] mb-1">
                                                Envío por WhatsApp y correo
                                            </h3>
                                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                                Comparte tus propuestas en segundos con un enlace directo o formato PDF listo para imprimir.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Función 3: Sin números 03 */}
                                    <div className="card-precision p-6 bg-white flex flex-col justify-between space-y-5 hover:border-[#D0D7DE] transition-colors">
                                        <div className="bg-[var(--bg-subtle)] p-4 rounded-[4px] border border-[var(--border-hairline)] grid grid-cols-2 gap-2 text-center text-xs font-tech">
                                            <div className="p-2 bg-white rounded-[3px] border border-[var(--border-hairline)]">
                                                <span className="text-[10px] text-gray-500 block uppercase">Borrador</span>
                                                <span className="font-bold text-gray-700">3</span>
                                            </div>
                                            <div className="p-2 bg-white rounded-[3px] border border-[var(--border-hairline)]">
                                                <span className="text-[10px] text-amber-600 block uppercase">Pendiente</span>
                                                <span className="font-bold text-amber-700">5</span>
                                            </div>
                                            <div className="p-2 bg-white rounded-[3px] border border-[var(--border-hairline)]">
                                                <span className="text-[10px] text-emerald-600 block uppercase">Aprobada</span>
                                                <span className="font-bold text-emerald-700">8</span>
                                            </div>
                                            <div className="p-2 bg-white rounded-[3px] border border-[var(--border-hairline)]">
                                                <span className="text-[10px] text-rose-600 block uppercase">Rechazada</span>
                                                <span className="font-bold text-rose-700">1</span>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base text-[var(--text-main)] mb-1">
                                                Seguimiento de estados
                                            </h3>
                                            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                                                Ten control total sobre tus propuestas comerciales: borradores, enviadas o aprobadas.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 4. BLOQUE CTA INFERIOR SUAVE (GRIS ULTRA SUTIL #F8F9FA CON BORDE FINO #EAECEF) */}
                        <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
                            <div className="bg-[var(--bg-subtle)] rounded-[6px] border border-[var(--border-hairline)] p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                                <div className="space-y-1.5 text-center sm:text-left">
                                    <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
                                        Empieza a cotizar hoy
                                    </h3>
                                    <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-md">
                                        Únete a técnicos e instaladores que ya trabajan de forma más organizada y profesional.
                                    </p>
                                </div>
                                <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                                    <Link
                                        to="/register"
                                        className="btn-precision-orange px-6 py-3 text-sm inline-flex items-center gap-2 shadow-2xs font-semibold"
                                    >
                                        Crear cuenta gratis
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                    <span className="text-[11px] text-[var(--text-muted)]">
                                        Sin tarjeta de crédito • Configuración en minutos
                                    </span>
                                </div>
                            </div>
                        </section>

                        {/* 5. FOOTER OSCURO NEUTRO (#161B22) */}
                        <footer className="w-full bg-[#161B22] text-[#8B949E] border-t border-[#30363D] pt-12 pb-8">
                            <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                    <div className="space-y-3">
                                        <CotiSaasLogo variant="dark" showTagline={true} />
                                        <p className="text-xs text-[#8B949E] leading-relaxed">
                                            Cotizaciones simples y profesionales para empresas de servicios técnicos.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F0F6FC] mb-3">
                                            Producto
                                        </h4>
                                        <ul className="text-xs space-y-2">
                                            <li><a href="#componentes" className="hover:text-white transition-colors">Componentes</a></li>
                                            <li><a href="#funciones" className="hover:text-white transition-colors">Funciones</a></li>
                                            <li><Link to="/register" className="hover:text-white transition-colors">Empezar gratis</Link></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F0F6FC] mb-3">
                                            Empresa
                                        </h4>
                                        <ul className="text-xs space-y-2">
                                            <li><span className="text-[#8B949E]">Sobre nosotros</span></li>
                                            <li><span className="text-[#8B949E]">Términos de servicio</span></li>
                                            <li><span className="text-[#8B949E]">Contacto</span></li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F0F6FC] mb-3">
                                            Soporte
                                        </h4>
                                        <ul className="text-xs space-y-2">
                                            <li><span className="text-[#8B949E]">Centro de ayuda</span></li>
                                            <li><span className="text-[#8B949E]">Normativa DIAN 19%</span></li>
                                            <li><span className="text-[#8B949E]">soporte@cotisaas.com</span></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-[#30363D] flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#6E7681]">
                                    <p>© 2026 CotiSaaS. Todos los derechos reservados.</p>
                                    <div className="flex gap-4">
                                        <span>Privacidad</span>
                                        <span>•</span>
                                        <span>Términos</span>
                                        <span>•</span>
                                        <span>Seguridad</span>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    </div>
                )}
            </main>
        </div>
    )
}

export default Home
