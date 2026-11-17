import { useState, useEffect } from 'react'
import {
    getQuotationsService,
    createQuotationService,
    updateQuotationService,
    deleteQuotationService,
} from '../../services/quotationServices.js'
import { useUser } from '../../context/UserContext.jsx'
import toast from 'react-hot-toast'

// unitPrice inicia en cadena vacía para que se vea el placeholder y el usuario pueda escribir sin lidiar con un 0 fijo
const emptyItem = { concept: '', quantity: 1, unitPrice: '' }

const QuotationsDashboard = () => {
    const { checkSession } = useUser()
    const [quotations, setQuotations] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)

    // Estado del formulario
    const [formData, setFormData] = useState({
        clientName: '',
        description: '',
        status: 'pendiente',
        notes: '',
        items: [{ ...emptyItem }],
    })

    const fetchQuotations = async (term = '') => {
        try {
            const data = await getQuotationsService(term)
            setQuotations(data)
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
                await checkSession()
            } else {
                toast.error('Error al cargar las cotizaciones')
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        let isMounted = true

        getQuotationsService(search)
            .then((data) => {
                if (isMounted) setQuotations(data)
            })
            .catch((error) => {
                if (isMounted) {
                    if (error.response?.status === 401) {
                        toast.error('Tu sesión ha expirado. Inicia sesión nuevamente.')
                        checkSession()
                    } else {
                        toast.error('Error al cargar las cotizaciones')
                    }
                }
            })
            .finally(() => {
                if (isMounted) setLoading(false)
            })

        return () => {
            isMounted = false
        }
    }, [search, checkSession])

    const handleOpenModal = (quotation = null) => {
        if (quotation) {
            setEditingId(quotation._id)
            setFormData({
                clientName: quotation.clientName || '',
                description: quotation.description || '',
                status: quotation.status || 'pendiente',
                notes: quotation.notes || '',
                items:
                    quotation.items?.length > 0
                        ? quotation.items.map((i) => ({
                              concept: i.concept || '',
                              quantity: i.quantity ?? 1,
                              unitPrice: i.unitPrice !== undefined ? i.unitPrice : '',
                          }))
                        : [{ ...emptyItem }],
            })
        } else {
            setEditingId(null)
            setFormData({
                clientName: '',
                description: '',
                status: 'pendiente',
                notes: '',
                items: [{ ...emptyItem }],
            })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
    }

    // Permite borrar o escribir libremente sin forzar el 0 de inmediato
    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items]
        newItems[index][field] = value
        setFormData({ ...formData, items: newItems })
    }

    const addItemRow = () => {
        setFormData({ ...formData, items: [...formData.items, { ...emptyItem }] })
    }

    const removeItemRow = (index) => {
        if (formData.items.length === 1) return
        const newItems = formData.items.filter((_, idx) => idx !== index)
        setFormData({ ...formData, items: newItems })
    }

    const calculateTotal = () => {
        return formData.items.reduce(
            (acc, curr) => acc + (Number(curr.quantity) || 1) * (Number(curr.unitPrice) || 0),
            0
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.clientName.trim()) {
            toast.error('El nombre del cliente es obligatorio')
            return
        }

        // Normalizar los ítems convirtiendo a número con valores por defecto si se dejaron vacíos
        const payload = {
            ...formData,
            items: formData.items.map((i) => ({
                concept: i.concept?.trim() || 'Sin concepto',
                quantity: Number(i.quantity) > 0 ? Number(i.quantity) : 1,
                unitPrice: Number(i.unitPrice) >= 0 ? Number(i.unitPrice) : 0,
            })),
        }

        try {
            if (editingId) {
                await updateQuotationService(editingId, payload)
                toast.success('Cotización actualizada')
            } else {
                await createQuotationService(payload)
                toast.success('Cotización creada con éxito')
            }
            handleCloseModal()
            fetchQuotations(search)
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Tu sesión ha expirado o no estás autenticado. Por favor inicia sesión nuevamente.')
                await checkSession()
            } else {
                toast.error(error.response?.data?.message || 'Error al guardar la cotización')
            }
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('¿Seguro que deseas eliminar esta cotización?')) return
        try {
            await deleteQuotationService(id)
            toast.success('Cotización eliminada')
            fetchQuotations(search)
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
                await checkSession()
            } else {
                toast.error('Error al eliminar la cotización')
            }
        }
    }

    return (
        <section className="mt-8 space-y-6">
            {/* Cabecera y barra de acciones */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-gray-800">
                        Panel de Cotizaciones
                    </h2>
                    <p className="text-sm text-gray-500">
                        Crea, consulta y gestiona tus cotizaciones de servicios técnicos.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-neutral btn-sm sm:btn-md"
                >
                    + Nueva Cotización
                </button>
            </div>

            {/* Buscador */}
            <div className="w-full sm:max-w-xs">
                <input
                    type="text"
                    placeholder="Buscar cliente o descripción..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="p-2 text-sm rounded border border-gray-300 focus:outline-neutral w-full bg-white"
                />
            </div>

            {/* Tabla / Lista corporativa */}
            {loading ? (
                <div className="text-center py-10 text-gray-500 text-sm">
                    Cargando cotizaciones...
                </div>
            ) : quotations.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg border-gray-300 bg-gray-50">
                    <p className="text-gray-500 text-sm">No se encontraron cotizaciones.</p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="mt-3 text-sm text-blue-600 underline"
                    >
                        Comenzar creando la primera
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-xs bg-white">
                    <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-100 text-xs uppercase text-gray-600 border-b border-gray-200">
                            <tr>
                                <th className="p-3">Cliente</th>
                                <th className="p-3">Descripción</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3">Fecha</th>
                                <th className="p-3 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {quotations.map((q) => (
                                <tr key={q._id} className="hover:bg-gray-50">
                                    <td className="p-3 font-semibold text-gray-900">
                                        {q.clientName}
                                    </td>
                                    <td className="p-3 text-gray-600 max-w-[200px] truncate">
                                        {q.description || '-'}
                                    </td>
                                    <td className="p-3 font-medium text-gray-900">
                                        ${Number(q.total || 0).toLocaleString()}
                                    </td>
                                    <td className="p-3">
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded uppercase font-semibold ${
                                                q.status === 'aprobada'
                                                    ? 'bg-green-100 text-green-800'
                                                    : q.status === 'rechazada'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {q.status}
                                        </span>
                                    </td>
                                    <td className="p-3 text-xs text-gray-500">
                                        {new Date(q.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-3 text-right space-x-2">
                                        <button
                                            onClick={() => handleOpenModal(q)}
                                            className="text-xs text-blue-600 hover:underline font-medium"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q._id)}
                                            className="text-xs text-red-600 hover:underline font-medium"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal / Formulario de Creación y Edición */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 space-y-4">
                        <div className="flex justify-between items-center border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-900">
                                {editingId ? 'Editar Cotización' : 'Nueva Cotización'}
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-600 font-bold text-xl"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Nombre del Cliente *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: Inversiones ABC"
                                        value={formData.clientName}
                                        onChange={(e) =>
                                            setFormData({ ...formData, clientName: e.target.value })
                                        }
                                        className="p-2 border rounded w-full bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                                        Estado
                                    </label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) =>
                                            setFormData({ ...formData, status: e.target.value })
                                        }
                                        className="p-2 border rounded w-full bg-white"
                                    >
                                        <option value="pendiente">Pendiente</option>
                                        <option value="borrador">Borrador</option>
                                        <option value="aprobada">Aprobada</option>
                                        <option value="rechazada">Rechazada</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Descripción del Trabajo
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Mantenimiento e instalación de cámaras"
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    className="p-2 border rounded w-full bg-white"
                                />
                            </div>

                            {/* Conceptos dinámicos */}
                            <div className="border-t pt-3">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-xs font-semibold uppercase text-gray-700">
                                        Conceptos / Materiales / Mano de obra
                                    </span>
                                    <button
                                        type="button"
                                        onClick={addItemRow}
                                        className="text-xs text-blue-600 hover:underline font-semibold"
                                    >
                                        + Agregar Fila
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {formData.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="grid grid-cols-12 gap-2 items-center"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Concepto (ej: Cable, Cámara, Mano de obra)"
                                                value={item.concept}
                                                onChange={(e) =>
                                                    handleItemChange(idx, 'concept', e.target.value)
                                                }
                                                className="col-span-6 p-1.5 text-xs border rounded bg-white"
                                                required
                                            />
                                            <input
                                                type="number"
                                                placeholder="1"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) =>
                                                    handleItemChange(idx, 'quantity', e.target.value)
                                                }
                                                onBlur={() => {
                                                    // Poner 1 por defecto solo si se dejó vacío o menor o igual a 0
                                                    if (!item.quantity || Number(item.quantity) <= 0) {
                                                        handleItemChange(idx, 'quantity', 1)
                                                    }
                                                }}
                                                className="col-span-2 p-1.5 text-xs border rounded bg-white"
                                            />
                                            <input
                                                type="number"
                                                placeholder="0"
                                                min="0"
                                                value={item.unitPrice}
                                                onChange={(e) =>
                                                    handleItemChange(idx, 'unitPrice', e.target.value)
                                                }
                                                onBlur={() => {
                                                    // Poner 0 por defecto solo si no se ingresó un valor
                                                    if (
                                                        item.unitPrice === '' ||
                                                        item.unitPrice === null ||
                                                        item.unitPrice === undefined
                                                    ) {
                                                        handleItemChange(idx, 'unitPrice', 0)
                                                    }
                                                }}
                                                className="col-span-3 p-1.5 text-xs border rounded bg-white"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeItemRow(idx)}
                                                className="col-span-1 text-center text-red-500 hover:text-red-700 font-bold"
                                                title="Eliminar fila"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Total calculado */}
                                <div className="mt-4 text-right border-t pt-2 font-bold text-gray-900">
                                    Total: ${calculateTotal().toLocaleString()}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                    Observaciones o Garantías
                                </label>
                                <textarea
                                    rows="2"
                                    placeholder="Términos de pago, tiempo de entrega, garantía..."
                                    value={formData.notes}
                                    onChange={(e) =>
                                        setFormData({ ...formData, notes: e.target.value })
                                    }
                                    className="p-2 border rounded w-full bg-white text-xs"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3 border-t">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-outline btn-sm"
                                >
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-neutral btn-sm">
                                    {editingId ? 'Actualizar' : 'Guardar Cotización'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    )
}

export default QuotationsDashboard
