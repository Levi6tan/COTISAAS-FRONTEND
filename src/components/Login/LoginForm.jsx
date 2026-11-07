import { useState } from 'react'
import { useForm } from 'react-hook-form' // valida el form en tiempo real
import { FaEye, FaEyeSlash } from 'react-icons/fa' // Importando iconos del ojito para el pass
import { Link, Navigate } from 'react-router'
import { loginService } from '../../services/authServices.js'
import { useUser } from '../../context/UserContext.jsx'
import toast from 'react-hot-toast'

const LoginForm = () => {
    // esta funcion nos devuelve un handleSubmit
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        mode: 'onChange', // validacion en tiempo real
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
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-8 flex flex-col gap-4 lg:gap-6 max-w-[500px] mx-auto"
        >
            <div>
                <input
                    {...register('email', {
                        required: 'El email es requerido',
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
                    className={`p-2 rounded border focus:outline-Neutral w-full ${
                        errors.email
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    autoComplete="email"
                    name="email"
                    placeholder="Correo electronico"
                    type="email"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.email.message}
                    </p>
                )}
            </div>
            <div className="relative">
                <input
                    {...register('password', {
                        required:
                            'La contraseña es requerida [6-20 caracteres de longitud]',
                        minLength: {
                            value: 6,
                            message: 'Minimo 6 caracteres',
                        },
                        maxLength: {
                            value: 254,
                            message: 'Maximo 254 caracteres',
                        },
                    })}
                    className={`p-2 rounded border focus:outline-Neutral w-full ${
                        errors.password
                            ? 'border-red-500 outline-red-500 focus:outline-red-500'
                            : ''
                    }`}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    autoComplete="current-password"
                />
                <button
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                        showPassword
                            ? 'Ocultar contraseña'
                            : 'Mostrar contraseña'
                    }
                    type="button"
                    className="cursor-pointer absolute right-3 top-20px transform-translate-y-1/2 text-gray-600"
                >
                    {showPassword ? (
                        <FaEyeSlash size={23} />
                    ) : (
                        <FaEye size={23} />
                    )}
                </button>
                {errors.password && (
                    <p className="text-red-500 text-sm mt-2 ml-1">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button className="btn btn-neutral" type="submit">
                Iniciar sesión
            </button>
            <Link className="btn btn-Default" to="/register">
                Crear cuenta
            </Link>
        </form>
    )
}

export default LoginForm
