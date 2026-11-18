import { useState } from 'react'
import { useUser } from '../../context/UserContext.jsx'
import { useForm } from 'react-hook-form'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { Link, Navigate } from 'react-router'
import { registerService } from '../../services/authServices.js'
import toast from 'react-hot-toast'

const RegisterForm = () => {
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
        const result = await registerService(
            data,
            reset,
            setRedirect,
            checkSession
        )

        if (result?.success) {
            toast.success(result.message || 'Registro exitoso')
        } else {
            toast.error(result?.message || 'Error al registrarse')
        }
    }

    if (redirect) {
        return <Navigate to="/" />
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Campo Nombre / Asesor */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1.5">
                    Nombres y apellidos (Cotizador)
                </label>
                <input
                    {...register('username', {
                        required: 'El nombre o usuario es requerido',
                        minLength: {
                            value: 3,
                            message: 'Mínimo 3 caracteres',
                        },
                        maxLength: {
                            value: 75,
                            message: 'Máximo de 75 caracteres',
                        },
                    })}
                    className={`input-precision p-3 text-sm sm:text-base w-full ${
                        errors.username ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    type="text"
                    placeholder="Ej: Carlos Mario Restrepo"
                    name="username"
                    autoComplete="name"
                />
                {errors.username && (
                    <p className="text-rose-600 text-xs mt-1 font-medium">
                        {errors.username.message}
                    </p>
                )}
            </div>

            {/* Campo Email */}
            <div>
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1.5">
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
                        maxLength: {
                            value: 254,
                            message: 'Máximo de 254 caracteres',
                        },
                    })}
                    className={`input-precision p-3 text-sm sm:text-base w-full ${
                        errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    autoComplete="email"
                    name="email"
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
                <label className="block text-sm font-semibold text-[var(--text-main)] mb-1.5">
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
                            maxLength: {
                                value: 254,
                                message: 'Máximo 254 caracteres',
                            },
                        })}
                        className={`input-precision p-3 text-sm sm:text-base w-full pr-11 ${
                            errors.password ? 'border-rose-500 focus:border-rose-500' : ''
                        }`}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        autoComplete="new-password"
                    />
                    <button
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1"
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

            {/* Botón de Registro */}
            <div className="pt-2">
                <button
                    disabled={isSubmitting}
                    className="btn-precision-orange w-full py-2.5 text-sm font-bold shadow-xs cursor-pointer disabled:opacity-50"
                    type="submit"
                >
                    {isSubmitting ? 'Creando cuenta...' : 'Crear mi cuenta'}
                </button>
            </div>

            <div className="pt-2 text-center border-t border-[var(--border-hairline)]">
                <p className="text-xs sm:text-sm text-[var(--text-muted)]">
                    ¿Ya tienes una cuenta?{' '}
                    <Link
                        to="/login"
                        className="font-semibold text-[var(--brand-navy)] hover:text-[var(--brand-orange)] hover:underline"
                    >
                        Inicia sesión aquí
                    </Link>
                </p>
            </div>
        </form>
    )
}

export default RegisterForm
