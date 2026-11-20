import { Link } from 'react-router'
import Navbar from '../components/Navbar/Navbar'
import QuotationsDashboard from '../components/Quotations/QuotationsDashboard'
import HeroTechnicalQuotation from '../components/Home/HeroTechnicalQuotation'
import CotiSaasLogo from '../components/Common/CotiSaasLogo'
import { useUser } from '../context/UserContext'

const Home = () => {
    const { isAuthenticated, loading } = useUser()

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center text-sm text-(--text-muted)">
                <span className="loading loading-spinner loading-md text-(--brand-navy)"></span>
                <p className="mt-3 font-medium">Cargando CotiSaaS...</p>
            </div>
        )
    }

    // Cuando el usuario está autenticado, mostramos el Dashboard con su propio Menú Lateral (Sidebar)
    if (isAuthenticated()) {
        return <QuotationsDashboard />
    }

    // Landing Page Pública (cuando no está autenticado)
    return (
        <div className="min-h-screen bg-white text-(--text-main) flex flex-col">
            <Navbar />

            <main className="flex-1">
                {/* 1. HERO EN BLANCO PURO (#FFFFFF) */}
                <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-16 lg:pt-16 lg:pb-24">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                        {/* Columna Izquierda: Mensaje enfocado al cotizador en campo */}
                        <div className="lg:col-span-6 space-y-6 text-left">
                            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[4px] bg-(--bg-subtle) border border-(--border-hairline) text-xs font-tech text-(--brand-navy) font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-(--brand-orange)"></span>
                                COTIZACIONES TECNICAS
                            </div>

                            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-(--text-main) leading-[1.18]">
                                Cotizaciones al instante para técnicos
                            </h1>

                            <p className="text-base sm:text-lg text-(--text-muted) font-normal max-w-lg leading-relaxed">
                                Crea, planifica y envia prespuestos profesionales en segudos desde cualquier lugar.
                            </p>

                            {/* Botones de Acción */}
                            <div className="flex flex-wrap items-center gap-3 pt-2">
                                <Link
                                    to="/register"
                                    className="btn-precision-orange px-6 py-3 text-sm sm:text-base inline-flex items-center gap-2 shadow-2xs font-bold cursor-pointer"
                                >
                                    Empieza gratis
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                                <Link
                                    to="/login"
                                    className="btn-precision-outline px-5 py-3 text-sm sm:text-base font-semibold cursor-pointer"
                                >
                                    Iniciar sesión
                                </Link>
                            </div>

                            {/* Indicadores de Confianza Sobrios */}
                            <div className="pt-4 border-t border-(--border-hairline) flex flex-wrap gap-6 text-xs sm:text-sm text-(--text-muted)">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-(--brand-navy)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Cotiza en el sitio del cliente
                                </div>
                                <div className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-(--brand-navy)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Envío directo al correo y WhatsApp
                                </div>
                                <div className="flex items-center gap-1.5 font-medium">
                                    <svg className="w-4 h-4 text-(--brand-navy)" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    Tarifas fijadas por la empresa
                                </div>
                            </div>
                        </div>

                        {/* Columna Derecha: Maqueta Animada con Estilo PreventivoPro */}
                        <div className="lg:col-span-6">
                            <HeroTechnicalQuotation />
                        </div>
                    </div>
                </section>

                {/* 2. COMPONENTES (ENFOCADOS AL TRABAJO DEL COTIZADOR) */}
                <section id="componentes" className="w-full border-t border-(--border-hairline) bg-(--bg-subtle) py-16">
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6">
                        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
                            <span className="text-xs font-bold tracking-widest uppercase text-(--brand-navy) font-tech">
                                COMPONENTES
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-main)">
                                Todo lo que necesitas, en un solo lugar
                            </h2>
                            <p className="text-sm sm:text-base text-(--text-muted)">
                                Herramienta práctica para que cotices en minutos y en tiempo real.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Tarjeta 1 */}
                            <div className="card-precision p-6 bg-white hover:border-[#CBD5E1] transition-all space-y-3 shadow-2xs hover:shadow-xs">
                                <div className="w-10 h-10 rounded-[4px] bg-(--bg-subtle) border border-(--border-hairline) flex items-center justify-center text-(--brand-navy)">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-base text-(--text-main)">
                                    Catálogo ágil de servicios y materiales
                                </h3>
                                <p className="text-xs sm:text-sm text-(--text-muted) leading-relaxed">
                                    Selecciona de inmediato los conceptos técnicos, metrajes e insumos con las tarifas y mano de obra autorizadas por tu empresa.
                                </p>
                            </div>

                            {/* Tarjeta 2 */}
                            <div className="card-precision p-6 bg-white hover:border-[#CBD5E1] transition-all space-y-3 shadow-2xs hover:shadow-xs">
                                <div className="w-10 h-10 rounded-[4px] bg-(--bg-subtle) border border-(--border-hairline) flex items-center justify-center text-(--brand-navy)">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-base text-(--text-main)">
                                    Datos del cliente particular al instante
                                </h3>
                                <p className="text-xs sm:text-sm text-(--text-muted) leading-relaxed">
                                    Registra nombre, cédula (CC), teléfono y dirección de la persona para emitir una propuesta con validez técnica y formal.
                                </p>
                            </div>

                            {/* Tarjeta 3 */}
                            <div className="card-precision p-6 bg-white hover:border-[#CBD5E1] transition-all space-y-3 shadow-2xs hover:shadow-xs">
                                <div className="w-10 h-10 rounded-[4px] bg-(--bg-subtle) border border-(--border-hairline) flex items-center justify-center text-(--brand-navy)">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-base text-(--text-main)">
                                    Aprobación directa por WhatsApp y correo
                                </h3>
                                <p className="text-xs sm:text-sm text-(--text-muted) leading-relaxed">
                                    Envía la cotización formal en PDF al WhatsApp del cliente mientras conversas con él y recibe su visto bueno de inmediato.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. FUNCIONALIDADES (IMÁGENES CON FONDO GRIS Y DARK OVERLAY) */}
                <section id="funcionalidades" className="w-full py-16 lg:py-20 bg-white border-t border-(--border-hairline)">
                    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 space-y-12">
                        <div className="text-center max-w-2xl mx-auto space-y-2">
                            <span className="text-xs font-bold tracking-widest uppercase text-(--brand-navy) font-tech">
                                FUNCIONALIDADES
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-main)">
                                Funcionalidades diseñadas para tu día a día.
                            </h2>
                            <p className="text-sm sm:text-base text-(--text-muted)">
                                Automatizaciones que eliminan errores de cálculo y agilizan el cierre de cada servicio.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Funcionalidad 1: Cálculo automático de IVA */}
                            <div className="card-precision p-5 bg-[#F8F9FA] border border-[#E5E7EB] hover:border-[#CBD5E1] transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                                {/* Marco de la imagen con Fondo Gris */}
                                <div className="p-2 bg-[#EAECEF] rounded-[4px] border border-[#DCDFE4]">
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-[#01202F] group">
                                        <img
                                            src="/images/calculoIva.jpg"
                                            alt="Cálculo automático de IVA y totales"
                                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-95"
                                        />
                                        {/* Dark Overlay con gradiente oscuro técnico */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#01202F]/90 via-[#01202F]/35 to-transparent"></div>
                                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-tech text-white">

                                            <span className="text-amber-300 font-bold">Descuentos %</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-bold text-base text-(--text-main)">
                                        Cálculo automático de IVA y totales
                                    </h3>
                                    <p className="text-xs sm:text-sm text-(--text-muted) leading-relaxed">
                                        Evita errores numéricos frente al cliente. CotiSaaS liquida al instante subtotales de materiales, mano de obra, descuentos e IVA (19%) en pesos colombianos.
                                    </p>
                                </div>
                            </div>

                            {/* Funcionalidad 2: Envío por WhatsApp y correo */}
                            <div className="card-precision p-5 bg-[#F8F9FA] border border-[#E5E7EB] hover:border-[#CBD5E1] transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                                <div className="p-2 bg-[#EAECEF] rounded-[4px] border border-[#DCDFE4]">
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-[#01202F] group">
                                        <img
                                            src="/images/envioCotizacion.jpg"
                                            alt="Envío por WhatsApp y correo"
                                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-95"
                                        />
                                        {/* Dark Overlay con gradiente oscuro técnico */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#01202F]/90 via-[#01202F]/35 to-transparent"></div>
                                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-tech text-white">

                                            <span className="text-emerald-400 font-bold">Envios</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-bold text-base text-(--text-main)">
                                        Envío formal por WhatsApp y correo
                                    </h3>
                                    <p className="text-xs sm:text-sm text-(--text-muted) leading-relaxed">
                                        Genera el PDF formal de tu propuesta y envialo por correo, en un solo click avisale a tu cliente por WhatsApp que su cotizacion esta lista para ser aprobada sin esperas.
                                    </p>
                                </div>
                            </div>

                            {/* Funcionalidad 3: Seguimiento de estados */}
                            <div className="card-precision p-5 bg-[#F8F9FA] border border-[#E5E7EB] hover:border-[#CBD5E1] transition-all duration-300 flex flex-col justify-between space-y-4 shadow-2xs hover:shadow-xs">
                                <div className="p-2 bg-[#EAECEF] rounded-[4px] border border-[#DCDFE4]">
                                    <div className="relative aspect-[16/10] overflow-hidden rounded-[3px] bg-[#01202F] group">
                                        <img
                                            src="/images/estadosCotizacion.jpg"
                                            alt="Seguimiento de estados de cotización"
                                            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 opacity-85 group-hover:opacity-95"
                                        />
                                        {/* Dark Overlay con gradiente oscuro técnico */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#01202F]/90 via-[#01202F]/35 to-transparent"></div>
                                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] font-tech text-white">
                                            <span className="text-amber-300 font-bold">Estados</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <h3 className="font-bold text-base text-(--text-main)">
                                        Seguimiento de estados en tiempo real
                                    </h3>
                                    <p className="text-xs sm:text-sm text-(--text-muted) leading-relaxed">
                                        Conoce el estado exacto de cada trabajo técnico: identifica de inmediato qué propuestas están en borrador, cuáles fueron enviadas y cuáles han sido aprobadas.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. BLOQUE CTA INFERIOR SUAVE (#F8F9FA) */}
                <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12">
                    <div className="bg-(--bg-subtle) rounded-[6px] border border-(--border-hairline) p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="space-y-1.5 text-center sm:text-left">
                            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-main)">
                                Empieza a cotizar tus trabajos técnicos hoy
                            </h3>
                            <p className="text-xs sm:text-sm text-(--text-muted) max-w-md">
                                Crea propuestas técnicas rápidas, formales y sin errores desde cualquier dispositivo frente a tus clientes.
                            </p>
                        </div>
                        <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
                            <Link
                                to="/register"
                                className="btn-precision-orange px-6 py-3 text-sm sm:text-base inline-flex items-center gap-2 shadow-2xs font-bold cursor-pointer"
                            >
                                Crear cuenta gratis
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </Link>

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
                                    Software para empresas de servicios técnicos que cotizan a personas y clientes particulares.
                                </p>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F0F6FC] mb-3">
                                    Producto
                                </h4>
                                <ul className="text-xs space-y-2">
                                    <li><a href="#componentes" className="hover:text-white transition-colors">Componentes</a></li>
                                    <li><a href="#funcionalidades" className="hover:text-white transition-colors">Funcionalidades</a></li>
                                    <li><Link to="/register" className="hover:text-white transition-colors">Empezar gratis</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#F0F6FC] mb-3">
                                    Empresa
                                </h4>
                                <ul className="text-xs space-y-2">
                                    <li><span className="text-[#8B949E]">Servicios e Instalaciones</span></li>
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
                                    <li><span className="text-[#8B949E]">Normativa colombiana</span></li>
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
            </main>
        </div>
    )
}

export default Home
