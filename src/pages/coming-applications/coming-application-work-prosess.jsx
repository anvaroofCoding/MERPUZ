import SegmentedButtonGroup from '@/components/ruixen/segmented-button-group'
import { Label } from '@/components/ui/label'
import { useChangeComingAplicationMutation, useMEQuery } from '@/services/api'
import {
	Check,
	CheckCheck,
	ChevronLeft,
	ChevronRight,
	Download,
	FileText,
	Image as ImageIcon,
	Loader,
	Paperclip,
	Send,
	X,
	ZoomIn,
	ZoomOut,
} from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
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

	const handleDownload = async () => {
		try {
			const res = await fetch(item.url)
			const blob = await res.blob()
			const blobUrl = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = blobUrl
			a.download = item.name || 'file'
			document.body.appendChild(a)
			a.click()
			a.remove()
			URL.revokeObjectURL(blobUrl)
		} catch {
			window.open(item.url, '_blank')
		}
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
									e.currentTarget.style.color = 'var(--foreground)'
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
									e.currentTarget.style.color = 'var(--foreground)'
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
							e.currentTarget.style.color = 'var(--foreground)'
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
							e.currentTarget.style.color = 'var(--foreground)'
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

			{/* Navigation dots */}
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

/* ─── Upload Sheet Modal ─── */
function UploadSheetModal({
	open,
	onClose,
	form,
	setForm,
	onSubmit,
	isLoading,
	isDone,
}) {
	if (!open) return null

	const FileField = ({ fieldKey, label, icon: Icon }) => (
		<div className='flex flex-col gap-2'>
			<Label
				className='text-sm font-medium'
				style={{ color: 'var(--muted-foreground)' }}
			>
				{label}
			</Label>
			<label
				className='flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all border-2 border-dashed'
				style={{
					borderColor: form[fieldKey] ? 'var(--primary)' : 'var(--border)',
					background: form[fieldKey]
						? 'color-mix(in oklch, var(--primary) 8%, transparent)'
						: 'var(--muted)',
				}}
			>
				<div
					className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all'
					style={{
						background: form[fieldKey] ? 'var(--primary)' : 'var(--secondary)',
						color: form[fieldKey]
							? 'var(--primary-foreground)'
							: 'var(--muted-foreground)',
					}}
				>
					<Icon size={16} />
				</div>
				<div className='flex-1 min-w-0'>
					{form[fieldKey] ? (
						<>
							<p
								className='text-xs font-semibold truncate'
								style={{ color: 'var(--primary)' }}
							>
								{form[fieldKey].name}
							</p>
							<p
								className='text-[11px]'
								style={{
									color: 'color-mix(in oklch, var(--primary) 60%, transparent)',
								}}
							>
								Fayl tanlandi ✓
							</p>
						</>
					) : (
						<>
							<p
								className='text-xs font-medium'
								style={{ color: 'var(--foreground)' }}
							>
								Fayl tanlang
							</p>
							<p
								className='text-[11px]'
								style={{ color: 'var(--muted-foreground)' }}
							>
								Bosing yoki sudrang
							</p>
						</>
					)}
				</div>
				{form[fieldKey] && (
					<button
						type='button'
						onClick={e => {
							e.preventDefault()
							setForm(p => ({ ...p, [fieldKey]: null }))
						}}
						className='transition shrink-0'
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
				)}
				<input
					type='file'
					multiple={fieldKey === 'ilovalar'}
					className='hidden'
					onChange={e =>
						setForm(p => ({ ...p, [fieldKey]: e.target.files[0] || null }))
					}
				/>
			</label>
		</div>
	)

	return (
		<div
			className='fixed inset-0 z-50 flex items-end sm:items-center justify-center backdrop-blur-md'
			style={{ background: 'oklch(0 0 0 / 50%)' }}
			onClick={e => e.target === e.currentTarget && onClose()}
		>
			<div
				className='w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl overflow-hidden shadow-2xl'
				style={{
					background: 'var(--card)',
					border: '1px solid var(--border)',
				}}
			>
				{/* Header */}
				<div
					className='flex items-center justify-between px-6 pt-6 pb-4'
					style={{ borderBottom: '1px solid var(--border)' }}
				>
					<div>
						<h2
							className='font-semibold text-base'
							style={{ color: 'var(--card-foreground)' }}
						>
							Hujjatlarni yuklash
						</h2>
						<p
							className='text-xs mt-0.5'
							style={{ color: 'var(--muted-foreground)' }}
						>
							Barcha hujjatlarni yuklashga majbursiz
						</p>
					</div>
					<button
						onClick={onClose}
						className='w-8 h-8 rounded-full flex items-center justify-center transition-all'
						style={{ color: 'var(--muted-foreground)' }}
						onMouseEnter={e => {
							e.currentTarget.style.color = 'var(--foreground)'
							e.currentTarget.style.background = 'var(--muted)'
						}}
						onMouseLeave={e => {
							e.currentTarget.style.color = 'var(--muted-foreground)'
							e.currentTarget.style.background = 'transparent'
						}}
					>
						<X size={16} />
					</button>
				</div>

				{/* Body */}
				<div className='px-6 py-5 flex flex-col gap-4'>
					<FileField fieldKey='ilovalar' label='Ilovalar' icon={Paperclip} />
					<FileField fieldKey='akt_file' label='Akt fayl' icon={FileText} />
				</div>

				{/* Footer */}
				<div className='flex gap-3 px-6 pb-6'>
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
						disabled={!form.ilovalar || !form.akt_file || isDone || isLoading}
						onClick={onSubmit}
						className='flex-1 py-3 rounded-2xl text-sm font-semibold transition-all flex items-center justify-center gap-2'
						style={{
							background:
								'linear-gradient(135deg, var(--primary), oklch(0.424 0.199 265.638))',
							color: 'var(--primary-foreground)',
							opacity:
								!form.ilovalar || !form.akt_file || isDone || isLoading
									? 0.4
									: 1,
						}}
					>
						{isLoading ? (
							<Loader size={15} className='animate-spin' />
						) : isDone ? (
							<>
								<Check size={15} /> Bajarilgan
							</>
						) : (
							<>
								<Send size={15} /> Yuborish
							</>
						)}
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
export default function Coming_Application_Details_Work_Pogress({ data }) {
	const { data: me } = useMEQuery()
	const [openSheet, setOpenSheet] = useState(false)
	const [mediaViewer, setMediaViewer] = useState(null)
	const [form, setForm] = useState({
		comment: '',
		status: 'bajarilmoqda',
		ilovalar: null,
		akt_file: null,
	})

	const [ChangeComingApplication, { isLoading: isLoadingComing }] =
		useChangeComingAplicationMutation()

	const isFormComplete = () => form.comment.trim() !== ''
	const isDone = data?.status === 'bajarilgan'

	// ── Status tanlov variantlari ────────────────────────────────────────────
	// jarayonda | qaytarildi  → 3 ta tanlov
	const statusOptions = [
		{ label: 'Qaytarish', value: 'qaytarildi' },
		{ label: 'Bajarilmoqda', value: 'bajarilmoqda' },
		{ label: 'Tasdiqlanmoqda', value: 'tasdiqlanmoqda' },
	]
	// rad_etildi | bajarilmoqda → 2 ta tanlov
	const statusOptions2 = [
		{ label: 'Bajarilmoqda', value: 'bajarilmoqda' },
		{ label: 'Tasdiqlanmoqda', value: 'tasdiqlanmoqda' },
	]
	// tasdiqlanmoqda → faqat 1 ta (fayl yuborish majburiy)
	const statusOptions1 = [{ label: 'Tasdiqlanmoqda', value: 'tasdiqlanmoqda' }]

	const currentOptions =
		data?.status === 'tasdiqlanmoqda'
			? statusOptions1
			: data?.status === 'rad_etildi' || data?.status === 'bajarilmoqda'
				? statusOptions2
				: statusOptions
	// ────────────────────────────────────────────────────────────────────────

	const resolvedStatus =
		data?.status === 'tasdiqlanmoqda' ? 'tasdiqlanmoqda' : form.status

	const resetForm = () =>
		setForm({
			comment: '',
			status: 'bajarilmoqda',
			ilovalar: null,
			akt_file: null,
		})

	const submitForm = async () => {
		const fd = new FormData()
		fd.append('comment', form.comment)
		fd.append('ariza', data?.id)
		fd.append('holat', resolvedStatus)
		if (form.akt_file) fd.append('akt_file', form.akt_file)
		if (form.ilovalar) fd.append('ilovalar', form.ilovalar)

		await toast.promise(ChangeComingApplication({ body: fd }).unwrap(), {
			loading: 'Yuborilmoqda...',
			success: 'Yuborildi!',
			error: 'Xatolik!',
		})
		resetForm()
		setOpenSheet(false)
	}

	const openMediaViewer = useCallback((items, index) => {
		setMediaViewer({ items, index })
	}, [])

	// Status badge — CSS vars bilan
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
		bajarilmoqda: {
			label: 'Bajarilmoqda',
			color: 'var(--chart-1)',
			dot: 'var(--chart-1)',
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
				className='flex flex-col h-full'
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
					{!data?.kelganlar?.length && (
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
					{data?.kelganlar?.map(step => (
						<ChatBubble
							key={step.id}
							step={step}
							isMe={step.created_by === me?.username}
							onMediaClick={openMediaViewer}
						/>
					))}
				</div>

				{/* ── Input / Action Area ── */}
				<div
					className='shrink-0 px-3 py-3'
					style={{
						background: 'var(--card)',
						borderTop: '1px solid var(--border)',
					}}
				>
					{/* Status selector — bajarilgan bo'lsa yashiriladi */}
					{!isDone && (
						<div className='mb-3'>
							<SegmentedButtonGroup
								options={currentOptions}
								value={resolvedStatus}
								onChange={value => {
									if (data?.status !== 'tasdiqlanmoqda') {
										setForm(p => ({ ...p, status: value }))
									}
								}}
							/>
						</div>
					)}

					{/* Textarea + Send row */}
					<div
						className='flex items-end gap-2 rounded-3xl px-3 py-2'
						style={{
							background: 'var(--muted)',
							border: '1px solid var(--border)',
						}}
					>
						<textarea
							placeholder={isDone ? 'Ariza yakunlandi' : 'Komment yozing...'}
							disabled={isDone}
							value={form.comment}
							onChange={e => setForm({ ...form, comment: e.target.value })}
							className='flex-1 bg-transparent resize-none outline-none text-sm py-1.5 leading-relaxed disabled:cursor-not-allowed'
							style={{
								maxHeight: 120,
								minHeight: 36,
								color: 'var(--foreground)',
								opacity: isDone ? 0.4 : 1,
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
							disabled={!isFormComplete() || isLoadingComing || isDone}
							onClick={() => {
								if (resolvedStatus === 'tasdiqlanmoqda') {
									setOpenSheet(true)
								} else {
									submitForm()
								}
							}}
							className='shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200'
							style={{
								background:
									isFormComplete() && !isDone && !isLoadingComing
										? 'linear-gradient(135deg, var(--primary), oklch(0.424 0.199 265.638))'
										: 'var(--secondary)',
								opacity:
									isFormComplete() && !isDone && !isLoadingComing ? 1 : 0.4,
								transform:
									isFormComplete() && !isDone ? 'scale(1)' : 'scale(0.95)',
							}}
						>
							{isLoadingComing ? (
								<Loader
									size={15}
									className='animate-spin'
									style={{ color: 'var(--primary-foreground)' }}
								/>
							) : isDone ? (
								<Check
									size={15}
									style={{ color: 'var(--primary-foreground)' }}
								/>
							) : (
								<Send
									size={15}
									style={{ color: 'var(--primary-foreground)', marginLeft: 1 }}
								/>
							)}
						</button>
					</div>
				</div>
			</div>

			{/* Upload Sheet Modal */}
			<UploadSheetModal
				open={openSheet}
				onClose={() => setOpenSheet(false)}
				form={form}
				setForm={setForm}
				onSubmit={submitForm}
				isLoading={isLoadingComing}
				isDone={isDone}
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
