import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
	useAddAplicationsStepsBajarildiMutation,
	useAddAplicationsStepsMutation,
	useMEQuery,
} from '@/services/api'
import {
	CheckCheck,
	ChevronLeft,
	ChevronRight,
	Download,
	Eye,
	EyeOff,
	FileText,
	Image as ImageIcon,
	Lock,
	Plus,
	Send,
	Upload,
	X,
	ZoomIn,
	ZoomOut,
} from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

/* ─── Media / File Viewer Modal ─── */
function MediaModal({ items, startIndex, onClose }) {
	const [current, setCurrent] = useState(startIndex)
	const [zoom, setZoom] = useState(1)
	const item = items[current]
	const isImage = item?.type === 'image'

	useEffect(() => {
		setZoom(1)
	}, [current])

	useEffect(() => {
		const onKey = e => {
			if (e.key === 'Escape') onClose()
			if (e.key === 'ArrowRight')
				setCurrent(c => Math.min(c + 1, items.length - 1))
			if (e.key === 'ArrowLeft') setCurrent(c => Math.max(c - 1, 0))
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [items.length, onClose])

	const handleDownload = () => {
		const a = document.createElement('a')
		a.href = item.url
		a.download = item.name || 'file'
		a.target = '_blank'
		document.body.appendChild(a)
		a.click()
		document.body.removeChild(a)
	}

	return (
		<div
			className='fixed inset-0 z-[100] flex flex-col backdrop-blur-xl'
			style={{ background: 'oklch(0.141 0.005 285.823 / 0.96)' }}
		>
			{/* Top bar */}
			<div
				className='flex items-center justify-between px-5 py-4 shrink-0'
				style={{ borderBottom: '1px solid oklch(1 0 0 / 8%)' }}
			>
				<span
					className='text-sm font-medium truncate max-w-[60%] font-mono'
					style={{ color: 'var(--muted-foreground)' }}
				>
					{item?.name || (isImage ? 'Rasm' : 'Fayl')}
				</span>
				<div className='flex items-center gap-1'>
					{isImage && (
						<>
							<button
								onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
								className='w-9 h-9 rounded-full flex items-center justify-center transition-all'
								style={{ color: 'var(--muted-foreground)' }}
								onMouseEnter={e => {
									e.currentTarget.style.color = 'oklch(0.985 0 0)'
									e.currentTarget.style.background = 'oklch(1 0 0 / 8%)'
								}}
								onMouseLeave={e => {
									e.currentTarget.style.color = 'var(--muted-foreground)'
									e.currentTarget.style.background = 'transparent'
								}}
							>
								<ZoomOut size={16} />
							</button>
							<span
								className='text-xs w-12 text-center font-mono'
								style={{ color: 'var(--muted-foreground)' }}
							>
								{Math.round(zoom * 100)}%
							</span>
							<button
								onClick={() => setZoom(z => Math.min(3, z + 0.25))}
								className='w-9 h-9 rounded-full flex items-center justify-center transition-all'
								style={{ color: 'var(--muted-foreground)' }}
								onMouseEnter={e => {
									e.currentTarget.style.color = 'oklch(0.985 0 0)'
									e.currentTarget.style.background = 'oklch(1 0 0 / 8%)'
								}}
								onMouseLeave={e => {
									e.currentTarget.style.color = 'var(--muted-foreground)'
									e.currentTarget.style.background = 'transparent'
								}}
							>
								<ZoomIn size={16} />
							</button>
						</>
					)}
					<button
						onClick={handleDownload}
						className='w-9 h-9 rounded-full flex items-center justify-center transition-all'
						style={{ color: 'var(--muted-foreground)' }}
						onMouseEnter={e => {
							e.currentTarget.style.color = 'oklch(0.985 0 0)'
							e.currentTarget.style.background = 'oklch(1 0 0 / 8%)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.color = 'var(--muted-foreground)'
							e.currentTarget.style.background = 'transparent'
						}}
					>
						<Download size={16} />
					</button>
					<button
						onClick={onClose}
						className='w-9 h-9 rounded-full flex items-center justify-center transition-all ml-1'
						style={{ color: 'var(--muted-foreground)' }}
						onMouseEnter={e => {
							e.currentTarget.style.color = 'oklch(0.985 0 0)'
							e.currentTarget.style.background = 'oklch(1 0 0 / 8%)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.color = 'var(--muted-foreground)'
							e.currentTarget.style.background = 'transparent'
						}}
					>
						<X size={18} />
					</button>
				</div>
			</div>

			{/* Content */}
			<div className='flex-1 flex items-center justify-center overflow-hidden px-4 py-6'>
				{isImage ? (
					<img
						src={item.url}
						alt=''
						className='rounded-2xl object-contain max-w-full max-h-full shadow-2xl'
						style={{
							transform: `scale(${zoom})`,
							transition: 'transform 0.2s ease',
						}}
					/>
				) : (
					<div
						className='flex flex-col items-center gap-5 p-10 rounded-3xl'
						style={{
							background: 'oklch(1 0 0 / 4%)',
							border: '1px solid oklch(1 0 0 / 8%)',
						}}
					>
						<div
							className='w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg'
							style={{
								background:
									'linear-gradient(135deg, var(--primary), oklch(0.424 0.199 265.638))',
							}}
						>
							<FileText
								size={44}
								style={{ color: 'var(--primary-foreground)' }}
							/>
						</div>
						<p
							className='text-base font-semibold text-center max-w-xs break-all'
							style={{ color: 'oklch(0.985 0 0)' }}
						>
							{item?.name || 'Fayl'}
						</p>
						<button
							onClick={handleDownload}
							className='flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-semibold transition-opacity hover:opacity-90'
							style={{
								background:
									'linear-gradient(135deg, var(--primary), oklch(0.424 0.199 265.638))',
								color: 'var(--primary-foreground)',
							}}
						>
							<Download size={16} /> Yuklab olish
						</button>
					</div>
				)}
			</div>

			{/* Navigation */}
			{items.length > 1 && (
				<div className='flex items-center justify-center gap-4 pb-6 shrink-0'>
					<button
						disabled={current === 0}
						onClick={() => setCurrent(c => c - 1)}
						className='w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-20'
						style={{ color: 'var(--muted-foreground)' }}
					>
						<ChevronLeft size={22} />
					</button>
					<div className='flex gap-2 items-center'>
						{items.map((_, i) => (
							<button
								key={i}
								onClick={() => setCurrent(i)}
								className='rounded-full transition-all duration-200'
								style={{
									width: i === current ? 20 : 6,
									height: 6,
									background:
										i === current ? 'var(--primary)' : 'oklch(1 0 0 / 20%)',
								}}
							/>
						))}
					</div>
					<button
						disabled={current === items.length - 1}
						onClick={() => setCurrent(c => c + 1)}
						className='w-10 h-10 rounded-full flex items-center justify-center transition-all disabled:opacity-20'
						style={{ color: 'var(--muted-foreground)' }}
					>
						<ChevronRight size={22} />
					</button>
				</div>
			)}
		</div>
	)
}

/* ─── Password Modal ─── */
function PasswordModal({ visible, onClose, onConfirm, value, onChange }) {
	const [show, setShow] = useState(false)
	if (!visible) return null

	return (
		<div
			className='fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-md'
			style={{ background: 'oklch(0 0 0 / 50%)' }}
			onClick={e => e.target === e.currentTarget && onClose()}
		>
			<div
				className='w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl'
				style={{
					background: 'var(--card)',
					border: '1px solid var(--border)',
				}}
			>
				<div className='flex items-center gap-3 mb-5'>
					<div
						className='w-10 h-10 rounded-2xl flex items-center justify-center'
						style={{
							background:
								'color-mix(in oklch, var(--primary) 12%, transparent)',
						}}
					>
						<Lock size={18} style={{ color: 'var(--primary)' }} />
					</div>
					<div>
						<h2
							className='font-semibold text-base'
							style={{ color: 'var(--card-foreground)' }}
						>
							Tasdiqlash
						</h2>
						<p className='text-xs' style={{ color: 'var(--muted-foreground)' }}>
							Parolingizni kiriting
						</p>
					</div>
					<button
						onClick={onClose}
						className='ml-auto transition'
						style={{ color: 'var(--muted-foreground)' }}
						onMouseEnter={e =>
							(e.currentTarget.style.color = 'var(--foreground)')
						}
						onMouseLeave={e =>
							(e.currentTarget.style.color = 'var(--muted-foreground)')
						}
					>
						<X size={18} />
					</button>
				</div>

				<div className='relative mb-4'>
					<input
						type={show ? 'text' : 'password'}
						placeholder='••••••••'
						value={value}
						onChange={onChange}
						autoFocus
						onKeyDown={e => e.key === 'Enter' && value && onConfirm()}
						className='w-full px-4 py-3 rounded-2xl text-sm outline-none transition pr-12'
						style={{
							background: 'var(--muted)',
							border: '1px solid var(--border)',
							color: 'var(--foreground)',
						}}
						onFocus={e => {
							e.currentTarget.style.borderColor = 'var(--primary)'
							e.currentTarget.style.background = 'var(--background)'
						}}
						onBlur={e => {
							e.currentTarget.style.borderColor = 'var(--border)'
							e.currentTarget.style.background = 'var(--muted)'
						}}
					/>
					<button
						type='button'
						onClick={() => setShow(s => !s)}
						className='absolute right-3 top-1/2 -translate-y-1/2 transition'
						style={{ color: 'var(--muted-foreground)' }}
						onMouseEnter={e =>
							(e.currentTarget.style.color = 'var(--foreground)')
						}
						onMouseLeave={e =>
							(e.currentTarget.style.color = 'var(--muted-foreground)')
						}
					>
						{show ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				</div>

				<div className='flex gap-3'>
					<button
						onClick={onClose}
						className='flex-1 py-3 rounded-2xl text-sm font-medium transition-all'
						style={{
							background: 'var(--secondary)',
							color: 'var(--secondary-foreground)',
							border: '1px solid var(--border)',
						}}
						onMouseEnter={e => (e.currentTarget.style.opacity = '0.75')}
						onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
					>
						Bekor qilish
					</button>
					<button
						disabled={!value}
						onClick={onConfirm}
						className='flex-1 py-3 rounded-2xl text-sm font-semibold transition-all'
						style={{
							background:
								'linear-gradient(135deg, var(--primary), oklch(0.424 0.199 265.638))',
							color: 'var(--primary-foreground)',
							opacity: !value ? 0.4 : 1,
						}}
					>
						Tasdiqlash
					</button>
				</div>
			</div>
		</div>
	)
}

/* ─── Chat Bubble ─── */
function ChatBubble({ step, isMe, onMediaClick }) {
	const d = new Date(step.sana)
	const months = [
		'Yan',
		'Fev',
		'Mar',
		'Apr',
		'May',
		'Iyn',
		'Iyl',
		'Avg',
		'Sen',
		'Okt',
		'Noy',
		'Dek',
	]
	const time = d.toLocaleTimeString('uz-UZ', {
		hour: '2-digit',
		minute: '2-digit',
	})
	const dateStr = `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`

	const allMedia = [
		...(step.rasmlar || []).map(url => ({ url, type: 'image', name: 'Rasm' })),
		...['bildirgi', 'ilovalar', 'akt_file']
			.map(k => step[k])
			.filter(Boolean)
			.map(url => ({ url, type: 'file', name: 'Fayl.pdf' })),
	]

	return (
		<div
			className={`flex w-full mb-1 ${isMe ? 'justify-end' : 'justify-start'}`}
		>
			<div
				className='relative max-w-[78%] min-w-[80px] px-3.5 pt-2.5 pb-1.5 shadow-sm'
				style={{
					background: isMe
						? 'color-mix(in oklch, var(--primary) 85%, oklch(0.141 0.005 285.823))'
						: 'var(--card)',
					border: isMe
						? '1px solid color-mix(in oklch, var(--primary) 50%, transparent)'
						: '1px solid var(--border)',
					borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
				}}
			>
				{/* Sender */}
				{!isMe && (
					<p
						className='text-xs font-bold mb-1 font-mono'
						style={{ color: 'var(--primary)' }}
					>
						{step.created_by}
					</p>
				)}

				{/* Text */}
				{step.comment && (
					<p
						className='text-sm leading-relaxed break-words'
						style={{
							color: isMe
								? 'var(--primary-foreground)'
								: 'var(--card-foreground)',
						}}
					>
						{step.comment}
					</p>
				)}

				{/* Images */}
				{!!step.rasmlar?.length && (
					<div
						className={`mt-2 gap-1 ${step.rasmlar.length > 1 ? 'grid grid-cols-2' : 'block'}`}
					>
						{step.rasmlar.map((url, idx) => (
							<div
								key={idx}
								className='relative rounded-xl overflow-hidden cursor-pointer group'
								style={{
									height: step.rasmlar.length === 1 ? 200 : 130,
									background: 'var(--muted)',
								}}
								onClick={() => onMediaClick(allMedia, idx)}
							>
								<img
									src={url}
									alt=''
									className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
								/>
								<div className='absolute inset-0 bg-black/0 group-hover:bg-black/25 transition flex items-center justify-center'>
									<ZoomIn
										size={22}
										className='text-white opacity-0 group-hover:opacity-100 transition drop-shadow-lg'
									/>
								</div>
							</div>
						))}
					</div>
				)}

				{/* File attachments */}
				{['bildirgi', 'ilovalar', 'akt_file']
					.map(k => step[k])
					.filter(Boolean)
					.map((url, i) => {
						const mediaIdx = (step.rasmlar?.length || 0) + i
						return (
							<div
								key={i}
								className='mt-2 flex items-center gap-3 rounded-2xl cursor-pointer transition-all'
								style={{
									padding: '10px 12px',
									background: isMe ? 'oklch(1 0 0 / 12%)' : 'var(--muted)',
								}}
								onMouseEnter={e =>
									(e.currentTarget.style.background = isMe
										? 'oklch(1 0 0 / 20%)'
										: 'var(--secondary)')
								}
								onMouseLeave={e =>
									(e.currentTarget.style.background = isMe
										? 'oklch(1 0 0 / 12%)'
										: 'var(--muted)')
								}
								onClick={() => onMediaClick(allMedia, mediaIdx)}
							>
								<div
									className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-md transition-transform group-hover:scale-105'
									style={{
										background:
											'linear-gradient(135deg, var(--primary), oklch(0.424 0.199 265.638))',
										color: 'var(--primary-foreground)',
									}}
								>
									<FileText size={16} />
								</div>
								<div className='flex-1 min-w-0'>
									<p
										className='text-xs font-semibold truncate'
										style={{
											color: isMe
												? 'oklch(0.985 0 0 / 90%)'
												: 'var(--foreground)',
										}}
									>
										PDF hujjat
									</p>
									<p
										className='text-[11px]'
										style={{
											color: isMe
												? 'oklch(0.985 0 0 / 50%)'
												: 'var(--muted-foreground)',
										}}
									>
										Ko'rish uchun bosing
									</p>
								</div>
								<Download
									size={14}
									className='shrink-0'
									style={{
										color: isMe
											? 'oklch(0.985 0 0 / 30%)'
											: 'var(--muted-foreground)',
									}}
								/>
							</div>
						)
					})}

				{/* Timestamp */}
				<div className='flex items-center justify-end gap-1 mt-1.5'>
					<span
						className='text-[10px] font-mono'
						style={{
							color: isMe
								? 'oklch(0.985 0 0 / 40%)'
								: 'var(--muted-foreground)',
						}}
					>
						{time} · {dateStr}
					</span>
					{isMe && <CheckCheck size={12} style={{ color: 'var(--chart-2)' }} />}
				</div>
			</div>
		</div>
	)
}

/* ─── Main Component ─── */
export default function AplicationWorkChat({ data }) {
	const { data: me } = useMEQuery()
	const [form, setForm] = useState({
		comment: '',
		parol: '',
		photos: [],
		bildirgi: null,
		status: '',
	})

	const [showModal, setShowModal] = useState(false)
	const [mediaViewer, setMediaViewer] = useState(null)
	const bottomRef = useRef(null)
	const textareaRef = useRef(null)

	const [AddAplicationsSteps] = useAddAplicationsStepsMutation()
	const [addAplicationBajarildi] = useAddAplicationsStepsBajarildiMutation()

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [data?.steplar])

	const isFormComplete = () =>
		form.comment.trim() !== '' || form.photos.length > 0 || form.bildirgi

	const canSend =
		isFormComplete() &&
		['jarayonda', 'qaytarildi', 'tasdiqlanmoqda'].includes(data?.status)

	const handlePhotoUpload = e => {
		const files = Array.from(e.target.files)
		setForm(prev => ({ ...prev, photos: [...prev.photos, ...files] }))
	}

	const handleBildirgiUpload = e => {
		const file = e.target.files[0]
		if (file) setForm(prev => ({ ...prev, bildirgi: file }))
	}

	const removePhoto = index =>
		setForm(prev => ({
			...prev,
			photos: prev.photos.filter((_, i) => i !== index),
		}))

	const removeBildirgi = () => setForm(prev => ({ ...prev, bildirgi: null }))

	const resetForm = () =>
		setForm({ comment: '', parol: '', photos: [], bildirgi: null, status: '' })

	const submitForm = async () => {
		const fd = new FormData()
		if (data?.status === 'tasdiqlanmoqda') fd.append('holat', form.status)
		fd.append('comment', form.comment)
		fd.append('parol', form.parol)
		fd.append('qayta_yuklandi', true)
		data?.tuzilmalar.forEach(id => fd.append('tuzilmalar', id))
		form.photos.forEach(p => fd.append('photos', p))
		if (form.bildirgi) fd.append('bildirgi', form.bildirgi)

		await toast.promise(
			AddAplicationsSteps({ body: fd, id: data?.id }).unwrap(),
			{ loading: 'Yuborilmoqda...', success: 'Yuborildi!', error: 'Xatolik!' },
		)
		resetForm()
		setShowModal(false)
	}

	const submitForm2 = async () => {
		const fd = new FormData()
		if (data?.status === 'tasdiqlanmoqda') fd.append('holat', form.status)
		fd.append('comment', form.comment)
		fd.append('parol', form.parol)
		fd.append('ariza', data?.id)
		form.photos.forEach(p => fd.append('photos', p))
		if (form.bildirgi) fd.append('akt_file', form.bildirgi)

		await toast.promise(addAplicationBajarildi({ body: fd }).unwrap(), {
			loading: 'Yuborilmoqda...',
			success: 'Yuborildi!',
			error: 'Xatolik!',
		})
		resetForm()
		setShowModal(false)
	}

	const handleTextareaKey = e => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			if (canSend) setShowModal(true)
		}
	}

	const openMediaViewer = useCallback((items, index) => {
		setMediaViewer({ items, index })
	}, [])

	const statusBadge = {
		jarayonda: {
			label: 'Jarayonda',
			color: 'var(--chart-1)',
			dot: 'var(--chart-1)',
		},
		qaytarildi: {
			label: 'Qaytarildi',
			color: 'var(--destructive)',
			dot: 'var(--destructive)',
		},
		tasdiqlanmoqda: {
			label: 'Tasdiqlanmoqda',
			color: 'var(--primary)',
			dot: 'var(--primary)',
		},
		bajarilgan: {
			label: 'Bajarilgan',
			color: 'var(--chart-2)',
			dot: 'var(--chart-2)',
		},
		rad_etildi: {
			label: 'Rad etildi',
			color: 'var(--destructive)',
			dot: 'var(--destructive)',
		},
	}
	const badge = statusBadge[data?.status]

	return (
		<>
			<div
				className='flex flex-col h-full rounded-2xl shadow-lg overflow-hidden'
				style={{ background: 'var(--background)' }}
			>
				{/* ── Header ── */}
				<div
					className='px-4 py-3 flex items-center gap-3 shrink-0'
					style={{
						background: 'var(--card)',
						borderBottom: '1px solid var(--border)',
					}}
				>
					<div
						className='w-9 h-9 rounded-full flex items-center justify-center shrink-0 font-bold text-sm shadow-md'
						style={{
							background:
								'linear-gradient(135deg, var(--primary), oklch(0.424 0.199 265.638))',
							color: 'var(--primary-foreground)',
						}}
					>
						{data?.id ? String(data.id).slice(-2) : '?'}
					</div>
					<div className='flex-1 min-w-0'>
						<p
							className='text-sm font-semibold truncate'
							style={{ color: 'var(--foreground)' }}
						>
							Ariza #{data?.id}
						</p>
						{badge && (
							<div className='flex items-center gap-1.5 mt-0.5'>
								<span
									className='w-1.5 h-1.5 rounded-full'
									style={{ background: badge.dot }}
								/>
								<span
									className='text-xs font-medium'
									style={{ color: badge.color }}
								>
									{badge.label}
								</span>
							</div>
						)}
					</div>
				</div>

				{/* ── Messages ── */}
				<div className='flex-1 overflow-y-auto px-4 py-4 space-y-0.5'>
					{!data?.steplar?.length && (
						<div className='flex flex-col items-center justify-center h-40 gap-3'>
							<div
								className='w-14 h-14 rounded-full flex items-center justify-center'
								style={{
									background:
										'color-mix(in oklch, var(--primary) 10%, transparent)',
								}}
							>
								<ImageIcon
									size={24}
									style={{
										color:
											'color-mix(in oklch, var(--primary) 50%, transparent)',
									}}
								/>
							</div>
							<p
								className='text-sm'
								style={{ color: 'var(--muted-foreground)' }}
							>
								Hozircha xabarlar yo'q
							</p>
						</div>
					)}
					{data?.steplar?.map(step => (
						<ChatBubble
							key={step.id}
							step={step}
							isMe={step.created_by === me?.username}
							onMediaClick={openMediaViewer}
						/>
					))}
					<div ref={bottomRef} />
				</div>

				{/* ── Input Area ── */}
				<div
					className='shrink-0 px-3 py-3'
					style={{
						background: 'var(--card)',
						borderTop: '1px solid var(--border)',
					}}
				>
					{/* Status radio — faqat tasdiqlanmoqda holatida */}
					{data?.status === 'tasdiqlanmoqda' && (
						<div
							className='flex items-center gap-4 mb-3 px-1 py-2 rounded-2xl'
							style={{ background: 'var(--muted)' }}
						>
							<RadioGroup
								value={form.status}
								onValueChange={val => setForm({ ...form, status: val })}
								className='flex items-center gap-5 px-2'
							>
								<div className='flex items-center gap-2'>
									<RadioGroupItem
										value='bajarilgan'
										id='opt-done'
										style={{
											borderColor: 'var(--chart-2)',
											color: 'var(--chart-2)',
										}}
									/>
									<Label
										htmlFor='opt-done'
										className='text-sm cursor-pointer transition'
										style={{ color: 'var(--muted-foreground)' }}
									>
										✓ Bajarildi
									</Label>
								</div>
								<div className='flex items-center gap-2'>
									<RadioGroupItem
										value='rad_etildi'
										id='opt-reject'
										style={{
											borderColor: 'var(--destructive)',
											color: 'var(--destructive)',
										}}
									/>
									<Label
										htmlFor='opt-reject'
										className='text-sm cursor-pointer transition'
										style={{ color: 'var(--muted-foreground)' }}
									>
										✕ Rad etildi
									</Label>
								</div>
							</RadioGroup>
						</div>
					)}

					{/* Photo previews */}
					{form.photos.length > 0 && (
						<div className='flex gap-2 overflow-x-auto pb-2 mb-2'>
							{form.photos.map((p, i) => (
								<div
									key={i}
									className='relative shrink-0 rounded-xl overflow-hidden'
									style={{
										width: 60,
										height: 60,
										border:
											'2px solid color-mix(in oklch, var(--primary) 40%, transparent)',
									}}
								>
									<img
										src={URL.createObjectURL(p)}
										alt=''
										className='w-full h-full object-cover'
									/>
									<button
										onClick={() => removePhoto(i)}
										className='absolute top-0 right-0 w-5 h-5 flex items-center justify-center text-white bg-black/60'
										style={{ borderRadius: '0 0 0 8px' }}
									>
										<X size={10} />
									</button>
								</div>
							))}
						</div>
					)}

					{/* File preview */}
					{form.bildirgi && (
						<div
							className='flex items-center gap-2 px-3 py-2 rounded-xl mb-2 text-sm'
							style={{
								background:
									'color-mix(in oklch, var(--primary) 8%, transparent)',
								border:
									'1px solid color-mix(in oklch, var(--primary) 25%, transparent)',
							}}
						>
							<FileText
								size={14}
								className='shrink-0'
								style={{ color: 'var(--primary)' }}
							/>
							<span
								className='truncate flex-1'
								style={{ color: 'var(--foreground)' }}
							>
								{form.bildirgi.name}
							</span>
							<button
								onClick={removeBildirgi}
								className='transition'
								style={{ color: 'var(--muted-foreground)' }}
								onMouseEnter={e =>
									(e.currentTarget.style.color = 'var(--destructive)')
								}
								onMouseLeave={e =>
									(e.currentTarget.style.color = 'var(--muted-foreground)')
								}
							>
								<X size={14} />
							</button>
						</div>
					)}

					{/* Input row */}
					<div
						className='flex items-end gap-2 rounded-3xl px-3 py-2'
						style={{
							background: 'var(--muted)',
							border: '1px solid var(--border)',
						}}
					>
						{/* Photo upload */}
						<label
							className='shrink-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all'
							style={{ color: 'var(--muted-foreground)' }}
							onMouseEnter={e => {
								e.currentTarget.style.color = 'var(--foreground)'
								e.currentTarget.style.background = 'var(--secondary)'
							}}
							onMouseLeave={e => {
								e.currentTarget.style.color = 'var(--muted-foreground)'
								e.currentTarget.style.background = 'transparent'
							}}
						>
							<Plus size={18} />
							<input
								type='file'
								accept='image/*'
								multiple
								className='hidden'
								onChange={handlePhotoUpload}
							/>
						</label>

						{/* File upload */}
						<label
							className='shrink-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-all'
							style={{ color: 'var(--muted-foreground)' }}
							onMouseEnter={e => {
								e.currentTarget.style.color = 'var(--foreground)'
								e.currentTarget.style.background = 'var(--secondary)'
							}}
							onMouseLeave={e => {
								e.currentTarget.style.color = 'var(--muted-foreground)'
								e.currentTarget.style.background = 'transparent'
							}}
						>
							<Upload size={16} />
							<input
								type='file'
								className='hidden'
								onChange={handleBildirgiUpload}
							/>
						</label>

						{/* Textarea */}
						<textarea
							ref={textareaRef}
							placeholder='Xabar yozing...'
							value={form.comment}
							onChange={e => setForm({ ...form, comment: e.target.value })}
							onKeyDown={handleTextareaKey}
							className='flex-1 bg-transparent resize-none outline-none text-sm py-1.5 leading-relaxed'
							style={{
								maxHeight: 120,
								minHeight: 36,
								color: 'var(--foreground)',
								caretColor: 'var(--primary)',
							}}
							rows={1}
							onInput={e => {
								e.target.style.height = 'auto'
								e.target.style.height =
									Math.min(e.target.scrollHeight, 120) + 'px'
							}}
						/>

						{/* Send button */}
						<button
							disabled={!canSend}
							onClick={() => setShowModal(true)}
							className='shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200'
							style={{
								background: canSend
									? 'linear-gradient(135deg, var(--primary), oklch(0.424 0.199 265.638))'
									: 'var(--secondary)',
								opacity: canSend ? 1 : 0.4,
								transform: canSend ? 'scale(1)' : 'scale(0.95)',
							}}
						>
							<Send
								size={15}
								style={{ color: 'var(--primary-foreground)', marginLeft: 1 }}
							/>
						</button>
					</div>
				</div>
			</div>

			{/* Password Modal */}
			<PasswordModal
				visible={showModal}
				onClose={() => setShowModal(false)}
				onConfirm={data?.status === 'tasdiqlanmoqda' ? submitForm2 : submitForm}
				value={form.parol}
				onChange={e => setForm({ ...form, parol: e.target.value })}
			/>

			{/* Media Viewer */}
			{mediaViewer && (
				<MediaModal
					items={mediaViewer.items}
					startIndex={mediaViewer.index}
					onClose={() => setMediaViewer(null)}
				/>
			)}
		</>
	)
}
