import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, Navigate } from 'react-router'
import { loginService } from '../../services/authServices.js'
import { useUser } from '../../context/UserContext.jsx'
import toast from 'react-hot-toast'

const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        mode: 'onChange',
    })

    const { checkSession } = useUser()
    const [showPassword, setShowPassword] = useState(false)
    const [redirect, setRedirect] = useState(false)

    const onSubmit = async (data) => {
        const result = await loginService(data)
        if (result?.success) {
            await checkSession()
            reset()
            setRedirect(true)
            toast.success(result.message || 'Inicio de sesión exitoso')
        } else {
            toast.error(result?.message || 'Error al iniciar sesión')
        }
    }

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Email */}
            <div>
                <label className="block text-sm font-semibold text-(--text-main) mb-1.5">
                    Correo electrónico
                </label>
                <input
                    {...register('email', {
                        required: 'El correo electrónico es requerido',
                        pattern: {
                            value: /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9-]*\.)+[a-z]{2,}$/,
                            message: 'Correo electrónico inválido',
                        },
                        minLength: {
                            value: 6,
                            message: 'Mínimo 6 caracteres',
                        },
                    })}
                    className={`input-precision p-3 text-sm sm:text-base w-full ${
                        errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    autoComplete="email"
                    placeholder="tu-correo@empresa.com"
                    type="email"
                />
                {errors.email && (
                    <p className="text-rose-600 text-xs mt-1 font-medium">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Campo Contraseña */}
            <div>
                <label className="block text-sm font-semibold text-(--text-main) mb-1.5">
                    Contraseña
                </label>
                <div className="relative">
                    <input
                        {...register('password', {
                            required: 'La contraseña es requerida',
                            minLength: {
                                value: 6,
                                message: 'Mínimo 6 caracteres',
                            },
                        })}
                        className={`input-precision p-3 text-sm sm:text-base w-full pr-11 ${
                            errors.password ? 'border-rose-500 focus:border-rose-500' : ''
                        }`}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="current-password"
                    />
                    <button
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-(--text-muted) hover:text-(--text-main) transition-colors p-1"
                    >
                        {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-rose-600 text-xs mt-1 font-medium">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Enlace de recuperación posicionado abajo de los inputs */}
            <div className="flex justify-end">
                <Link
                    to="/forgot-password"
                    className="text-xs text-(--brand-orange) hover:underline font-medium transition-colors"
                >
                    ¿Olvidaste tu contraseña?
                </Link>
            </div>

            {/* Botón de Envío Naranja Industrial */}
            <div className="pt-2">
                <button
                    disabled={isSubmitting}
                    className="btn-precision-orange w-full py-2.5 text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50"
                    type="submit"
                >
                    {isSubmitting ? 'Iniciando sesión...' : 'Ingresar al sistema'}
                </button>
            </div>

            <div className="pt-2 text-center border-t border-(--border-hairline)">
                <p className="text-xs sm:text-sm text-(--text-muted)">
                    ¿Aún no tienes cuenta?{' '}
                    <Link
                        to="/register"
                        className="font-semibold text-(--brand-navy) hover:text-(--brand-orange) hover:underline"
                    >
                        Crear una cuenta gratis
                    </Link>
                </p>
            </div>
        </form>
    )
}

export default LoginForm
