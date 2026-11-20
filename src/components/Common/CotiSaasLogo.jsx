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
            {/* Ícono Oficial: Llave mecánica Gris Plata + Rayo Dorado Premium */}
            <svg
                viewBox="0 0 100 100"
                className="w-8 h-8 shrink-0"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Llave mecánica diagonal (Gris Plata) */}
                <path
                    transform="scale(0.1953125)"
                    d="M507.73 109.1c-2.24-9.03-13.54-12.09-20.12-5.51l-74.36 74.36-67.88-11.31-11.31-67.88 74.36-74.36c6.62-6.62 3.43-17.9-5.66-20.16-47.38-11.74-99.55.91-136.58 37.93-39.64 39.64-50.55 97.1-34.05 147.2L18.74 402.76c-24.99 24.99-24.99 65.51 0 90.5 24.99 24.99 65.51 24.99 90.5 0l213.21-213.21c50.12 16.71 107.47 5.68 147.37-34.22 37.07-37.07 49.7-89.32 37.91-136.73zM64 472c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"
                    fill={wrenchColor}
                />

                {/* Rayo de Energía (Dorado Premium) */}
                <path
                    d="M59 33 L37 60 H50 L43 85 L68 54 H54 Z"
                    fill={goldColor}
                    stroke={isDark ? '#161B22' : '#FFFFFF'}
                    strokeWidth="2.7"
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
