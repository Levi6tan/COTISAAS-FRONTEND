import { useState, useEffect, useMemo, useRef } from 'react'
import {
    getQuotationsService,
    createQuotationService,
    updateQuotationService,
    deleteQuotationService,
    sendQuotationEmailService,
} from '../../services/quotationServices.js'
import { logoutService } from '../../services/authServices.js'
import { useUser } from '../../context/UserContext.jsx'
import CotiSaasLogo from '../Common/CotiSaasLogo'
import {
    FaWhatsapp,
    FaEnvelope,
    FaEdit,
    FaTrash,
    FaBars,
    FaTimes,
    FaPlus,
    FaSignOutAlt,
    FaSearch,
    FaExchangeAlt,
    FaCheck,
} from 'react-icons/fa'
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

// Opciones estándar para el cotizador y clientes personas / particulares
const UNIT_OPTIONS = ['Und', 'Mts', 'Glb', 'Servicio', 'Hora']
const DOCUMENT_TYPES = [
    { value: 'CC', label: 'CC - Cédula de Ciudadanía (Personas)' },
    { value: 'NIT', label: 'NIT - Identificación Tributaria' },
    { value: 'CE', label: 'CE - Cédula de Extranjería' },
]
const PAYMENT_TERMS_OPTIONS = [
    'Contado / Pago contra entrega',
    '50% Anticipo - 50% Contra entrega',
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

// Configuración de estilos y etiquetas por estado
const STATUS_CONFIG = {
    aprobada: {
        label: 'Aprobada',
        badgeClass: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    rechazada: {
        label: 'Rechazada',
        badgeClass: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    pendiente: {
        label: 'Pendiente',
        badgeClass: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    borrador: {
        label: 'Borrador',
        badgeClass: 'bg-gray-100 text-gray-700 border-gray-300',
    },
}

const QuotationsDashboard = () => {
    const { userInfo, checkSession } = useUser()
    const [quotations, setQuotations] = useState([])
    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('todas') // 'todas', 'pendiente', 'aprobada', 'borrador', 'rechazada'
    const [loading, setLoading] = useState(true)
    const [sendingEmailId, setSendingEmailId] = useState(null)
    // ID de la cotización cuyo dropdown de estado está abierto
    const [openStatusDropdownId, setOpenStatusDropdownId] = useState(null)
    const statusDropdownRef = useRef(null)

    // Sidebar móvil (drawer)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    // Modales
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [previewQuotation, setPreviewQuotation] = useState(null)

    // Estado del formulario (enfocado a clientes personas y particulares)
    const [formData, setFormData] = useState({
        quoteNumber: '',
        quoterName: '',
        clientName: '',
        clientDocumentType: 'CC',
        clientDocument: '',
        clientPhone: '',
        clientEmail: '',
        issueDate: '',
        validUntil: '',
        description: '',
        items: [createEmptyItem()],
        discount: '',
        applyIva: false,
        paymentTerms: 'Contado / Pago contra entrega',
        deliveryTime: '1 a 3 días hábiles',
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

    // Cerrar sesión desde el sidebar
    const handleLogout = async () => {
        const result = await logoutService()
        await checkSession()
        if (result?.success) {
            toast.success('Sesión finalizada')
        }
    }

    // Inicial del primer nombre del cotizador
    const firstInitial = userInfo?.username?.trim()
        ? userInfo.username.trim().charAt(0).toUpperCase()
        : 'C'

    // Filtrar cotizaciones por estado seleccionado en el menú lateral
    const filteredQuotations = useMemo(() => {
        if (statusFilter === 'todas') return quotations
        return quotations.filter((q) => q.status === statusFilter)
    }, [quotations, statusFilter])

    // Contadores para el menú lateral
    const counts = useMemo(() => {
        return {
            todas: quotations.length,
            pendiente: quotations.filter((q) => q.status === 'pendiente').length,
            aprobada: quotations.filter((q) => q.status === 'aprobada').length,
            borrador: quotations.filter((q) => q.status === 'borrador').length,
        }
    }, [quotations])

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
                quoterName: quotation.quoterName || userInfo?.username || 'Cotizador',
                clientName: quotation.clientName || '',
                clientDocumentType: quotation.clientDocumentType || 'CC',
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
                paymentTerms: quotation.paymentTerms || 'Contado / Pago contra entrega',
                deliveryTime: quotation.deliveryTime || '1 a 3 días hábiles',
                status: quotation.status || 'pendiente',
                notes: quotation.notes || '',
            })
        } else {
            setEditingId(null)
            setFormData({
                quoteNumber: '',
                quoterName: userInfo?.username || 'Cotizador',
                clientName: '',
                clientDocumentType: 'CC',
                clientDocument: '',
                clientPhone: '',
                clientEmail: '',
                issueDate: todayStr,
                validUntil: validUntilStr,
                description: '',
                items: [createEmptyItem()],
                discount: '',
                applyIva: false,
                paymentTerms: 'Contado / Pago contra entrega',
                deliveryTime: '1 a 3 días hábiles',
                status: 'borrador', // Por defecto borrador hasta enviarla
                notes: '',
            })
        }
        setIsModalOpen(true)
        setIsMobileSidebarOpen(false)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setEditingId(null)
    }

    // Manejo reactivo de ítems dinámicos
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

    // Cálculo financiero en tiempo real
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
            toast.error('El nombre de la persona o cliente es obligatorio')
            return
        }

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
                toast.error('Tu sesión ha expirado. Inicia sesión nuevamente.')
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

    // Cambio rápido de estado desde la tabla (sin abrir el modal de edición)
    const handleQuickStatusChange = async (quotation, newStatus) => {
        setOpenStatusDropdownId(null)
        if (quotation.status === newStatus) return

        const statusLabels = {
            aprobada: 'Aprobada ✓',
            rechazada: 'Rechazada ✗',
            pendiente: 'Pendiente',
            borrador: 'Borrador',
        }

        try {
            await updateQuotationService(quotation._id, { status: newStatus })
            toast.success(`Estado cambiado a ${statusLabels[newStatus] || newStatus}`)
            // Refresca toda la lista: actualiza la tabla, los contadores del sidebar y los badges
            fetchQuotations(search)
        } catch (error) {
            if (error.response?.status === 401) {
                toast.error('Tu sesión ha expirado. Inicia sesión nuevamente.')
                await checkSession()
            } else {
                toast.error('Error al cambiar el estado de la cotización')
            }
        }
    }

    // Cerrar dropdown de estado al hacer clic fuera de él
    useEffect(() => {
        if (!openStatusDropdownId) return
        const handleClickOutside = (e) => {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target)) {
                setOpenStatusDropdownId(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [openStatusDropdownId])

    // PASO 1: ENVÍO FORMAL POR CORREO (AUTOMÁTICO DESDE BACKEND CON PDF ADJUNTO)
    const handleSendEmail = async (quotation) => {
        let targetEmail = (quotation.clientEmail || '').trim()

        if (!targetEmail || !targetEmail.includes('@')) {
            const inputEmail = window.prompt(
                `El cliente "${quotation.clientName}" no tiene un correo registrado.\nIngresa el correo para enviar el PDF adjunto:`,
                'goltv@gmail.com'
            )
            if (!inputEmail) return
            targetEmail = inputEmail.trim()
        }

        if (!targetEmail || !targetEmail.includes('@')) {
            toast.error('Correo electrónico no válido')
            return
        }

        setSendingEmailId(quotation._id)
        const toastId = toast.loading(`Generando PDF y enviando a ${targetEmail}...`)

        try {
            const result = await sendQuotationEmailService(quotation._id, targetEmail)
            toast.success(result.message || `Cotización enviada a ${targetEmail}`, { id: toastId })
            
            // Recargar para reflejar el cambio automático de estado (Borrador -> Pendiente)
            fetchQuotations(search)

            // PASO 2 INMEDIATO: Preguntar si desea abrir WhatsApp con el mensaje prellenado
            const firstName = quotation.clientName ? quotation.clientName.trim().split(' ')[0] : 'estimado cliente'
            setTimeout(() => {
                const wantWhatsApp = window.confirm(
                    `Cotización enviada a ${targetEmail}.\n\n¿Deseas enviar el aviso directo a ${firstName} por WhatsApp ahora?`
                )
                if (wantWhatsApp) {
                    handleSendWhatsApp({ ...quotation, clientEmail: targetEmail })
                }
            }, 350)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error al enviar correo', { id: toastId })
        } finally {
            setSendingEmailId(null)
        }
    }

    // PASO 2: NOTIFICACIÓN RÁPIDA POR WHATSAPP (UN CLIC)
    const handleSendWhatsApp = (quotation) => {
        let rawPhone = (quotation.clientPhone || '').replace(/\D/g, '')

        if (!rawPhone || rawPhone.length < 7) {
            const inputPhone = window.prompt(
                `El cliente "${quotation.clientName}" no tiene un teléfono registrado.\nIngresa el número de WhatsApp celular (ej: 3120988234):`,
                '573120988234'
            )
            if (!inputPhone) return
            rawPhone = inputPhone.replace(/\D/g, '')
        }

        if (!rawPhone) {
            toast.error('Número de teléfono inválido')
            return
        }

        // Si es número celular de Colombia (10 dígitos que inicia por 3), agregar código de país 57
        let fullPhone = rawPhone
        if (rawPhone.length === 10 && rawPhone.startsWith('3')) {
            fullPhone = `57${rawPhone}`
        }

        // Extracción del primer nombre (ej: "Marcos Sanchez" -> "Marcos")
        const firstName = quotation.clientName ? quotation.clientName.trim().split(' ')[0] : 'estimado cliente'
        const quoteNum = quotation.quoteNumber || 'COT-2026-001'
        const totalAmount = formatCOP(quotation.total || 0)
        const emailNotice = quotation.clientEmail ? ` (${quotation.clientEmail})` : ''

        // Texto prellenado exactamente según el requerimiento:
        // "Hola Marcos, te acabo de enviar a tu correo (goltv@gmail.com) la cotización COT-2026-001 por valor de $2.023.000. Quedo atento a tus comentarios"
        const message = `Hola ${firstName}, te acabo de enviar a tu correo${emailNotice} la cotización ${quoteNum} por valor de ${totalAmount}. Quedo atento a tus comentarios.`

        const whatsappUrl = `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`
        window.open(whatsappUrl, '_blank')
        toast.success('Abriendo chat de WhatsApp...')
    }

    // Abrir vista previa formal
    const handleOpenPreview = (quotation) => {
        setPreviewQuotation(quotation)
    }

    const handlePreviewFromCurrentForm = () => {
        const previewData = {
            _id: editingId || 'temp',
            quoteNumber: formData.quoteNumber || 'COT-2026-BORRADOR',
            quoterName: formData.quoterName || userInfo?.username || 'Cotizador',
            clientName: formData.clientName || 'Persona / Propietario',
            clientDocumentType: formData.clientDocumentType || 'CC',
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
        <div className="min-h-screen bg-[var(--bg-subtle)] text-[var(--text-main)] flex flex-col lg:flex-row">
            {/* MENÚ LATERAL (SIDEBAR EN DESKTOP) */}
            <aside className="hidden lg:flex w-64 bg-white border-r border-[var(--border-hairline)] flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
                <div className="p-5 space-y-6">
                    {/* Logo de CotiSaaS */}
                    <div className="pb-4 border-b border-[var(--border-hairline)]">
                        <CotiSaasLogo showTagline={false} />
                    </div>

                    {/* Identificador del Cotizador: Solo la Inicial del primer nombre */}
                    <div className="flex items-center gap-3 p-2.5 rounded-[6px] bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">
                        <div className="w-9 h-9 rounded-full bg-[var(--brand-navy)] text-white flex items-center justify-center font-bold text-base shrink-0 shadow-2xs">
                            {firstInitial}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-bold text-[var(--text-main)] truncate">
                                {userInfo?.username || 'Cotizador'}
                            </p>
                            <span className="text-[11px] text-[var(--text-muted)] block truncate">
                                Asesor Técnico
                            </span>
                        </div>
                    </div>

                    {/* Botón de Acción Rápida: Nueva Cotización */}
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-precision-orange w-full py-2.5 text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                    >
                        <FaPlus size={12} />
                        Nueva Cotización
                    </button>

                    {/* Menú de Navegación y Filtros de Estado */}
                    <nav className="space-y-1 text-xs">
                        <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] px-3 tracking-wider block mb-2">
                            Filtros de Cotizaciones
                        </span>
                        <button
                            onClick={() => setStatusFilter('todas')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] font-medium transition-colors cursor-pointer ${
                                statusFilter === 'todas'
                                    ? 'bg-[var(--brand-navy)] text-white font-semibold'
                                    : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                            }`}
                        >
                            <span>Todas las cotizaciones</span>
                            <span className={`text-[11px] font-tech px-1.5 py-0.5 rounded-[3px] ${
                                statusFilter === 'todas' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                            }`}>
                                {counts.todas}
                            </span>
                        </button>

                        <button
                            onClick={() => setStatusFilter('pendiente')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] font-medium transition-colors cursor-pointer ${
                                statusFilter === 'pendiente'
                                    ? 'bg-[var(--brand-navy)] text-white font-semibold'
                                    : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                            }`}
                        >
                            <span>Pendientes</span>
                            <span className={`text-[11px] font-tech px-1.5 py-0.5 rounded-[3px] ${
                                statusFilter === 'pendiente' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                            }`}>
                                {counts.pendiente}
                            </span>
                        </button>

                        <button
                            onClick={() => setStatusFilter('aprobada')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] font-medium transition-colors cursor-pointer ${
                                statusFilter === 'aprobada'
                                    ? 'bg-[var(--brand-navy)] text-white font-semibold'
                                    : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                            }`}
                        >
                            <span>Aprobadas</span>
                            <span className={`text-[11px] font-tech px-1.5 py-0.5 rounded-[3px] ${
                                statusFilter === 'aprobada' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                                {counts.aprobada}
                            </span>
                        </button>

                        <button
                            onClick={() => setStatusFilter('borrador')}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] font-medium transition-colors cursor-pointer ${
                                statusFilter === 'borrador'
                                    ? 'bg-[var(--brand-navy)] text-white font-semibold'
                                    : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                            }`}
                        >
                            <span>Borradores</span>
                            <span className={`text-[11px] font-tech px-1.5 py-0.5 rounded-[3px] ${
                                statusFilter === 'borrador' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
                            }`}>
                                {counts.borrador}
                            </span>
                        </button>
                    </nav>
                </div>

                {/* Pie del Sidebar: Cerrar sesión */}
                <div className="p-4 border-t border-[var(--border-hairline)] space-y-2">
                    <p className="text-[11px] text-[var(--text-muted)] truncate font-tech px-1">
                        {userInfo?.email}
                    </p>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-[4px] transition-colors cursor-pointer"
                    >
                        <FaSignOutAlt />
                        Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* BARRA SUPERIOR PARA MÓVIL Y TABLET (< lg) */}
            <div className="lg:hidden bg-white border-b border-[var(--border-hairline)] px-4 py-3 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsMobileSidebarOpen(true)}
                        className="p-2 text-[var(--text-main)] hover:bg-[var(--bg-subtle)] rounded-[4px] cursor-pointer"
                        aria-label="Abrir menú"
                    >
                        <FaBars size={18} />
                    </button>
                    <CotiSaasLogo showTagline={false} />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-precision-orange p-2 text-xs font-bold rounded-[4px] shadow-2xs"
                        title="Nueva Cotización"
                    >
                        <FaPlus size={14} />
                    </button>
                    <div className="w-8 h-8 rounded-full bg-[var(--brand-navy)] text-white flex items-center justify-center font-bold text-xs">
                        {firstInitial}
                    </div>
                </div>
            </div>

            {/* SIDEBAR MÓVIL (DRAWER DESPLEGABLE) */}
            {isMobileSidebarOpen && (
                <div className="fixed inset-0 z-50 lg:hidden flex">
                    <div
                        className="fixed inset-0 bg-black/50 transition-opacity"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                    <div className="relative w-72 max-w-[80vw] bg-white h-full flex flex-col justify-between shadow-xl z-10 p-5">
                        <div className="space-y-5">
                            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-hairline)]">
                                <CotiSaasLogo showTagline={false} />
                                <button
                                    onClick={() => setIsMobileSidebarOpen(false)}
                                    className="p-1.5 text-gray-500 hover:text-gray-800"
                                >
                                    <FaTimes size={18} />
                                </button>
                            </div>

                            <div className="flex items-center gap-3 p-2.5 rounded-[4px] bg-[var(--bg-subtle)] border border-[var(--border-hairline)]">
                                <div className="w-8 h-8 rounded-full bg-[var(--brand-navy)] text-white flex items-center justify-center font-bold text-sm">
                                    {firstInitial}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-xs font-bold text-[var(--text-main)] truncate">
                                        {userInfo?.username || 'Cotizador'}
                                    </p>
                                    <span className="text-[11px] text-[var(--text-muted)] block">
                                        Asesor Técnico
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={() => handleOpenModal()}
                                className="btn-precision-orange w-full py-2.5 text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                            >
                                <FaPlus size={12} />
                                Nueva Cotización
                            </button>

                            <nav className="space-y-1 text-xs">
                                <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] px-2 block mb-1">
                                    Filtros
                                </span>
                                {['todas', 'pendiente', 'aprobada', 'borrador'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            setStatusFilter(status)
                                            setIsMobileSidebarOpen(false)
                                        }}
                                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[4px] capitalize ${
                                            statusFilter === status
                                                ? 'bg-[var(--brand-navy)] text-white font-semibold'
                                                : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                                        }`}
                                    >
                                        <span>{status === 'todas' ? 'Todas' : status}</span>
                                        <span className="font-tech text-[11px] opacity-80">
                                            {counts[status]}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>

                        <div className="pt-4 border-t border-[var(--border-hairline)]">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-[4px]"
                            >
                                <FaSignOutAlt />
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CONTENIDO PRINCIPAL DEL DASHBOARD */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
                {/* Cabecera del Panel con texto actualizado */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[var(--border-hairline)] pb-5">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--text-main)]">
                            Gestión de Cotizaciones
                        </h2>
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] mt-1">
                            Crea propuestas técnicas y profesionales para tus clientes.
                        </p>
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        className="btn-precision-orange px-4 py-2 text-xs sm:text-sm shadow-xs gap-2 inline-flex items-center cursor-pointer font-bold shrink-0"
                    >
                        <FaPlus size={12} />
                        Nueva Cotización
                    </button>
                </div>

                {/* Barra de Búsqueda y Contador al Fondo Derecho */}
                <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
                    <div className="w-full sm:max-w-md relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[var(--text-muted)]">
                            <FaSearch size={13} />
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar por cliente, cédula, consecutivo o trabajo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="input-precision pl-9 pr-3 py-2 text-xs sm:text-sm w-full bg-white"
                        />
                    </div>

                    {/* Contador de registros ubicado al fondo derecho del buscador */}
                    <div className="text-xs text-[var(--text-muted)] sm:text-right shrink-0">
                        <span className="bg-white px-3 py-1.5 rounded-[4px] border border-[var(--border-hairline)] font-tech text-xs shadow-2xs inline-block">
                            Total registros: <strong className="text-[var(--text-main)] font-bold">{filteredQuotations.length}</strong>
                        </span>
                    </div>
                </div>

                {/* CONTENIDO RESPONSIVE: VISTA TABLA (DESKTOP/TABLET) Y VISTA TARJETAS (MÓVIL) */}
                {loading ? (
                    <div className="text-center py-16 text-[var(--text-muted)] text-sm card-precision bg-white">
                        <span className="loading loading-spinner loading-md text-[var(--brand-navy)]"></span>
                        <p className="mt-2 font-medium">Cargando cotizaciones...</p>
                    </div>
                ) : filteredQuotations.length === 0 ? (
                    <div className="text-center py-14 border border-dashed rounded-[6px] border-[var(--border-hairline)] bg-white p-6 space-y-2">
                        <p className="text-sm font-semibold text-[var(--text-main)]">
                            No se encontraron cotizaciones
                        </p>
                        <p className="text-xs text-[var(--text-muted)] max-w-xs mx-auto">
                            Comienza creando tu primera propuesta técnica para enviarla a tu cliente por correo o WhatsApp.
                        </p>
                        <button
                            onClick={() => handleOpenModal()}
                            className="mt-3 btn-precision-orange px-4 py-2 text-xs font-bold"
                        >
                            + Crear Cotización
                        </button>
                    </div>
                ) : (
                    <>
                        {/* A. VISTA TABLA PARA PC Y TABLET (md+) */}
                        <div className="hidden md:block overflow-x-auto card-precision bg-white shadow-xs">
                            <table className="w-full text-left text-sm text-[var(--text-main)] border-collapse">
                                <thead className="bg-[var(--bg-subtle)] text-xs font-semibold uppercase text-[var(--text-muted)] border-b border-[var(--border-hairline)]">
                                    <tr>
                                        <th className="py-3 px-4">Consecutivo</th>
                                        <th className="py-3 px-4">Cliente / Cédula</th>
                                        <th className="py-3 px-4">Cotizador</th>
                                        <th className="py-3 px-4">Total (COP)</th>
                                        <th className="py-3 px-4">Estado</th>
                                        <th className="py-3 px-4">Vencimiento</th>
                                        <th className="py-3 px-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[var(--border-hairline)]">
                                    {filteredQuotations.map((q) => (
                                        <tr key={q._id} className="hover:bg-[var(--bg-subtle)]/70 transition-colors">
                                            <td className="py-3 px-4 font-tech font-bold text-[var(--brand-navy)] whitespace-nowrap">
                                                <span className="bg-[var(--bg-subtle)] text-[var(--brand-navy)] px-2 py-0.5 rounded-[3px] text-xs border border-[var(--border-hairline)]">
                                                    {q.quoteNumber || 'COT-SIN-NUM'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="font-semibold text-[var(--text-main)] leading-snug">
                                                    {q.clientName}
                                                </div>
                                                {q.clientDocument && (
                                                    <div className="text-xs text-[var(--text-muted)] font-tech">
                                                        {q.clientDocumentType || 'CC'}: {q.clientDocument}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-3 px-4 text-xs text-[var(--text-muted)] whitespace-nowrap">
                                                {q.quoterName || 'Cotizador'}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap font-tech font-bold text-[var(--text-main)]">
                                                {formatCOP(q.total || 0)}
                                            </td>
                                            <td className="py-3 px-4 whitespace-nowrap">
                                                <span
                                                    className={`text-[11px] px-2 py-0.5 rounded-[3px] font-semibold border uppercase tracking-wider ${
                                                        q.status === 'aprobada'
                                                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                            : q.status === 'rechazada'
                                                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                                                            : q.status === 'borrador'
                                                            ? 'bg-gray-100 text-gray-700 border-gray-300'
                                                            : 'bg-amber-50 text-amber-800 border-amber-200'
                                                    }`}
                                                >
                                                    {q.status ? q.status.toUpperCase() : 'PENDIENTE'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-xs text-[var(--text-muted)] font-tech whitespace-nowrap">
                                                {q.validUntil
                                                    ? new Date(q.validUntil).toLocaleDateString('es-CO')
                                                    : new Date(q.createdAt).toLocaleDateString('es-CO')}
                                            </td>
                                            {/* BOTONES DE ACCIÓN: CORREO + WHATSAPP + ESTADO + EDITAR + ELIMINAR */}
                                            <td className="py-3 px-4 text-right whitespace-nowrap">
                                                <div className="inline-flex items-center justify-end gap-1.5">
                                                    {/* Botón 1: Enviar por Correo Electrónico (PDF adjunto) */}
                                                    <button
                                                        onClick={() => handleSendEmail(q)}
                                                        disabled={sendingEmailId === q._id}
                                                        title="Enviar cotización por correo electrónico (PDF adjunto)"
                                                        className="p-2 rounded-[4px] text-[var(--brand-navy)] hover:text-blue-700 hover:bg-blue-50 transition-colors cursor-pointer disabled:opacity-50"
                                                        aria-label="Enviar por Correo"
                                                    >
                                                        <FaEnvelope size={15} />
                                                    </button>

                                                    {/* Botón 2: Notificación rápida por WhatsApp */}
                                                    <button
                                                        onClick={() => handleSendWhatsApp(q)}
                                                        title="Notificar por WhatsApp al cliente"
                                                        className="p-2 rounded-[4px] text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                                                        aria-label="Notificar por WhatsApp"
                                                    >
                                                        <FaWhatsapp size={16} />
                                                    </button>

                                                    {/* Botón 3: Cambiar Estado (reemplaza vista previa) */}
                                                    <div className="relative" ref={openStatusDropdownId === q._id ? statusDropdownRef : null}>
                                                        <button
                                                            onClick={() => setOpenStatusDropdownId(openStatusDropdownId === q._id ? null : q._id)}
                                                            title="Cambiar estado de la cotización"
                                                            className="p-2 rounded-[4px] text-gray-500 hover:text-[var(--text-main)] hover:bg-gray-100 transition-colors cursor-pointer"
                                                            aria-label="Cambiar estado"
                                                        >
                                                            <FaExchangeAlt size={14} />
                                                        </button>

                                                        {openStatusDropdownId === q._id && (
                                                            <div className="absolute right-0 top-full mt-1 z-40 bg-white border border-[var(--border-hairline)] rounded-[4px] shadow-md w-[148px]">
                                                                <div className="border-b border-[var(--border-hairline)] px-3 py-2">
                                                                    <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">
                                                                        Estado
                                                                    </p>
                                                                </div>
                                                                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                                                    <button
                                                                        key={key}
                                                                        onClick={() => handleQuickStatusChange(q, key)}
                                                                        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors cursor-pointer border-b border-[var(--border-hairline)] last:border-0 ${
                                                                            q.status === key
                                                                                ? 'bg-[var(--bg-subtle)] text-[var(--brand-navy)] font-bold'
                                                                                : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                                                                        }`}
                                                                    >
                                                                        <span>{cfg.label}</span>
                                                                        {q.status === key && (
                                                                            <FaCheck size={9} className="text-[var(--brand-navy)] shrink-0" />
                                                                        )}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Botón 4: Editar / Lápiz */}
                                                    <button
                                                        onClick={() => handleOpenModal(q)}
                                                        title="Editar cotización"
                                                        className="p-2 rounded-[4px] text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors cursor-pointer"
                                                        aria-label="Editar"
                                                    >
                                                        <FaEdit size={15} />
                                                    </button>

                                                    {/* Botón 5: Eliminar / Papelera */}
                                                    <button
                                                        onClick={() => handleDelete(q._id, q.quoteNumber)}
                                                        title="Eliminar cotización"
                                                        className="p-2 rounded-[4px] text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                                                        aria-label="Eliminar"
                                                    >
                                                        <FaTrash size={14} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* B. VISTA TARJETAS PARA CELULARES (< md) */}
                        <div className="md:hidden space-y-3">
                            {filteredQuotations.map((q) => (
                                <div key={q._id} className="card-precision p-4 bg-white shadow-2xs space-y-3">
                                    <div className="flex justify-between items-start">
                                        <span className="font-tech font-bold text-xs bg-[var(--bg-subtle)] text-[var(--brand-navy)] px-2 py-0.5 rounded-[3px] border border-[var(--border-hairline)]">
                                            {q.quoteNumber || 'COT-SIN-NUM'}
                                        </span>
                                        {/* Badge de estado estático en móvil */}
                                        <span
                                            className={`text-[10px] px-2 py-0.5 rounded-[3px] font-semibold uppercase tracking-wider border ${
                                                q.status === 'aprobada'
                                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                    : q.status === 'rechazada'
                                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                                    : q.status === 'borrador'
                                                    ? 'bg-gray-100 text-gray-700 border-gray-300'
                                                    : 'bg-amber-50 text-amber-800 border-amber-200'
                                            }`}
                                        >
                                            {q.status ? q.status.toUpperCase() : 'PENDIENTE'}
                                        </span>
                                    </div>

                                    <div>
                                        <h4 className="font-bold text-sm text-[var(--text-main)]">
                                            {q.clientName}
                                        </h4>
                                        {q.clientDocument && (
                                            <p className="text-xs text-[var(--text-muted)] font-tech">
                                                {q.clientDocumentType || 'CC'}: {q.clientDocument}
                                            </p>
                                        )}
                                        {q.description && (
                                            <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-1">
                                                {q.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-baseline pt-2 border-t border-[var(--border-hairline)]">
                                        <div>
                                            <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block">
                                                Total al Cliente
                                            </span>
                                            <span className="font-tech text-base font-bold text-[var(--text-main)]">
                                                {formatCOP(q.total || 0)}
                                            </span>
                                        </div>
                                        <div className="text-right text-[11px] text-[var(--text-muted)] font-tech">
                                            Vence: {q.validUntil ? new Date(q.validUntil).toLocaleDateString('es-CO') : '15 días'}
                                        </div>
                                    </div>

                                    {/* Íconos de acción táctiles en móvil */}
                                    <div className="flex items-center justify-between pt-2 border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)] -mx-4 -mb-4 p-2.5 rounded-b-[6px]">
                                        <span className="text-[11px] text-[var(--text-muted)] font-medium">
                                            Acciones:
                                        </span>
                                        <div className="flex items-center gap-1.5">
                                            <button
                                                onClick={() => handleSendEmail(q)}
                                                disabled={sendingEmailId === q._id}
                                                className="p-2 rounded-[4px] bg-blue-50 text-[var(--brand-navy)] hover:bg-blue-100"
                                                title="Enviar por Correo"
                                            >
                                                <FaEnvelope size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleSendWhatsApp(q)}
                                                className="p-2 rounded-[4px] bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                title="WhatsApp"
                                            >
                                                <FaWhatsapp size={16} />
                                            </button>
                                            {/* Botón cambiar estado en móvil (dentro de acciones) */}
                                            <div className="relative" ref={openStatusDropdownId === `ma-${q._id}` ? statusDropdownRef : null}>
                                                <button
                                                    onClick={() => setOpenStatusDropdownId(openStatusDropdownId === `ma-${q._id}` ? null : `ma-${q._id}`)}
                                                    className="p-2 rounded-[4px] bg-white text-gray-600 border border-[var(--border-hairline)] hover:bg-gray-50"
                                                    title="Cambiar estado"
                                                >
                                                    <FaExchangeAlt size={13} />
                                                </button>
                                                {openStatusDropdownId === `ma-${q._id}` && (
                                                    <div className="absolute right-0 bottom-full mb-1 z-40 bg-white border border-[var(--border-hairline)] rounded-[4px] shadow-md w-[148px]">
                                                        <div className="border-b border-[var(--border-hairline)] px-3 py-2">
                                                            <p className="text-[10px] font-bold uppercase text-[var(--text-muted)] tracking-wider">
                                                                Estado
                                                            </p>
                                                        </div>
                                                        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                                                            <button
                                                                key={key}
                                                                onClick={() => handleQuickStatusChange(q, key)}
                                                                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs text-left transition-colors cursor-pointer border-b border-[var(--border-hairline)] last:border-0 ${
                                                                    q.status === key
                                                                        ? 'bg-[var(--bg-subtle)] text-[var(--brand-navy)] font-bold'
                                                                        : 'text-[var(--text-main)] hover:bg-[var(--bg-subtle)]'
                                                                }`}
                                                            >
                                                                <span>{cfg.label}</span>
                                                                {q.status === key && (
                                                                    <FaCheck size={9} className="text-[var(--brand-navy)] shrink-0" />
                                                                )}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleOpenModal(q)}
                                                className="p-2 rounded-[4px] bg-blue-50 text-blue-700 hover:bg-blue-100"
                                                title="Editar"
                                            >
                                                <FaEdit size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(q._id, q.quoteNumber)}
                                                className="p-2 rounded-[4px] bg-rose-50 text-rose-600 hover:bg-rose-100"
                                                title="Eliminar"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </main>

            {/* MODAL 1: FORMULARIO CREAR / EDITAR COTIZACIÓN (100% RESPONSIVE) */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-2 sm:p-4 overflow-y-auto">
                    <div className="card-precision bg-white w-full max-w-4xl max-h-[94vh] flex flex-col my-auto shadow-2xl">
                        {/* Cabecera del Modal */}
                        <div className="flex justify-between items-center px-4 sm:px-6 py-3.5 border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] rounded-t-[6px]">
                            <div>
                                <div className="flex items-center gap-2">
                                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-main)]">
                                        {editingId ? 'Editar Cotización' : 'Nueva Cotización'}
                                    </h3>
                                    <span className="font-tech text-xs font-semibold px-2 py-0.5 rounded-[3px] bg-white border border-[var(--border-hairline)] text-[var(--brand-navy)]">
                                        {formData.quoteNumber || 'COT-2026-###'}
                                    </span>
                                </div>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                    Cotizador: <span className="font-semibold text-[var(--text-main)]">{formData.quoterName || userInfo?.username || 'Cotizador'}</span>
                                </p>
                            </div>
                            <button
                                onClick={handleCloseModal}
                                className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1 text-2xl font-light leading-none cursor-pointer"
                            >
                                &times;
                            </button>
                        </div>

                        {/* Cuerpo Scrollable del Formulario */}
                        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
                            <form id="quotationForm" onSubmit={handleSubmit} className="space-y-6">
                                {/* SECCIÓN 1: DATOS DEL CLIENTE (PERSONA NATURAL / PROPIETARIO) */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-1.5">
                                        <span className="w-5 h-5 rounded-full bg-[var(--brand-navy)] text-white text-[11px] flex items-center justify-center font-bold">1</span>
                                        <h4 className="font-semibold text-[var(--text-main)] text-xs sm:text-sm">
                                            Datos del Cliente (Persona / Propietario)
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                        {/* Tipo de Documento */}
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Tipo Documento
                                            </label>
                                            <select
                                                value={formData.clientDocumentType}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientDocumentType: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            >
                                                {DOCUMENT_TYPES.map((doc) => (
                                                    <option key={doc.value} value={doc.value}>
                                                        {doc.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Número de Cédula / Documento */}
                                        <div className="sm:col-span-4">
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Número de Identificación (CC / NIT)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ej: 1101433098"
                                                value={formData.clientDocument}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientDocument: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            />
                                        </div>

                                        {/* Nombre de la Persona */}
                                        <div className="sm:col-span-5">
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Nombre Completo de la Persona *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                placeholder="Ej: Marcos Sanchez"
                                                value={formData.clientName}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientName: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            />
                                        </div>

                                        {/* Celular / WhatsApp */}
                                        <div className="sm:col-span-4">
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Celular / WhatsApp (Para envío)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ej: 3120988234"
                                                value={formData.clientPhone}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientPhone: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            />
                                        </div>

                                        {/* Correo Electrónico */}
                                        <div className="sm:col-span-5">
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Correo Electrónico (Para envío PDF)
                                            </label>
                                            <input
                                                type="email"
                                                placeholder="goltv@gmail.com"
                                                value={formData.clientEmail}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, clientEmail: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            />
                                        </div>

                                        {/* Estado: El cotizador puede cambiar manualmente a aprobada o rechazada */}
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Estado
                                            </label>
                                            <select
                                                value={formData.status}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, status: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            >
                                                <option value="borrador">Borrador</option>
                                                <option value="pendiente">Pendiente</option>
                                                <option value="aprobada">Aprobada</option>
                                                <option value="rechazada">Rechazada</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 2: FECHAS Y TRABAJO A REALIZAR */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-1.5">
                                        <span className="w-5 h-5 rounded-full bg-[var(--brand-navy)] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                                        <h4 className="font-semibold text-[var(--text-main)] text-xs sm:text-sm">
                                            Servicio y Plazos
                                        </h4>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Fecha Emisión
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.issueDate}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, issueDate: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            />
                                        </div>
                                        <div className="sm:col-span-3">
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Válida Hasta
                                            </label>
                                            <input
                                                type="date"
                                                value={formData.validUntil}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, validUntil: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            />
                                        </div>
                                        <div className="sm:col-span-6">
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Descripción General del Trabajo
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Ej: Instalación de red Wi-Fi y configuración de equipos"
                                                value={formData.description}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, description: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* SECCIÓN 3: CONCEPTOS, MATERIALES Y MANO DE OBRA */}
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center border-b border-[var(--border-hairline)] pb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="w-5 h-5 rounded-full bg-[var(--brand-navy)] text-white text-[11px] flex items-center justify-center font-bold">3</span>
                                            <h4 className="font-semibold text-[var(--text-main)] text-xs sm:text-sm">
                                                Conceptos / Materiales / Mano de Obra
                                            </h4>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addItemRow}
                                            className="text-xs text-[var(--brand-navy)] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                                        >
                                            <FaPlus size={10} />
                                            Agregar Fila
                                        </button>
                                    </div>

                                    {/* Versión Desktop / Tablet: Tabla */}
                                    <div className="hidden sm:block overflow-x-auto border border-[var(--border-hairline)] rounded-[6px]">
                                        <table className="w-full text-left text-xs">
                                            <thead className="bg-[var(--bg-subtle)] text-[var(--text-muted)] font-semibold uppercase border-b border-[var(--border-hairline)]">
                                                <tr>
                                                    <th className="p-2.5 min-w-[200px]">Descripción / Servicio</th>
                                                    <th className="p-2.5 w-24">Unidad</th>
                                                    <th className="p-2.5 w-20">Cant.</th>
                                                    <th className="p-2.5 w-36">Valor Unitario (COP)</th>
                                                    <th className="p-2.5 w-32 text-right">Subtotal</th>
                                                    <th className="p-2.5 w-10 text-center"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-[var(--border-hairline)] bg-white">
                                                {formData.items.map((item, idx) => {
                                                    const rowSubtotal =
                                                        (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)

                                                    return (
                                                        <tr key={idx} className="hover:bg-[var(--bg-subtle)]/50">
                                                            <td className="p-2">
                                                                <input
                                                                    type="text"
                                                                    placeholder="Ej: Cámara IP, Cable UTP, Mano de obra..."
                                                                    value={item.concept}
                                                                    onChange={(e) =>
                                                                        handleItemChange(idx, 'concept', e.target.value)
                                                                    }
                                                                    className="input-precision w-full p-1.5 text-xs"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <select
                                                                    value={item.unit || 'Und'}
                                                                    onChange={(e) =>
                                                                        handleItemChange(idx, 'unit', e.target.value)
                                                                    }
                                                                    className="input-precision w-full p-1.5 text-xs"
                                                                >
                                                                    {UNIT_OPTIONS.map((u) => (
                                                                        <option key={u} value={u}>{u}</option>
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
                                                                    className="input-precision w-full p-1.5 text-xs text-center"
                                                                />
                                                            </td>
                                                            <td className="p-2">
                                                                <div className="relative">
                                                                    <span className="absolute left-2 top-1.5 text-[var(--text-muted)] select-none">$</span>
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
                                                                        className="input-precision w-full pl-5 pr-2 py-1.5 text-xs text-right font-tech"
                                                                    />
                                                                </div>
                                                            </td>
                                                            <td className="p-2 text-right font-tech font-semibold text-[var(--text-main)] whitespace-nowrap">
                                                                {formatCOP(rowSubtotal)}
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItemRow(idx)}
                                                                    className="text-gray-400 hover:text-rose-600 p-1 font-bold text-sm cursor-pointer"
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

                                    {/* Versión Celular (< sm): Tarjetas apiladas touch-friendly */}
                                    <div className="sm:hidden space-y-3">
                                        {formData.items.map((item, idx) => {
                                            const rowSubtotal =
                                                (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0)

                                            return (
                                                <div key={idx} className="p-3 border border-[var(--border-hairline)] rounded-[6px] bg-[var(--bg-subtle)] space-y-2.5">
                                                    <div>
                                                        <label className="text-[10px] font-bold uppercase text-[var(--text-muted)] block mb-1">
                                                            Descripción #{idx + 1}
                                                        </label>
                                                        <input
                                                            type="text"
                                                            placeholder="Ej: Mano de obra, cable, equipo..."
                                                            value={item.concept}
                                                            onChange={(e) =>
                                                                handleItemChange(idx, 'concept', e.target.value)
                                                            }
                                                            className="input-precision w-full p-2 text-xs bg-white"
                                                            required
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-12 gap-2 items-center">
                                                        <div className="col-span-4">
                                                            <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Unidad</label>
                                                            <select
                                                                value={item.unit || 'Und'}
                                                                onChange={(e) =>
                                                                    handleItemChange(idx, 'unit', e.target.value)
                                                                }
                                                                className="input-precision w-full p-1.5 text-xs bg-white"
                                                            >
                                                                {UNIT_OPTIONS.map((u) => (
                                                                    <option key={u} value={u}>{u}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className="col-span-3">
                                                            <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Cant.</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                value={item.quantity}
                                                                onChange={(e) =>
                                                                    handleItemChange(idx, 'quantity', e.target.value)
                                                                }
                                                                onBlur={() => {
                                                                    if (!item.quantity || Number(item.quantity) <= 0) {
                                                                        handleItemChange(idx, 'quantity', 1)
                                                                    }
                                                                }}
                                                                className="input-precision w-full p-1.5 text-xs text-center bg-white"
                                                            />
                                                        </div>
                                                        <div className="col-span-5">
                                                            <label className="text-[10px] text-[var(--text-muted)] block mb-0.5">Valor Unit. ($)</label>
                                                            <input
                                                                type="number"
                                                                min="0"
                                                                placeholder="0"
                                                                value={item.unitPrice}
                                                                onChange={(e) =>
                                                                    handleItemChange(idx, 'unitPrice', e.target.value)
                                                                }
                                                                onBlur={() => {
                                                                    if (item.unitPrice === '') {
                                                                        handleItemChange(idx, 'unitPrice', 0)
                                                                    }
                                                                }}
                                                                className="input-precision w-full p-1.5 text-xs text-right font-tech bg-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="flex justify-between items-center pt-1 border-t border-[var(--border-hairline)] text-xs">
                                                        <span className="font-tech font-bold text-[var(--text-main)]">
                                                            Subtotal: {formatCOP(rowSubtotal)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItemRow(idx)}
                                                            className="text-rose-600 hover:text-rose-800 text-xs font-semibold"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>

                                {/* SECCIÓN 4: CONDICIONES COMERCIALES Y LIQUIDACIÓN FINANCIERA */}
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-2">
                                    <div className="w-full sm:flex-1 space-y-3">
                                        <div className="flex items-center gap-2 border-b border-[var(--border-hairline)] pb-1.5">
                                            <span className="w-5 h-5 rounded-full bg-[var(--brand-navy)] text-white text-[11px] flex items-center justify-center font-bold">4</span>
                                            <h4 className="font-semibold text-[var(--text-main)] text-xs sm:text-sm">
                                                Condiciones de Pago y Garantía
                                            </h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                    Forma de Pago
                                                </label>
                                                <select
                                                    value={formData.paymentTerms}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, paymentTerms: e.target.value })
                                                    }
                                                    className="input-precision w-full p-2 text-xs"
                                                >
                                                    {PAYMENT_TERMS_OPTIONS.map((term) => (
                                                        <option key={term} value={term}>{term}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                    Tiempo de Ejecución
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="Ej: 1 a 2 días hábiles"
                                                    value={formData.deliveryTime}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, deliveryTime: e.target.value })
                                                    }
                                                    className="input-precision w-full p-2 text-xs"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-[var(--text-main)] mb-1">
                                                Observaciones y Garantía para el Cliente
                                            </label>
                                            <textarea
                                                rows="2"
                                                placeholder="Garantía de 12 meses. Incluye soporte de configuración..."
                                                value={formData.notes}
                                                onChange={(e) =>
                                                    setFormData({ ...formData, notes: e.target.value })
                                                }
                                                className="input-precision w-full p-2 text-xs"
                                            />
                                        </div>
                                    </div>

                                    {/* Resumen Financiero */}
                                    <div className="w-full sm:w-72 bg-[var(--bg-subtle)] border border-[var(--border-hairline)] rounded-[6px] p-4 space-y-2.5 shrink-0">
                                        <h5 className="font-bold text-xs uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--border-hairline)] pb-1.5">
                                            Liquidación Final
                                        </h5>

                                        <div className="flex justify-between text-xs text-[var(--text-muted)]">
                                            <span>Subtotal General:</span>
                                            <span className="font-tech font-semibold text-[var(--text-main)]">
                                                {formatCOP(financialSummary.subtotal)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-2 text-xs text-[var(--text-muted)]">
                                            <span>Descuento ($):</span>
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
                                                className="input-precision w-28 p-1 text-xs text-right font-tech bg-white"
                                            />
                                        </div>

                                        <div className="flex justify-between text-xs text-[var(--text-muted)]">
                                            <span>Base Gravable:</span>
                                            <span className="font-tech font-medium text-[var(--text-main)]">
                                                {formatCOP(financialSummary.taxableBase)}
                                            </span>
                                        </div>

                                        <div className="pt-2 border-t border-[var(--border-hairline)]">
                                            <label className="flex items-center justify-between cursor-pointer text-xs">
                                                <span className="font-semibold text-[var(--text-main)]">
                                                    Aplicar IVA (19%):
                                                </span>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.applyIva}
                                                    onChange={(e) =>
                                                        setFormData({ ...formData, applyIva: e.target.checked })
                                                    }
                                                    className="w-4 h-4 accent-[var(--brand-orange)]"
                                                />
                                            </label>
                                            {formData.applyIva && (
                                                <div className="flex justify-between text-xs text-[var(--text-muted)] mt-1 font-tech">
                                                    <span>IVA 19%:</span>
                                                    <span>{formatCOP(financialSummary.tax)}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2 border-t-2 border-[var(--border-hairline)] flex justify-between items-baseline">
                                            <span className="text-sm font-bold text-[var(--text-main)]">Total a Pagar:</span>
                                            <span className="text-base font-extrabold text-[var(--brand-navy)] font-tech">
                                                {formatCOP(financialSummary.total)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer con botones de acción */}
                        <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-3 px-4 sm:px-6 py-3.5 border-t border-[var(--border-hairline)] bg-[var(--bg-subtle)] rounded-b-[6px]">
                            <button
                                type="button"
                                onClick={handlePreviewFromCurrentForm}
                                className="btn-precision-outline px-3.5 py-2 text-xs inline-flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
                            >
                                <FaEye size={14} />
                                Vista Previa / PDF
                            </button>

                            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-3 py-2 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    form="quotationForm"
                                    className="btn-precision-orange px-5 py-2 text-xs font-bold uppercase tracking-wider cursor-pointer shadow-xs w-full sm:w-auto"
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
                    <div className="card-precision bg-white w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none">
                        {/* Barra superior no imprimible */}
                        <div className="flex justify-between items-center px-4 sm:px-6 py-3 border-b border-[var(--border-hairline)] bg-[var(--bg-subtle)] print:hidden">
                            <span className="text-xs font-semibold text-[var(--brand-navy)]">
                                Propuesta Formal para Cliente
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleSendEmail(previewQuotation)}
                                    disabled={sendingEmailId === previewQuotation._id}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-[4px] bg-[var(--brand-navy)] text-white flex items-center gap-1.5 cursor-pointer shadow-2xs hover:bg-[#032b3f] disabled:opacity-50"
                                    title="Enviar PDF por Correo"
                                >
                                    <FaEnvelope size={13} />
                                    Enviar Correo
                                </button>
                                <button
                                    onClick={() => handleSendWhatsApp(previewQuotation)}
                                    className="px-3 py-1.5 text-xs font-semibold rounded-[4px] bg-emerald-600 text-white flex items-center gap-1.5 cursor-pointer shadow-2xs hover:bg-emerald-700"
                                    title="Enviar WhatsApp"
                                >
                                    <FaWhatsapp size={14} />
                                    Aviso WhatsApp
                                </button>
                                <button
                                    onClick={() => window.print()}
                                    className="btn-precision-navy px-3 py-1.5 text-xs inline-flex items-center gap-1.5 cursor-pointer"
                                >
                                    Imprimir / PDF
                                </button>
                                <button
                                    onClick={() => setPreviewQuotation(null)}
                                    className="px-2 py-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>

                        {/* Hoja de la Propuesta Formal */}
                        <div className="p-6 sm:p-10 overflow-y-auto space-y-6 text-gray-800 bg-white print:p-0">
                            {/* Membrete y Cabecera */}
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b-2 border-gray-900 pb-5">
                                <div>
                                    <CotiSaasLogo showTagline={true} />
                                    <p className="text-xs text-gray-500 font-medium mt-1">
                                        Servicios Técnicos e Instalaciones Profesionales
                                    </p>
                                    <div className="text-xs text-gray-600 mt-2 space-y-0.5">
                                        <p>Cotizador asignado: <strong className="text-gray-900">{previewQuotation.quoterName || userInfo?.username || 'Cotizador'}</strong></p>
                                    </div>
                                </div>
                                <div className="sm:text-right">
                                    <span className="inline-block bg-[var(--brand-navy)] text-white font-tech text-xs px-2.5 py-1 rounded-[3px] font-bold">
                                        {previewQuotation.quoteNumber || 'COT-2026-###'}
                                    </span>
                                    <div className="text-xs text-gray-600 mt-2 space-y-0.5">
                                        <p>Emisión: <span className="font-medium">{previewQuotation.issueDate ? new Date(previewQuotation.issueDate).toLocaleDateString('es-CO') : 'Hoy'}</span></p>
                                        <p>Válida Hasta: <strong className="text-gray-900">{previewQuotation.validUntil ? new Date(previewQuotation.validUntil).toLocaleDateString('es-CO') : '15 días'}</strong></p>
                                    </div>
                                </div>
                            </div>

                            {/* Datos de la Persona / Cliente Final */}
                            <div className="bg-[var(--bg-subtle)] rounded-[6px] p-4 border border-[var(--border-hairline)]">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] block mb-2">
                                    Presupuesto Presentado a:
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <p className="text-gray-500">Cliente / Persona:</p>
                                        <p className="font-bold text-gray-900 text-sm">{previewQuotation.clientName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Identificación:</p>
                                        <p className="font-semibold text-gray-800 font-tech">
                                            {previewQuotation.clientDocumentType || 'CC'}: {previewQuotation.clientDocument || 'No registrada'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Teléfono / WhatsApp:</p>
                                        <p className="font-medium text-gray-800 font-tech">{previewQuotation.clientPhone || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Correo Electrónico:</p>
                                        <p className="font-medium text-gray-800">{previewQuotation.clientEmail || 'N/A'}</p>
                                    </div>
                                </div>
                                {previewQuotation.description && (
                                    <div className="mt-3 pt-2 border-t border-[var(--border-hairline)] text-xs">
                                        <span className="font-semibold text-gray-700">Trabajo a realizar: </span>
                                        <span className="text-gray-600">{previewQuotation.description}</span>
                                    </div>
                                )}
                            </div>

                            {/* Tabla de Conceptos */}
                            <div className="overflow-x-auto">
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
                                                <td className="p-2.5 text-center font-medium font-tech">{item.quantity}</td>
                                                <td className="p-2.5 text-right text-gray-700 font-tech">{formatCOP(item.unitPrice)}</td>
                                                <td className="p-2.5 text-right font-bold text-gray-900 font-tech">
                                                    {formatCOP((item.quantity || 1) * (item.unitPrice || 0))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Resumen Financiero */}
                            <div className="flex justify-end">
                                <div className="w-full sm:w-72 space-y-1.5 text-xs text-gray-700 border border-gray-200 rounded-[6px] p-3 bg-gray-50 font-tech">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-medium text-gray-900">{formatCOP(previewQuotation.subtotal || 0)}</span>
                                    </div>
                                    {Number(previewQuotation.discount) > 0 && (
                                        <div className="flex justify-between text-emerald-700">
                                            <span>Descuento:</span>
                                            <span>-{formatCOP(previewQuotation.discount)}</span>
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
                                        <span className="text-base font-extrabold text-[var(--brand-navy)]">{formatCOP(previewQuotation.total || 0)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Condiciones y Garantía */}
                            <div className="border-t border-gray-200 pt-4 space-y-3 text-xs text-gray-600">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="font-semibold text-gray-800">Forma de Pago:</p>
                                        <p>{previewQuotation.paymentTerms || 'Contado / Pago contra entrega'}</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">Tiempo de Ejecución:</p>
                                        <p>{previewQuotation.deliveryTime || '1 a 3 días hábiles'}</p>
                                    </div>
                                </div>
                                {previewQuotation.notes && (
                                    <div>
                                        <p className="font-semibold text-gray-800">Observaciones y Garantías:</p>
                                        <p className="whitespace-pre-line text-gray-700">{previewQuotation.notes}</p>
                                    </div>
                                )}
                            </div>

                            {/* Firmas de conformidad */}
                            <div className="pt-8 border-t border-dashed border-gray-300 grid grid-cols-2 gap-8 text-center text-xs">
                                <div>
                                    <div className="border-b border-gray-400 pb-8 mb-2"></div>
                                    <p className="font-bold text-gray-900">{previewQuotation.quoterName || userInfo?.username || 'Cotizador'}</p>
                                    <p className="text-gray-500">Asesor Técnico</p>
                                </div>
                                <div>
                                    <div className="border-b border-gray-400 pb-8 mb-2"></div>
                                    <p className="font-bold text-gray-900">{previewQuotation.clientName}</p>
                                    <p className="text-gray-500">Cliente / Aceptado a Conformidad</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuotationsDashboard
