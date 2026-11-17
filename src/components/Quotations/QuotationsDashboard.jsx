import { useState, useEffect, useMemo } from 'react'
import {
    getQuotationsService,
    createQuotationService,
    updateQuotationService,
    deleteQuotationService,
} from '../../services/quotationServices.js'
import { useUser } from '../../context/UserContext.jsx'
import toast from 'react-hot-toast'

// Formateador de moneda colombiana estándar (COP)
const formatCOP = (val) => {
    const num = Number(val) || 0
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(num)
}

// Formatear fechas para inputs tipo date (YYYY-MM-DD)
const formatDateInput = (dateVal) => {
    if (!dateVal) return ''
    try {
        const d = new Date(dateVal)
        if (isNaN(d.getTime())) return ''
        return d.toISOString().split('T')[0]
    } catch {
        return ''
    }
}

// Opciones estándar para el mercado colombiano
const UNIT_OPTIONS = ['Und', 'Mts', 'Glb', 'Servicio', 'Hora']
const DOCUMENT_TYPES = [
    { value: 'NIT', label: 'NIT - Número de Identificación Tributaria' },
    { value: 'CC', label: 'CC - Cédula de Ciudadanía' },
    { value: 'CE', label: 'CE - Cédula de Extranjería' },
]
const PAYMENT_TERMS_OPTIONS = [
    '50% Anticipo - 50% Contra entrega',
    'Contado / Pago contra entrega',
    'Crédito 15 días',
    'Crédito 30 días',
]

// Estructura vacía para nueva fila de concepto
const createEmptyItem = () => ({
    concept: '',
    unit: 'Und',
    quantity: 1,
    unitPrice: '',
})

