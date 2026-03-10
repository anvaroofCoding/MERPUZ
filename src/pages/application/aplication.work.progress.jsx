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
		<div className='fixed inset-0 z-[100] flex flex-col bg-black/90 dark:bg-black/95 backdrop-blur-xl'>
			{/* Top bar */}
			<div className='flex items-center justify-between px-5 py-4 shrink-0 border-b border-white/10'>
				<span className='text-white/70 text-sm font-medium truncate max-w-[60%] font-mono'>
					{item?.name || (isImage ? 'Rasm' : 'Fayl')}
				</span>
				<div className='flex items-center gap-1'>
					{isImage && (
						<>
							<button
								onClick={() => setZoom(z => Math.max(0.5, z - 0.25))}
								className='w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all'
							>
								<ZoomOut size={16} />
							</button>
							<span className='text-white/40 text-xs w-12 text-center font-mono'>
								{Math.round(zoom * 100)}%
							</span>
							<button
								onClick={() => setZoom(z => Math.min(3, z + 0.25))}
								className='w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all'
							>
								<ZoomIn size={16} />
							</button>
						</>
					)}
					<button
						onClick={handleDownload}
						className='w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all'
					>
						<Download size={16} />
					</button>
					<button
						onClick={onClose}
						className='w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all ml-1'
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
					<div className='flex flex-col items-center gap-5 p-10 rounded-3xl bg-white/5 border border-white/10'>
						<div className='w-24 h-24 rounded-3xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-900/40'>
							<FileText size={44} className='text-white' />
						</div>
						<p className='text-white text-base font-semibold text-center max-w-xs break-all'>
							{item?.name || 'Fayl'}
						</p>
						<button
							onClick={handleDownload}
							className='flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm font-semibold bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 transition-opacity shadow-lg shadow-blue-900/30'
						>
							<Download size={16} />
							Yuklab olish
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
						className='w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20 hover:bg-white/10 transition-all'
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
										i === current ? '#3b82f6' : 'rgba(255,255,255,0.25)',
								}}
							/>
						))}
					</div>
					<button
						disabled={current === items.length - 1}
						onClick={() => setCurrent(c => c + 1)}
						className='w-10 h-10 rounded-full flex items-center justify-center text-white/50 hover:text-white disabled:opacity-20 hover:bg-white/10 transition-all'
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
			className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-md'
			onClick={e => e.target === e.currentTarget && onClose()}
		>
			<div
				className='w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl p-6
        bg-white dark:bg-[#1c2733]
        border border-slate-200 dark:border-white/[0.06]
        shadow-2xl'
			>
				<div className='flex items-center gap-3 mb-5'>
					<div className='w-10 h-10 rounded-2xl flex items-center justify-center bg-blue-100 dark:bg-blue-500/20'>
						<Lock size={18} className='text-blue-600 dark:text-blue-400' />
					</div>
					<div>
						<h2 className='text-slate-900 dark:text-white font-semibold text-base'>
							Tasdiqlash
						</h2>
						<p className='text-slate-500 dark:text-white/40 text-xs'>
							Parolingizni kiriting
						</p>
					</div>
					<button
						onClick={onClose}
						className='ml-auto text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60 transition'
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
						className='w-full px-4 py-3 rounded-2xl text-sm outline-none transition pr-12
              bg-slate-100 border border-slate-200 text-slate-900 placeholder-slate-400
              focus:border-blue-400 focus:bg-white
              dark:bg-white/[0.06] dark:border-white/10 dark:text-white dark:placeholder-white/20
              dark:focus:border-blue-500 dark:focus:bg-white/[0.08]'
					/>
					<button
						type='button'
						onClick={() => setShow(s => !s)}
						className='absolute right-3 top-1/2 -translate-y-1/2 transition
              text-slate-400 hover:text-slate-600
              dark:text-white/30 dark:hover:text-white/60'
					>
						{show ? <EyeOff size={16} /> : <Eye size={16} />}
					</button>
				</div>

				<div className='flex gap-3'>
					<button
						onClick={onClose}
						className='flex-1 py-3 rounded-2xl text-sm font-medium transition
              bg-slate-100 text-slate-600 hover:bg-slate-200
              dark:bg-white/[0.06] dark:text-white/50 dark:hover:text-white dark:border dark:border-white/[0.08] dark:hover:bg-white/10'
					>
						Bekor qilish
					</button>
					<button
						disabled={!value}
						onClick={onConfirm}
						className='flex-1 py-3 rounded-2xl text-white text-sm font-semibold transition
              bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 disabled:opacity-40
              shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30'
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
				className={`relative max-w-[78%] min-w-[80px] px-3.5 pt-2.5 pb-1.5 shadow-sm
          ${
						isMe
							? 'bg-blue-600 dark:bg-[#2b5278] border border-blue-500/20 dark:border-blue-400/20'
							: 'bg-white dark:bg-[#182533] border border-slate-200 dark:border-white/[0.05]'
					}`}
				style={{
					borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
				}}
			>
				{/* Sender */}
				{!isMe && (
					<p className='text-xs font-bold mb-1 text-blue-600 dark:text-blue-400 font-mono'>
						{step.created_by}
					</p>
				)}

				{/* Text */}
				{step.comment && (
					<p
						className={`text-sm leading-relaxed break-words ${
							isMe ? 'text-white' : 'text-slate-800 dark:text-white/90'
						}`}
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
								className='relative rounded-xl overflow-hidden cursor-pointer group bg-slate-100 dark:bg-black/20'
								style={{ height: step.rasmlar.length === 1 ? 200 : 130 }}
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
								className={`mt-2 flex items-center gap-3 rounded-2xl cursor-pointer transition-all group
                  ${
										isMe
											? 'bg-white/15 hover:bg-white/25'
											: 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10'
									}`}
								style={{ padding: '10px 12px' }}
								onClick={() => onMediaClick(allMedia, mediaIdx)}
							>
								<div className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform'>
									<FileText size={16} className='text-white' />
								</div>
								<div className='flex-1 min-w-0'>
									<p
										className={`text-xs font-semibold truncate ${
											isMe
												? 'text-white/90'
												: 'text-slate-700 dark:text-white/80'
										}`}
									>
										PDF hujjat
									</p>
									<p
										className={`text-[11px] ${
											isMe
												? 'text-white/50'
												: 'text-slate-400 dark:text-white/35'
										}`}
									>
										Ko'rish uchun bosing
									</p>
								</div>
								<Download
									size={14}
									className={`shrink-0 transition ${
										isMe
											? 'text-white/30 group-hover:text-white/60'
											: 'text-slate-400 group-hover:text-slate-600 dark:text-white/30 dark:group-hover:text-white/60'
									}`}
								/>
							</div>
						)
					})}

				{/* Timestamp */}
				<div
					className={`flex items-center justify-end gap-1 mt-1.5 ${
						isMe ? 'text-white/40' : 'text-slate-400 dark:text-white/30'
					}`}
				>
					<span className='text-[10px] font-mono'>
						{time} · {dateStr}
					</span>
					{isMe && (
						<CheckCheck
							size={12}
							className='text-blue-200 dark:text-blue-400'
						/>
					)}
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
			cls: 'text-amber-600 dark:text-amber-400',
			dot: 'bg-amber-500',
		},
		qaytarildi: {
			label: 'Qaytarildi',
			cls: 'text-red-600 dark:text-red-400',
			dot: 'bg-red-500',
		},
		tasdiqlanmoqda: {
			label: 'Tasdiqlanmoqda',
			cls: 'text-blue-600 dark:text-blue-400',
			dot: 'bg-blue-500',
		},
		bajarilgan: {
			label: 'Bajarilgan',
			cls: 'text-green-600 dark:text-green-400',
			dot: 'bg-green-500',
		},
		rad_etildi: {
			label: 'Rad etildi',
			cls: 'text-red-600 dark:text-red-400',
			dot: 'bg-red-500',
		},
	}
	const badge = statusBadge[data?.status]

	return (
		<>
			<div className='flex flex-col h-full bg-slate-50 dark:bg-[#0d1b2a] rounded-2xl shadow-lg overflow-hidden'>
				{/* ── Header ── */}
				<div
					className='px-4 py-3 flex items-center gap-3 shrink-0
          bg-white dark:bg-[#0d1b2a]/95
          border-b border-slate-200 dark:border-white/[0.05]
          backdrop-blur-md'
				>
					<div
						className='w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm
            bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-500/20 dark:shadow-blue-900/40'
					>
						{data?.id ? String(data.id).slice(-2) : '?'}
					</div>
					<div className='flex-1 min-w-0'>
						<p className='text-slate-900 dark:text-white text-sm font-semibold truncate'>
							Ariza #{data?.id}
						</p>
						{badge && (
							<div className='flex items-center gap-1.5 mt-0.5'>
								<span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
								<span className={`text-xs font-medium ${badge.cls}`}>
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
								className='w-14 h-14 rounded-full flex items-center justify-center
                bg-blue-100 dark:bg-blue-500/10'
							>
								<ImageIcon size={24} className='text-blue-400/60' />
							</div>
							<p className='text-slate-400 dark:text-white/20 text-sm'>
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
					className='shrink-0 px-3 py-3
          bg-white dark:bg-[#0d1b2a]/98
          border-t border-slate-200 dark:border-white/[0.05]'
				>
					{/* Status radio */}
					{data?.status === 'tasdiqlanmoqda' && (
						<div className='flex items-center gap-4 mb-3 px-1'>
							<RadioGroup
								value={form.status}
								onValueChange={val => setForm({ ...form, status: val })}
								className='flex items-center gap-5'
							>
								<div className='flex items-center gap-2'>
									<RadioGroupItem
										value='bajarilgan'
										id='opt-done'
										className='border-green-500 text-green-500'
									/>
									<Label
										htmlFor='opt-done'
										className='text-slate-600 dark:text-white/70 text-sm cursor-pointer hover:text-slate-900 dark:hover:text-white transition'
									>
										✓ Bajarildi
									</Label>
								</div>
								<div className='flex items-center gap-2'>
									<RadioGroupItem
										value='rad_etildi'
										id='opt-reject'
										className='border-red-500 text-red-500'
									/>
									<Label
										htmlFor='opt-reject'
										className='text-slate-600 dark:text-white/70 text-sm cursor-pointer hover:text-slate-900 dark:hover:text-white transition'
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
									className='relative shrink-0 rounded-xl overflow-hidden border-2 border-blue-400/40'
									style={{ width: 60, height: 60 }}
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
							className='flex items-center gap-2 px-3 py-2 rounded-xl mb-2 text-sm
              bg-blue-50 border border-blue-200
              dark:bg-blue-500/10 dark:border-blue-500/20'
						>
							<FileText
								size={14}
								className='text-blue-600 dark:text-blue-400 shrink-0'
							/>
							<span className='text-slate-700 dark:text-white/70 truncate flex-1'>
								{form.bildirgi.name}
							</span>
							<button
								onClick={removeBildirgi}
								className='text-slate-400 hover:text-slate-600 dark:text-white/30 dark:hover:text-white/60 transition'
							>
								<X size={14} />
							</button>
						</div>
					)}

					{/* Input row */}
					<div
						className='flex items-end gap-2 rounded-3xl px-3 py-2
            bg-slate-100 border border-slate-200
            dark:bg-[#182533] dark:border-white/[0.07]'
					>
						{/* Photo upload */}
						<label
							className='shrink-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition
              text-slate-500 hover:text-slate-700 hover:bg-slate-200
              dark:text-white/40 dark:hover:text-white/70 dark:hover:bg-white/10'
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
							className='shrink-0 w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition
              text-slate-500 hover:text-slate-700 hover:bg-slate-200
              dark:text-white/40 dark:hover:text-white/70 dark:hover:bg-white/10'
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
							className='flex-1 bg-transparent resize-none outline-none text-sm py-1.5 leading-relaxed
                text-slate-800 placeholder-slate-400 caret-blue-500
                dark:text-white/85 dark:placeholder-white/25 dark:caret-blue-400'
							style={{ maxHeight: 120, minHeight: 36 }}
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
							className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
								canSend
									? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/25 dark:shadow-blue-900/40 scale-100'
									: 'bg-slate-200 dark:bg-white/[0.08] scale-95 opacity-40'
							}`}
						>
							<Send
								size={15}
								className='text-white'
								style={{ marginLeft: 1 }}
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
