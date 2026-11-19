const HeroTechnicalQuotation = () => {
    return (
        <div className="relative w-full max-w-lg mx-auto lg:max-w-none py-4 px-2">
            {/* Esquinas técnicas industriales inspiradas en PreventivoPro */}
            <div className="absolute top-2 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[var(--brand-orange)] pointer-events-none z-20"></div>
            <div className="absolute top-2 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[var(--brand-orange)] pointer-events-none z-20"></div>
            <div className="absolute bottom-2 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[var(--brand-orange)] pointer-events-none z-20"></div>
            <div className="absolute bottom-2 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[var(--brand-orange)] pointer-events-none z-20"></div>

            {/* Marco técnico tenue perimetral */}
            <div className="absolute inset-1 border border-slate-300/70 rounded-[8px] pointer-events-none"></div>

            {/* Badge Flotante Superior Derecho (Efecto preventivo-pro) */}
            <div className="hidden sm:flex absolute -top-1 -right-3 z-30 animate-badge-float items-center gap-2 bg-white/95 backdrop-blur-xs border border-emerald-300/80 px-3 py-1.5 rounded-[6px] shadow-md text-xs font-semibold text-emerald-800">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>WhatsApp enviado al cliente</span>
                <span className="font-tech text-emerald-600 font-bold">✓</span>
            </div>

            {/* Badge Flotante Inferior Izquierdo (Efecto preventivo-pro) */}
            <div className="hidden sm:flex absolute -bottom-1 -left-3 z-30 animate-badge-float-delayed items-center gap-2 bg-[var(--brand-navy)] text-white px-3 py-1.5 rounded-[6px] shadow-lg text-xs font-tech border border-slate-700">
                <span className="text-[var(--brand-orange)] font-bold text-sm">$</span>
                <span className="text-slate-300">Total Liquidado:</span>
                <strong className="text-white font-bold">$ 773.500 COP</strong>
            </div>

            {/* Tarjeta principal con animación suave floating y elevación hover */}
            <div className="animate-technical-float shadow-precision-glow shadow-precision-hover card-precision bg-white overflow-hidden select-none relative z-10 border border-[#D0D7DE]">
                {/* Barra superior estilo ventana técnica de software */}
                <div className="bg-[var(--bg-subtle)] px-4 py-2.5 border-b border-[var(--border-hairline)] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 mr-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                        </div>
                        <span className="font-tech text-[10px] text-[var(--text-muted)] tracking-wider">
                            cotisaas.com/panel/cotizador
                        </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-tech text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[3px] font-bold">
                            COT-2026-001 • Aprobada
                        </span>
                    </div>
                </div>

                {/* Cuerpo del documento */}
                <div className="p-5 space-y-4 bg-white text-xs">
                    {/* Cabecera del Cliente Persona Natural */}
                    <div className="flex justify-between items-start border-b border-[var(--border-hairline)] pb-3">
                        <div>
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
                                Cliente (Persona / Propietario)
                            </span>
                            <p className="font-bold text-[var(--text-main)] text-sm">
                                Carlos Mario Restrepo Giraldo
                            </p>
                            <p className="font-tech text-[11px] text-[var(--text-muted)]">
                                CC: 1.020.458.912 • Casa 24, Conjunto Los Sauces
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
                                Validez
                            </span>
                            <p className="font-tech text-[11px] text-[var(--text-main)] font-semibold">
                                15 días
                            </p>
                        </div>
                    </div>

                    {/* Tabla técnica de conceptos */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-[var(--border-hairline)] text-[10px] uppercase font-semibold text-[var(--text-muted)]">
                                    <th className="pb-1.5 font-semibold">Concepto / Servicio</th>
                                    <th className="pb-1.5 text-center w-12">Cant.</th>
                                    <th className="pb-1.5 text-right w-24">V. Unit.</th>
                                    <th className="pb-1.5 text-right w-24">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-[var(--border-hairline)] font-tech text-[11px]">
                                <tr>
                                    <td className="py-2 text-[var(--text-main)] font-sans">
                                        Cámara IP Wi-Fi Exterior 4MP
                                    </td>
                                    <td className="py-2 text-center text-[var(--text-muted)]">2 Und</td>
                                    <td className="py-2 text-right text-[var(--text-muted)]">$ 160.000</td>
                                    <td className="py-2 text-right font-medium text-[var(--text-main)]">$ 320.000</td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-[var(--text-main)] font-sans">
                                        Cableado estructurado y canaleta
                                    </td>
                                    <td className="py-2 text-center text-[var(--text-muted)]">25 Mts</td>
                                    <td className="py-2 text-right text-[var(--text-muted)]">$ 6.000</td>
                                    <td className="py-2 text-right font-medium text-[var(--text-main)]">$ 150.000</td>
                                </tr>
                                <tr>
                                    <td className="py-2 text-[var(--text-main)] font-sans">
                                        Instalación, fijación y configuración en App
                                    </td>
                                    <td className="py-2 text-center text-[var(--text-muted)]">1 Serv</td>
                                    <td className="py-2 text-right text-[var(--text-muted)]">$ 180.000</td>
                                    <td className="py-2 text-right font-medium text-[var(--text-main)]">$ 180.000</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Liquidación Financiera */}
                    <div className="pt-2 border-t border-[var(--border-hairline)] flex justify-between items-end">
                        <div className="text-[11px] text-[var(--text-muted)] space-y-0.5">
                            <p>Pago: <span className="text-[var(--text-main)] font-medium">Contado / Contra entrega</span></p>
                            <p>Ejecución: <span className="text-[var(--text-main)] font-medium">1 día hábil</span></p>
                        </div>
                        <div className="w-48 bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded-[4px] p-2.5 space-y-1 font-tech text-[11px]">
                            <div className="flex justify-between text-[var(--text-muted)]">
                                <span>Subtotal:</span>
                                <span>$ 650.000</span>
                            </div>
                            <div className="flex justify-between text-[var(--text-muted)]">
                                <span>IVA (19%):</span>
                                <span>$ 123.500</span>
                            </div>
                            <div className="pt-1.5 border-t border-[var(--border-hairline)] flex justify-between font-bold text-xs text-[var(--text-main)]">
                                <span>TOTAL:</span>
                                <span className="text-[var(--text-main)]">$ 773.500</span>
                            </div>
                        </div>
                    </div>

                    {/* Barra de Acciones Directas */}
                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-[var(--border-hairline)]">
                        <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-medium">
                            <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Aprobado por el cliente
                        </span>
                        <div className="flex items-center gap-1.5">
                            <span className="px-2 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-[3px] text-[10px] font-semibold flex items-center gap-1">
                                WhatsApp
                            </span>
                            <span className="px-2 py-1 bg-[var(--bg-subtle)] text-[var(--text-main)] border border-[var(--border-hairline)] rounded-[3px] text-[10px] font-semibold">
                                PDF
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HeroTechnicalQuotation