const QuotationsDashboard = () => {
    const { userInfo, checkSession } = useUser()
    const [quotations, setQuotations] = useState([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [previewQuotation, setPreviewQuotation] = useState(null)

    // Estado del formulario
    const [formData, setFormData] = useState({
        quoteNumber: '',
        quoterName: '',
        clientName: '',
        clientDocumentType: 'NIT',
        clientDocument: '',
        clientPhone: '',
        clientEmail: '',
        issueDate: '',
        validUntil: '',
        description: '',
        items: [createEmptyItem()],
        discount: '',
        applyIva: false,
        paymentTerms: '50% Anticipo - 50% Contra entrega',
        deliveryTime: '3 a 5 días hábiles',
        status: 'pendiente',
        notes: '',
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

    // Abrir modal de creación o edición
    const handleOpenModal = (quotation = null) => {
        const todayStr = new Date().toISOString().split('T')[0]
        const defaultValid = new Date()
        defaultValid.setDate(defaultValid.getDate() + 15)
        const validUntilStr = defaultValid.toISOString().split('T')[0]

        if (quotation) {
            setEditingId(quotation._id)
            setFormData({
                quoteNumber: quotation.quoteNumber || '',
                quoterName: quotation.quoterName || userInfo?.username || 'Asesor Comercial',
                clientName: quotation.clientName || '',
                clientDocumentType: quotation.clientDocumentType || 'NIT',
                clientDocument: quotation.clientDocument || '',
                clientPhone: quotation.clientPhone || '',
                clientEmail: quotation.clientEmail || '',
                issueDate: formatDateInput(quotation.issueDate) || todayStr,
                validUntil: formatDateInput(quotation.validUntil) || validUntilStr,
                description: quotation.description || '',
                items:
                    quotation.items && quotation.items.length > 0
                        ? quotation.items.map((i) => ({
                              concept: i.concept || '',
                              unit: i.unit || 'Und',
                              quantity: i.quantity ?? 1,
                              unitPrice: i.unitPrice !== undefined ? i.unitPrice : '',
                          }))
                        : [createEmptyItem()],
                discount: quotation.discount > 0 ? quotation.discount : '',
                applyIva: Boolean(quotation.applyIva),
                paymentTerms: quotation.paymentTerms || '50% Anticipo - 50% Contra entrega',
                deliveryTime: quotation.deliveryTime || '3 a 5 días hábiles',
                status: quotation.status || 'pendiente',
                notes: quotation.notes || '',
            })
        } else {
            setEditingId(null)
            setFormData({
                quoteNumber: '',
                quoterName: userInfo?.username || 'Asesor Comercial',
                clientName: '',
                clientDocumentType: 'NIT',
                clientDocument: '',
                clientPhone: '',
                clientEmail: '',
                issueDate: todayStr,
                validUntil: validUntilStr,
                description: '',
                items: [createEmptyItem()],
                discount: '',
                applyIva: false,
                paymentTerms: '50% Anticipo - 50% Contra entrega',
                deliveryTime: '3 a 5 días hábiles',
                status: 'pendiente',
                notes: '',
            })
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
    }

    // Manejo reactivo de ítems dinámicos sin bloqueo del cero
    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items]
        newItems[index][field] = value
        setFormData({ ...formData, items: newItems })
    }

    const addItemRow = () => {
        setFormData({
            ...formData,
            items: [...formData.items, createEmptyItem()],
        })
    }

    const removeItemRow = (index) => {
        if (formData.items.length === 1) {
            toast('La cotización debe tener al menos un concepto', { icon: 'ℹ️' })
            return
        }
        const newItems = formData.items.filter((_, idx) => idx !== index)
        setFormData({ ...formData, items: newItems })
    }

    // Cálculo financiero en tiempo real (Base, Descuento, IVA 19%, Total COP)
    const financialSummary = useMemo(() => {
        const subtotal = formData.items.reduce((acc, curr) => {
            const qty = Number(curr.quantity) >= 0 ? Number(curr.quantity) : 0
            const price = Number(curr.unitPrice) >= 0 ? Number(curr.unitPrice) : 0
            return acc + qty * price
        }, 0)

        const rawDiscount = Number(formData.discount) >= 0 ? Number(formData.discount) : 0
        const discount = Math.min(subtotal, rawDiscount)
        const taxableBase = Math.max(0, subtotal - discount)
        const ivaRate = 0.19
        const tax = formData.applyIva ? Math.round(taxableBase * ivaRate) : 0
        const total = taxableBase + tax

        return {
            subtotal,
            discount,
            taxableBase,
            tax,
            total,
        }
    }, [formData.items, formData.discount, formData.applyIva])

    // Enviar formulario (Crear o Actualizar)
    const handleSubmit = async (e) => {
        if (e) e.preventDefault()

        if (!formData.clientName.trim()) {
            toast.error('El nombre o razón social del cliente es obligatorio')
            return
        }

        // Limpiar y normalizar los ítems enviando valores numéricos
        const cleanedItems = formData.items.map((i) => ({
            concept: i.concept?.trim() || 'Sin concepto',
            unit: i.unit || 'Und',
            quantity: Number(i.quantity) > 0 ? Number(i.quantity) : 1,
            unitPrice: Number(i.unitPrice) >= 0 ? Number(i.unitPrice) : 0,
        }))

        const payload = {
            ...formData,
            items: cleanedItems,
            discount: Number(formData.discount) >= 0 ? Number(formData.discount) : 0,
            applyIva: Boolean(formData.applyIva),
        }

        try {
            if (editingId) {
                await updateQuotationService(editingId, payload)
                toast.success('Cotización actualizada exitosamente')
            } else {
                await createQuotationService(payload)
                toast.success('Cotización creada exitosamente')
            }
            handleCloseModal()
            fetchQuotations(search)
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Tu sesión ha expirado. Por favor inicia sesión nuevamente.')
                await checkSession()
            } else {
                const errMsg =
                    error.response?.data?.message ||
                    error.response?.data?.errors?.[0]?.message ||
                    'Error al guardar la cotización'
                toast.error(errMsg)
            }
        }
    }

    // Eliminar cotización
    const handleDelete = async (id, quoteNum) => {
        const label = quoteNum ? `la cotización ${quoteNum}` : 'esta cotización'
        if (!window.confirm(`¿Seguro que deseas eliminar ${label}?`)) return

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

    // Abrir vista previa formal
    const handleOpenPreview = (quotation) => {
        setPreviewQuotation(quotation)
    }

    const handlePreviewFromCurrentForm = () => {
        const previewData = {
            _id: editingId || 'temp',
            quoteNumber: formData.quoteNumber || 'COT-2026-BORRADOR',
            quoterName: formData.quoterName || userInfo?.username || 'Asesor Comercial',
            clientName: formData.clientName || 'Cliente No Especificado',
            clientDocumentType: formData.clientDocumentType || 'NIT',
            clientDocument: formData.clientDocument || 'N/A',
            clientPhone: formData.clientPhone || 'N/A',
            clientEmail: formData.clientEmail || 'N/A',
            issueDate: formData.issueDate,
            validUntil: formData.validUntil,
            description: formData.description,
            items: formData.items.map((i) => ({
                concept: i.concept || 'Sin concepto',
                unit: i.unit || 'Und',
                quantity: Number(i.quantity) || 1,
                unitPrice: Number(i.unitPrice) || 0,
                subtotal: (Number(i.quantity) || 1) * (Number(i.unitPrice) || 0),
            })),
            subtotal: financialSummary.subtotal,
            discount: financialSummary.discount,
            applyIva: formData.applyIva,
            tax: financialSummary.tax,
            total: financialSummary.total,
            paymentTerms: formData.paymentTerms,
            deliveryTime: formData.deliveryTime,
            status: formData.status,
            notes: formData.notes,
        }
        setPreviewQuotation(previewData)
    }

    return (
        <section className="mt-8 space-y-6">
            {/* Cabecera y botón principal */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <div className="flex items-center gap-2">
                        <span className="badge badge-sm badge-neutral font-semibold">B2B Colombia</span>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                            Cotizaciones Comerciales
                        </h2>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                        Elabora, edita y exporta propuestas de servicios técnicos e instalaciones con normativa tributaria colombiana.
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="btn btn-neutral btn-sm sm:btn-md shadow-xs gap-2 font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                    Nueva Cotización
                </button>
            </div>

            {/* Barra de búsqueda y filtros */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                <div className="relative w-full sm:max-w-md">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </span>
                    <input
                        type="text"
                        placeholder="Buscar por cliente, NIT, consecutivo o descripción..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 pr-3 py-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-800 w-full bg-white shadow-2xs"
                    />
                </div>
                <div className="text-xs text-gray-500 text-right self-center">
                    Total registros: <span className="font-semibold text-gray-800">{quotations.length}</span>
                </div>
            </div>

            {/* Tabla corporativa de cotizaciones */}
            {loading ? (
                <div className="text-center py-16 text-gray-500 text-sm bg-white rounded-lg border border-gray-200">
                    <span className="loading loading-spinner loading-md text-gray-700"></span>
                    <p className="mt-2">Cargando cotizaciones...</p>
                </div>
            ) : quotations.length === 0 ? (
                <div className="text-center py-16 border border-dashed rounded-xl border-gray-300 bg-gray-50/70 p-6">
                    <div className="inline-flex p-3 rounded-full bg-gray-100 text-gray-500 mb-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">No se encontraron cotizaciones</h3>
                    <p className="text-gray-500 text-xs mt-1 max-w-sm mx-auto">
                        Comienza elaborando tu primera propuesta comercial formal para tus clientes.
                    </p>
                    <button
                        onClick={() => handleOpenModal()}
                        className="mt-4 btn btn-neutral btn-sm"
                    >
                        + Crear Primera Cotización
                    </button>
                </div>
            ) : (
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-xs bg-white">
                    <table className="w-full text-left text-sm text-gray-700">
                        <thead className="bg-gray-50/80 text-xs font-semibold uppercase text-gray-600 border-b border-gray-200">
                            <tr>
                                <th className="py-3.5 px-4">Consecutivo</th>
                                <th className="py-3.5 px-4">Cliente / Identificación</th>
                                <th className="py-3.5 px-4">Cotizador</th>
                                <th className="py-3.5 px-4">Total (COP)</th>
                                <th className="py-3.5 px-4">Estado</th>
                                <th className="py-3.5 px-4">Vencimiento</th>
                                <th className="py-3.5 px-4 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {quotations.map((q) => (
                                <tr key={q._id} className="hover:bg-gray-50/70 transition-colors">
                                    <td className="py-3 px-4 font-mono font-bold text-gray-900 whitespace-nowrap">
                                        <span className="bg-gray-100 text-gray-800 px-2 py-0.5 rounded text-xs border border-gray-300">
                                            {q.quoteNumber || 'COT-SIN-NUM'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4">
                                        <div className="font-semibold text-gray-900 leading-snug">
                                            {q.clientName}
                                        </div>
                                        {q.clientDocument && (
                                            <div className="text-xs text-gray-500">
                                                {q.clientDocumentType || 'NIT'}: {q.clientDocument}
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-3 px-4 text-xs text-gray-600 whitespace-nowrap">
                                        {q.quoterName || 'Asesor'}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap font-semibold text-gray-900">
                                        {formatCOP(q.total || 0)}
                                    </td>
                                    <td className="py-3 px-4 whitespace-nowrap">
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-full font-medium border ${
                                                q.status === 'aprobada'
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    : q.status === 'rechazada'
                                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                                    : q.status === 'borrador'
                                                    ? 'bg-gray-100 text-gray-700 border-gray-200'
                                                    : 'bg-amber-50 text-amber-700 border-amber-200'
                                            }`}
                                        >
                                            {q.status ? q.status.charAt(0).toUpperCase() + q.status.slice(1) : 'Pendiente'}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-xs text-gray-500 whitespace-nowrap">
                                        {q.validUntil
                                            ? new Date(q.validUntil).toLocaleDateString('es-CO')
                                            : new Date(q.createdAt).toLocaleDateString('es-CO')}
                                    </td>
                                    <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                                        <button
                                            onClick={() => handleOpenPreview(q)}
                                            className="text-xs px-2 py-1 rounded text-gray-700 hover:bg-gray-100 font-medium transition-colors"
                                            title="Ver propuesta formal / Imprimir"
                                        >
                                            Vista Previa
                                        </button>
                                        <button
                                            onClick={() => handleOpenModal(q)}
                                            className="text-xs px-2 py-1 rounded text-blue-600 hover:bg-blue-50 font-medium transition-colors"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(q._id, q.quoteNumber)}
                                            className="text-xs px-2 py-1 rounded text-rose-600 hover:bg-rose-50 font-medium transition-colors"
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

            {/* MODAL 1: FORMULARIO CREAR / EDITAR COTIZACIÓN (B2B COLOMBIA) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-2 sm:p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col my-auto border border-gray-200">
                        {/* Cabecera del Modal */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200 bg-gray-50/70 rounded-t-xl">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-bold text-gray-900">
                                        {editingId ? 'Editar Cotización' : 'Nueva Cotización Comercial'}
                                    </h3>
                                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-white border border-gray-300 text-gray-800">
                                        {formData.quoteNumber || 'COT-2026-### (Automático)'}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Asesor comercial: <span className="font-medium text-gray-700">{formData.quoterName || userInfo?.username || 'Asesor'}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-400 hover:text-gray-700 p-1 rounded-lg text-2xl font-light leading-none"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Cuerpo del formulario scrollable */}
                        <div className="p-6 overflow-y-auto space-y-6 text-sm">
                            <form id="quotationForm" onSubmit={handleSubmit} className="space-y-6">
                                {/* SECCIÓN 1: CABECERA Y METADATOS DEL CLIENTE */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
                                        <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-bold">1</span>
                                        <h4 className="font-semibold text-gray-800 text-sm">Datos del Cliente y Contacto</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                        {/* Tipo de Documento */}
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Tipo Documento
                                            </label>
                                            <select
                                                value={formData.clientDocumentType}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientDocumentType: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            >
                                                {DOCUMENT_TYPES.map((doc) => (
                                                    <option key={doc.value} value={doc.value}>
                                                        {doc.value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Número de Documento (con DV para NIT) */}
                                        <div className="sm:col-span-4">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Número de Documento (o NIT con DV)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder={formData.clientDocumentType === 'NIT' ? '901.458.789-3' : '1.020.304.050'}
                                                value={formData.clientDocument}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientDocument: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            />
                                        </div>

                                        {/* Nombre / Razón Social */}
                                        <div className="sm:col-span-5">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Cliente / Razón Social *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ej: Inversiones y Soluciones S.A.S"
                                                value={formData.clientName}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientName: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            />
                                        </div>

                                        {/* Teléfono / WhatsApp */}
                                        <div className="sm:col-span-4">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Teléfono / Celular
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ej: +57 312 456 7890"
                                                value={formData.clientPhone}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientPhone: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            />
                                        </div>

                                        {/* Correo Electrónico */}
                                        <div className="sm:col-span-5">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Correo Electrónico
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="contacto@empresa.com"
                                                value={formData.clientEmail}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientEmail: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            />
                                        </div>

                                        {/* Estado de la Cotización */}
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Estado
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, status: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            >
                                                <option value="pendiente">Pendiente</option>
                                                <option value="borrador">Borrador</option>
                                                <option value="aprobada">Aprobada</option>
                                                <option value="rechazada">Rechazada</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 2: FECHAS Y OBJETO DE LA COTIZACIÓN */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
                                        <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-bold">2</span>
                                        <h4 className="font-semibold text-gray-800 text-sm">Vigencia y Objeto del Servicio</h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Fecha de Emisión
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.issueDate}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, issueDate: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Válida Hasta (Vencimiento)
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.validUntil}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, validUntil: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            />
                                        </div>
                                        <div className="sm:col-span-6">
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Objeto / Descripción del Trabajo
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Suministro e instalación de circuito cerrado de televisión (CCTV)"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 3: TABLA DE CONCEPTOS, UNIDADES Y PRECIOS */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b border-gray-200 pb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-bold">3</span>
                                            <h4 className="font-semibold text-gray-800 text-sm">Conceptos / Materiales / Mano de Obra</h4>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addItemRow}
                                            className="text-xs text-blue-700 hover:text-blue-900 font-semibold flex items-center gap-1"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                            </svg>
                                            Agregar Fila
                                        </button>
                                    </div>

                                    {/* Fila superior de encabezados requerida */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-xs border border-gray-200 rounded-lg">
                                            <thead className="bg-gray-100/80 text-gray-700 font-semibold uppercase">
                                                <tr>
                                                    <th className="p-2.5 min-w-[200px]">Descripción / Concepto</th>
                                                    <th className="p-2.5 w-24">Unidad</th>
                                                    <th className="p-2.5 w-20">Cant.</th>
                                                    <th className="p-2.5 w-36">Valor Unitario (COP)</th>
                                                    <th className="p-2.5 w-32 text-right">Subtotal</th>
                                                    <th className="p-2.5 w-10 text-center">Acción</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200 bg-white">
                                                {formData.items.map((item, idx) => {
                                                    const rowSubtotal =
                                                        (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)

                                                    return (
                                                        <tr key={idx} className="hover:bg-gray-50/50">
                                                            <td className="p-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Ej: Cámara IP Domo 4MP, Cable UTP Cat6, Mano de obra..."
                                                                    value={item.concept}
                                                                    onChange={(e) =>
                                                                        handleItemChange(idx, 'concept', e.target.value)
                                                                    }
                                                                    className="w-full p-1.5 border border-gray-300 rounded bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <select
                                                                    value={item.unit || 'Und'}
                                                                    onChange={(e) =>
                                                                        handleItemChange(idx, 'unit', e.target.value)
                                                                    }
                                                                    className="w-full p-1.5 border border-gray-300 rounded bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                                                >
                                                                    {UNIT_OPTIONS.map((u) => (
                                                                        <option key={u} value={u}>
                                                                            {u}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </td>
                                                            <td className="p-2">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    step="any"
                                                                    placeholder="1"
                                                                    value={item.quantity}
                                                                    onChange={(e) =>
                                                                        handleItemChange(idx, 'quantity', e.target.value)
                                                                    }
                                                                    onBlur={() => {
                                                                        if (item.quantity === '' || Number(item.quantity) <= 0) {
                                                                            handleItemChange(idx, 'quantity', 1)
                                                                        }
                                                                    }}
                                                                    className="w-full p-1.5 border border-gray-300 rounded bg-white text-xs text-center focus:ring-1 focus:ring-gray-800"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <div className="relative">
                                                                    <span className="absolute left-2 top-1.5 text-gray-400 select-none">$</span>
                                                                    <input
                                                                        type="number"
                                                                        min="0"
                                                                        placeholder="0"
                                                                        value={item.unitPrice}
                                                                        onChange={(e) =>
                                                                            handleItemChange(idx, 'unitPrice', e.target.value)
                                                                        }
                                                                        onBlur={() => {
                                                                            if (
                                                                                item.unitPrice === '' ||
                                                                                item.unitPrice === null ||
                                                                                item.unitPrice === undefined
                                                                            ) {
                                                                                handleItemChange(idx, 'unitPrice', 0)
                                                                            }
                                                                        }}
                                                                        className="w-full pl-5 pr-2 py-1.5 border border-gray-300 rounded bg-white text-xs text-right focus:ring-1 focus:ring-gray-800"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-2 text-right font-medium text-gray-900 whitespace-nowrap">
                                                                {formatCOP(rowSubtotal)}
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItemRow(idx)}
                                                                    className="text-gray-400 hover:text-rose-600 p-1 font-bold text-base transition-colors"
                                                                    title="Eliminar fila"
                                                                >
                                                                    &times;
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* SECCIÓN 4: DESGLOSE FINANCIERO E IMPUESTOS (IVA 19% COLOMBIA) */}
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                                    <div className="w-full sm:flex-1 space-y-3">
                                        <div className="flex items-center gap-2 border-b border-gray-200 pb-1.5">
                                            <span className="w-5 h-5 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-bold">4</span>
                                            <h4 className="font-semibold text-gray-800 text-sm">Condiciones Comerciales</h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Forma de Pago
                                                </label>
                                                <select
                                                    value={formData.paymentTerms}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, paymentTerms: e.target.value })
                                                    }
                                                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                                >
                                                    {PAYMENT_TERMS_OPTIONS.map((term) => (
                                                        <option key={term} value={term}>
                                                            {term}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                    Tiempo de Entrega / Ejecución
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: 3 a 5 días hábiles"
                                                    value={formData.deliveryTime}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, deliveryTime: e.target.value })
                                                    }
                                                    className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1">
                                                Observaciones, Exclusiones o Términos de Garantía
                                            </label>
                                            <textarea
                                                rows="3"
                                                placeholder="Garantía de 12 meses sobre equipos. No incluye acometida eléctrica principal..."
                                                value={formData.notes}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, notes: e.target.value })
                                                }
                                                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-xs focus:ring-1 focus:ring-gray-800"
                                            />
                                        </div>
                                    </div>

                                    {/* Bloque de Resumen Financiero Alineado a la Derecha */}
                                    <div className="w-full sm:w-80 bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3 shrink-0 shadow-2xs">
                                        <h5 className="font-semibold text-xs uppercase tracking-wider text-gray-600 border-b border-gray-200 pb-2">
                                            Liquidación Financiera
                                        </h5>

                                        <div className="flex justify-between text-xs text-gray-700">
                                            <span>Subtotal General:</span>
                                            <span className="font-medium text-gray-900">{formatCOP(financialSummary.subtotal)}</span>
                                        </div>

                                        {/* Descuento numérico opcional */}
                                        <div className="flex items-center justify-between gap-2 text-xs text-gray-700">
                                            <span>Descuento (COP):</span>
                                            <div className="relative w-32">
                                                <span className="absolute left-2 top-1 text-gray-400 select-none text-xs">$</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="0"
                                                    value={formData.discount}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, discount: e.target.value })
                                                    }
                                                    onBlur={() => {
                                                        if (formData.discount === '') {
                                                            setFormData({ ...formData, discount: 0 })
                                                        }
                                                    }}
                                                    className="w-full pl-5 pr-2 py-1 text-xs border border-gray-300 rounded bg-white text-right focus:ring-1 focus:ring-gray-800"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex justify-between text-xs text-gray-700">
                                            <span>Base Gravable:</span>
                                            <span className="font-medium text-gray-900">{formatCOP(financialSummary.taxableBase)}</span>
                                        </div>

                                        {/* Switch / Checkbox IVA 19% Colombia */}
                                        <div className="pt-2 border-t border-gray-200">
                                            <label className="flex items-center justify-between cursor-pointer text-xs">
                                                <span className="font-semibold text-gray-800">
                                                    Aplicar IVA (19%):
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.applyIva}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, applyIva: e.target.checked })
                                                    }
                                                    className="checkbox checkbox-sm checkbox-neutral"
                                                />
                                            </label>
                                            {formData.applyIva && (
                                                <div className="flex justify-between text-xs text-gray-600 mt-1 pl-1">
                                                    <span>IVA Calculado (19%):</span>
                                                    <span className="font-medium">{formatCOP(financialSummary.tax)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Total a Pagar Resaltado en Negrita */}
                                        <div className="pt-3 border-t-2 border-gray-300 flex justify-between items-baseline">
                                            <span className="text-sm font-bold text-gray-900">Total a Pagar:</span>
                                            <span className="text-lg font-extrabold text-gray-950 font-mono">
                                                {formatCOP(financialSummary.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer con botones de acción */}
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50/70 rounded-b-xl">
                            <button
                                type="button"
                                onClick={handlePreviewFromCurrentForm}
                                className="btn btn-sm btn-outline gap-1.5 w-full sm:w-auto"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Vista Previa / PDF
                            </button>

                            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="btn btn-sm btn-ghost"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    form="quotationForm"
                                    className="btn btn-sm btn-neutral px-5"
                                >
                                    {editingId ? 'Actualizar Cotización' : 'Guardar Cotización'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: VISTA PREVIA FORMAL / IMPRIMIR PROPUESTA (PDF) */}
            {previewQuotation && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-6 overflow-y-auto print:p-0 print:bg-white">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-gray-200 flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none">
                        {/* Barra superior no imprimible */}
                        <div className="flex justify-between items-center px-6 py-3 border-b border-gray-200 bg-gray-100 print:hidden">
                            <span className="text-xs font-semibold text-gray-700">
                                Vista Previa de Propuesta Comercial (Estándar B2B)
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => window.print()}
                                    className="btn btn-sm btn-neutral gap-1.5"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                                    </svg>
                                    Imprimir / Guardar PDF
                                </button>
                                <button
                                    onClick={() => setPreviewQuotation(null)}
                                    className="btn btn-sm btn-ghost"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>

                        {/* Hoja de la Propuesta Formal */}
                        <div className="p-8 sm:p-10 overflow-y-auto space-y-6 text-gray-800 bg-white print:p-0">
                            {/* Membrete y Cabecera de la Propuesta */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-gray-900 pb-6">
                                <div>
                                    <h1 className="text-2xl font-black tracking-tight text-gray-900">
                                        COTISAAS
                                    </h1>
                                    <p className="text-xs text-gray-500 font-medium">
                                        Soluciones Técnicas, Redes e Instalaciones Profesionales
                                    </p>
                                    <div className="text-xs text-gray-600 mt-2 space-y-0.5">
                                        <p>NIT: 901.882.341-1</p>
                                        <p>Asesor Asignado: <span className="font-semibold">{previewQuotation.quoterName || userInfo?.username || 'Asesor Comercial'}</span></p>
                                    </div>
                                </div>
                                <div className="sm:text-right">
                                    <span className="inline-block bg-gray-900 text-white font-mono text-xs px-2.5 py-1 rounded font-bold">
                                        {previewQuotation.quoteNumber || 'COT-2026-###'}
                                    </span>
                                    <div className="text-xs text-gray-600 mt-2 space-y-0.5">
                                        <p>Emisión: <span className="font-medium">{previewQuotation.issueDate ? new Date(previewQuotation.issueDate).toLocaleDateString('es-CO') : 'Hoy'}</span></p>
                                        <p>Válida Hasta: <span className="font-semibold text-gray-900">{previewQuotation.validUntil ? new Date(previewQuotation.validUntil).toLocaleDateString('es-CO') : '15 días'}</span></p>
                                        <p className="capitalize">Estado: <span className="font-semibold">{previewQuotation.status || 'Pendiente'}</span></p>
                                    </div>
                                </div>
                            </div>

                            {/* Datos del Cliente */}
                            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                                    Propuesta Comercial Presentada a:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <p className="text-gray-500">Cliente / Razón Social:</p>
                                        <p className="font-bold text-gray-900 text-sm">{previewQuotation.clientName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Identificación:</p>
                                        <p className="font-semibold text-gray-800">
                                            {previewQuotation.clientDocumentType || 'NIT'}: {previewQuotation.clientDocument || 'No especificado'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Teléfono / WhatsApp:</p>
                                        <p className="font-medium text-gray-800">{previewQuotation.clientPhone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Correo Electrónico:</p>
                                        <p className="font-medium text-gray-800">{previewQuotation.clientEmail || 'N/A'}</p>
                                    </div>
                                </div>
                                {previewQuotation.description && (
                                    <div className="mt-3 pt-2 border-t border-gray-200 text-xs">
                                        <span className="font-semibold text-gray-700">Objeto: </span>
                                        <span className="text-gray-600">{previewQuotation.description}</span>
                                    </div>
                                )}
                            </div>

                            {/* Tabla de Conceptos */}
                            <div>
                                <table className="w-full text-left text-xs border border-gray-300">
                                    <thead className="bg-gray-800 text-white font-semibold">
                                        <tr>
                                            <th className="p-2.5">Ítem / Concepto</th>
                                            <th className="p-2.5 text-center">Unidad</th>
                                            <th className="p-2.5 text-center">Cant.</th>
                                            <th className="p-2.5 text-right">Valor Unit. (COP)</th>
                                            <th className="p-2.5 text-right">Subtotal</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {previewQuotation.items?.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="p-2.5 font-medium text-gray-900">{item.concept}</td>
                                                <td className="p-2.5 text-center text-gray-600">{item.unit || 'Und'}</td>
                                                <td className="p-2.5 text-center font-medium">{item.quantity}</td>
                                                <td className="p-2.5 text-right text-gray-700">{formatCOP(item.unitPrice)}</td>
                                                <td className="p-2.5 text-right font-semibold text-gray-900">
                                                    {formatCOP((item.quantity || 1) * (item.unitPrice || 0))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Resumen Financiero de la Propuesta */}
                            <div className="flex justify-end">
                                <div className="w-full sm:w-72 space-y-1.5 text-xs text-gray-700 border border-gray-200 rounded-lg p-3 bg-gray-50">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-medium text-gray-900">{formatCOP(previewQuotation.subtotal || 0)}</span>
                                    </div>
                                    {Number(previewQuotation.discount) > 0 && (
                                        <div className="flex justify-between text-emerald-700">
                                            <span>Descuento Comercial:</span>
                                            <span className="font-medium">-{formatCOP(previewQuotation.discount)}</span>
                                        </div>
                                    )}
                                    {previewQuotation.applyIva && (
                                        <div className="flex justify-between">
                                            <span>IVA (19%):</span>
                                            <span className="font-medium text-gray-900">{formatCOP(previewQuotation.tax || 0)}</span>
                                        </div>
                                    )}
                                    <div className="pt-2 border-t-2 border-gray-300 flex justify-between font-bold text-sm text-gray-900">
                                        <span>TOTAL A PAGAR:</span>
                                        <span className="font-mono text-base font-extrabold">{formatCOP(previewQuotation.total || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Condiciones Comerciales y Firmas */}
                            <div className="border-t border-gray-200 pt-4 space-y-3 text-xs text-gray-600">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold text-gray-800">Forma de Pago:</p>
                                        <p>{previewQuotation.paymentTerms || '50% Anticipo - 50% Contra entrega'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Tiempo de Entrega / Ejecución:</p>
                                        <p>{previewQuotation.deliveryTime || '3 a 5 días hábiles'}</p>
                                    </div>
                                </div>
                                {previewQuotation.notes && (
                                    <div>
                                        <p className="font-semibold text-gray-800">Observaciones y Garantías:</p>
                                        <p className="whitespace-pre-line text-gray-700">{previewQuotation.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Sección de Aceptación y Firmas */}
                            <div className="pt-8 border-t border-dashed border-gray-300 grid grid-cols-2 gap-8 text-center text-xs">
                                <div>
                                    <div className="border-b border-gray-400 pb-8 mb-2"></div>
                                    <p className="font-bold text-gray-900">{previewQuotation.quoterName || userInfo?.username || 'Asesor Comercial'}</p>
                                    <p className="text-gray-500">CoTISaas - Elaborado por</p>
                                </div>
                                <div>
                                    <div className="border-b border-gray-400 pb-8 mb-2"></div>
                                    <p className="font-bold text-gray-900">{previewQuotation.clientName}</p>
                                    <p className="text-gray-500">Aceptado y Recibido a Conformidad</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    )
}

export default QuotationsDashboard
