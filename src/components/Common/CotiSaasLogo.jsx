const CotiSaasLogo = ({
    variant = 'light',
    showTagline = false,
    iconOnly = false,
    className = '',
}) => {
    const isDark = variant === 'dark'

    // Colores: Llave Gris Plata + Rayo Dorado Premium
    const wrenchColor = isDark ? '#AFB8C1' : '#7D8590'
    const goldColor = isDark ? '#E5A93C' : '#D49B28'
    const textCotiColor = isDark ? '#E6EDF3' : '#24292F'
    const textSaasColor = isDark ? '#FFFFFF' : '#01202F'
    const taglineColor = isDark ? '#8B949E' : '#57606A'

    return (
        <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
            {/* Ícono Oficial: Llave Gris Plata + Rayo Dorado Premium */}
            <svg
                viewBox="0 0 100 100"
                className="w-8 h-8 shrink-0 overflow-visible"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Llave Fija Inclinada (Gris Plata) */}
                <g transform="rotate(-38 50 50)">
                    {/* Mango de la llave */}
                    <path
                        d="M44 32 L44 82 C44 85.5 46.5 88.5 50 88.5 C53.5 88.5 56 85.5 56 82 L56 32 Z"
                        fill={wrenchColor}
                    />
                    {/* Orificio circular de la base */}
                    <circle cx="50" cy="80.5" r="3.5" fill={isDark ? '#161B22' : '#FFFFFF'} />
                    {/* Cabeza abierta de precisión */}
                    <path
                        d="M32 31 C32 19 40 12 50 12 C60 12 68 19 68 31 C68 36 65 40 61 42 L57 33 C57 29 54 26 50 26 C46 26 43 29 43 33 L39 42 C35 40 32 36 32 31 Z"
                        fill={wrenchColor}
                    />
                </g>

                {/* Rayo de Energía (Dorado Premium) */}
                <path
                    d="M52 14 L32 48 L49 48 L39 86 L72 44 L53 44 L64 14 Z"
                    fill={goldColor}
                    stroke={isDark ? '#161B22' : '#FFFFFF'}
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Wordmark Tipográfico */}
            {!iconOnly && (
                <div className="flex flex-col leading-none">
                    <span className="text-xl font-bold tracking-tight">
                        <span style={{ color: textCotiColor }}>Coti</span>
                        <span style={{ color: textSaasColor }} className="font-extrabold">SaaS</span>
                    </span>
                    {showTagline && (
                        <span
                            className="text-[9px] font-semibold tracking-widest uppercase mt-0.5"
                            style={{ color: taglineColor }}
                        >
                            Cotizaciones al instante
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}

export default CotiSaasLogo
