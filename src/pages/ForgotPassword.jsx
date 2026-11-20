import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { forgotPasswordService, resetPasswordService } from '../services/authServices.js'
import CotiSaasLogo from '../components/Common/CotiSaasLogo'
import toast from 'react-hot-toast'

const ForgotPassword = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(1) // 1: ingresar correo, 2: ingresar nueva contraseña
    const [email, setEmail] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)

    // Paso 1: Verificar correo electrónico
    const handleVerifyEmail = async (e) => {
        e.preventDefault()
        if (!email.trim()) {
            toast.error('Por favor ingresa tu correo electrónico')
            return
        }

        setLoading(true)
        const result = await forgotPasswordService(email.trim())
        setLoading(false)

        if (result?.success) {
            toast.success(result.message || 'Cuenta verificada')
            setStep(2)
        } else {
            toast.error(result?.message || 'No se encontró una cuenta con este correo')
        }
    }

    // Paso 2: Actualizar contraseña
    const handleResetPassword = async (e) => {
        e.preventDefault()
        if (newPassword.length < 6) {
            toast.error('La nueva contraseña debe tener al menos 6 caracteres')
            return
        }
        if (newPassword !== confirmPassword) {
            toast.error('Las contraseñas no coinciden')
            return
        }

        setLoading(true)
        const result = await resetPasswordService({
            email: email.trim(),
            newPassword,
        })
        setLoading(false)

        if (result?.success) {
            toast.success(result.message || 'Contraseña restablecida')
            navigate('/login')
        } else {
            toast.error(result?.message || 'Error al actualizar la contraseña')
        }
    }

    return (
        <div className="min-h-screen bg-(--bg-subtle) text-(--text-main) flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
                <Link to="/" className="inline-block hover:opacity-90 transition-opacity">
                    <CotiSaasLogo showTagline={true} />
                </Link>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-(--text-main)">
                        Recuperar contraseña
                    </h2>
                    <p className="text-xs sm:text-sm text-(--text-muted) mt-1">
                        {step === 1
                            ? 'Ingresa tu correo para verificar tu cuenta de cotizador.'
                            : 'Crea una nueva contraseña segura para tu acceso.'}
                    </p>
                </div>
            </div>

            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="card-precision bg-white p-6 sm:p-8 shadow-xs">
                    {step === 1 ? (
                        <form onSubmit={handleVerifyEmail} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-(--text-main) mb-1.5">
                                    Correo electrónico registrado
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ejemplo@empresa.com"
                                    className="input-precision p-3 text-sm sm:text-base w-full"
                                    autoComplete="email"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-precision-orange w-full py-2.5 text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Verificando...' : 'Continuar'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="p-2.5 bg-(--bg-subtle) border border-(--border-hairline) rounded-[4px] text-xs text-(--text-muted)">
                                Restableciendo para: <strong className="text-(--text-main)">{email}</strong>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-(--text-main) mb-1.5">
                                    Nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    className="input-precision p-3 text-sm sm:text-base w-full"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-(--text-main) mb-1.5">
                                    Confirmar nueva contraseña
                                </label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repite la contraseña"
                                    className="input-precision p-3 text-sm sm:text-base w-full"
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-precision-orange w-full py-2.5 text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50"
                            >
                                {loading ? 'Actualizando...' : 'Guardar nueva contraseña'}
                            </button>
                        </form>
                    )}

                    <div className="pt-4 mt-4 text-center border-t border-(--border-hairline) text-xs sm:text-sm text-(--text-muted)">
                        <Link
                            to="/login"
                            className="font-semibold text-(--brand-navy) hover:text-(--brand-orange) hover:underline"
                        >
                            ← Volver a Iniciar sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword
