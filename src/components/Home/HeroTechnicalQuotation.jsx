const HeroTechnicalQuotation = () => {
    return (
        <div className="w-full max-w-lg mx-auto lg:max-w-none card-precision shadow-xs overflow-hidden select-none bg-white">
            {/* Barra superior estilo ventana técnica */}
            <div className="bg-[var(--bg-subtle)] px-4 py-2.5 border-b border-[var(--border-hairline)] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-tech text-[11px] font-bold text-[var(--text-main)]">
                        COT-2026-001
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] hidden sm:inline">
                        — Propuesta técnica
                    </span>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] font-tech text-[var(--text-muted)]">
                    <span className="px-1.5 py-0.5 bg-white rounded-[3px] border border-[var(--border-hairline)]">
                        DIAN 19%
                    </span>
                    <span className="px-1.5 py-0.5 bg-white rounded-[3px] border border-[var(--border-hairline)] text-emerald-700 font-semibold">
                        Aprobada
                    </span>
                </div>
            </div>

            {/* Cuerpo del documento */}
            <div className="p-5 space-y-4 bg-white text-xs">
                {/* Cabecera del Cliente */}
                <div className="flex justify-between items-start border-b border-[var(--border-hairline)] pb-3">
                    <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
                            Cliente
                        </span>
                        <p className="font-bold text-[var(--text-main)] text-sm">
                            Soluciones Técnicas Andina S.A.S
                        </p>
                        <p className="font-tech text-[11px] text-[var(--text-muted)]">
                            NIT: 901.442.890-4 • Bogotá, D.C.
                        </p>
                    </div>
                    <div className="text-right">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--text-muted)] block">
                            Vigencia
                        </span>
                        <p className="font-tech text-[11px] text-[var(--text-main)] font-semibold">
                            15 días calendario
                        </p>
                    </div>
                </div>

                {/* Tabla técnica de conceptos */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[var(--border-hairline)] text-[10px] uppercase font-semibold text-[var(--text-muted)]">
                                <th className="pb-1.5 font-semibold">Concepto / Material</th>
                                <th className="pb-1.5 text-center w-12">Cant.</th>
                                <th className="pb-1.5 text-right w-24">V. Unit.</th>
                                <th className="pb-1.5 text-right w-24">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--border-hairline)] font-tech text-[11px]">
                            <tr>
                                <td className="py-2 text-[var(--text-main)] font-sans">
                                    Cámara IP Domo 4MP Antivandálica
                                </td>
                                <td className="py-2 text-center text-[var(--text-muted)]">4 Und</td>
                                <td className="py-2 text-right text-[var(--text-muted)]">$ 145.000</td>
                                <td className="py-2 text-right font-medium text-[var(--text-main)]">$ 580.000</td>
                            </tr>
                            <tr>
                                <td className="py-2 text-[var(--text-main)] font-sans">
                                    Bobina Cable UTP Cat6 100% Cobre
                                </td>
                                <td className="py-2 text-center text-[var(--text-muted)]">1 Glb</td>
                                <td className="py-2 text-right text-[var(--text-muted)]">$ 320.000</td>
                                <td className="py-2 text-right font-medium text-[var(--text-main)]">$ 320.000</td>
                            </tr>
                            <tr>
                                <td className="py-2 text-[var(--text-main)] font-sans">
                                    Mano de obra técnica e instalación
                                </td>
                                <td className="py-2 text-center text-[var(--text-muted)]">1 Serv</td>
                                <td className="py-2 text-right text-[var(--text-muted)]">$ 280.000</td>
                                <td className="py-2 text-right font-medium text-[var(--text-main)]">$ 280.000</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Liquidación Financiera */}
                <div className="pt-2 border-t border-[var(--border-hairline)] flex justify-between items-end">
                    <div className="text-[11px] text-[var(--text-muted)] space-y-0.5">
                        <p>Forma de pago: <span className="text-[var(--text-main)] font-medium">50% Anticipo - 50% Saldo</span></p>
                        <p>Tiempo de entrega: <span className="text-[var(--text-main)] font-medium">3 días hábiles</span></p>
                    </div>
                    <div className="w-48 bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded-[4px] p-2.5 space-y-1 font-tech text-[11px]">
                        <div className="flex justify-between text-[var(--text-muted)]">
                            <span>Subtotal:</span>
                            <span>$ 1.180.000</span>
                        </div>
                        <div className="flex justify-between text-[var(--text-muted)]">
                            <span>IVA (19%):</span>
                            <span>$ 224.200</span>
                        </div>
                        <div className="pt-1.5 border-t border-[var(--border-hairline)] flex justify-between font-bold text-xs text-[var(--text-main)]">
                            <span>TOTAL:</span>
                            <span className="text-[var(--text-main)]">$ 1.404.200</span>
                        </div>
                    </div>
                </div>

                {/* Barra de Acciones Directas */}
                <div className="pt-2 flex items-center justify-between gap-2 border-t border-[var(--border-hairline)]">
                    <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1 font-medium">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Firma y validez comercial
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
    )
}

export default HeroTechnicalQuotation
