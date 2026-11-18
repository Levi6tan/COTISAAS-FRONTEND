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
            {/* Campo Nombre / Usuario */}
            <div>
                <label className="block text-xs font-semibold text-[var(--brand-navy)] mb-1">
                    Nombres y apellidos / Asesor
                </label>
                <input
                    {...register('username', {
                        required: 'El nombre o usuario es requerido',
                        minLength: {
                            value: 4,
                            message: 'Mínimo 4 caracteres',
                        },
                        maxLength: {
                            value: 75,
                            message: 'Máximo de 75 caracteres',
                        },
                    })}
                    className={`input-precision p-2.5 text-xs w-full ${
                        errors.username ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    type="text"
                    placeholder="Ej: Carlos Mario Restrepo"
                    name="username"
                    autoComplete="name"
                />
                {errors.username && (
                    <p className="text-rose-600 text-[11px] mt-1 font-medium">
                        {errors.username.message}
                    </p>
                )}
            </div>

            {/* Campo Email */}
            <div>
                <label className="block text-xs font-semibold text-[var(--brand-navy)] mb-1">
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
                    className={`input-precision p-2.5 text-xs w-full ${
                        errors.email ? 'border-rose-500 focus:border-rose-500' : ''
                    }`}
                    autoComplete="email"
                    name="email"
                    placeholder="contacto@empresa.com"
                    type="email"
                />
                {errors.email && (
                    <p className="text-rose-600 text-[11px] mt-1 font-medium">
                        {errors.email.message}
                    </p>
                )}
            </div>

            {/* Campo Contraseña */}
            <div>
                <label className="block text-xs font-semibold text-[var(--brand-navy)] mb-1">
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
                        className={`input-precision p-2.5 text-xs w-full pr-10 ${
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
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--brand-navy)] transition-colors p-1"
                    >
                        {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                    </button>
                </div>
                {errors.password && (
                    <p className="text-rose-600 text-[11px] mt-1 font-medium">
                        {errors.password.message}
                    </p>
                )}
            </div>

            {/* Botón de Registro */}
            <div className="pt-2">
                <button
                    disabled={isSubmitting}
                    className="btn-precision-orange w-full py-2.5 text-xs tracking-wide uppercase font-bold shadow-xs cursor-pointer disabled:opacity-50"
                    type="submit"
                >
                    {isSubmitting ? 'Creando cuenta...' : 'Crear mi cuenta'}
                </button>
            </div>

            <div className="pt-2 text-center border-t border-[var(--border-hairline)]">
                <p className="text-xs text-[var(--text-muted)]">
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
