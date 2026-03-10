import SegmentedButtonGroup from '@/components/ruixen/segmented-button-group'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
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

	return (
		<div
			className='fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-md'
			onClick={e => e.target === e.currentTarget && onClose()}
		>
			<div
				className='w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl
        bg-white dark:bg-[#1c2733]
        border border-slate-200 dark:border-white/[0.06]
        shadow-2xl overflow-hidden'
			>
				{/* Header */}
				<div className='flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100 dark:border-white/[0.06]'>
					<div>
						<h2 className='text-slate-900 dark:text-white font-semibold text-base'>
							Hujjatlarni yuklash
						</h2>
						<p className='text-slate-500 dark:text-white/40 text-xs mt-0.5'>
							Barcha hujjatlarni yuklashga majbursiz
						</p>
					</div>
					<button
						onClick={onClose}
						className='w-8 h-8 rounded-full flex items-center justify-center transition
              text-slate-400 hover:text-slate-600 hover:bg-slate-100
              dark:text-white/30 dark:hover:text-white/60 dark:hover:bg-white/10'
					>
						<X size={16} />
					</button>
				</div>

				{/* Body */}
				<div className='px-6 py-5 flex flex-col gap-4'>
					{/* Ilovalar */}
					<div className='flex flex-col gap-2'>
						<Label className='text-slate-700 dark:text-white/70 text-sm font-medium'>
							Ilovalar
						</Label>
						<label
							className={cn(
								'flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition group',
								'border-2 border-dashed',
								form.ilovalar
									? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500/50'
									: 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 dark:border-white/10 dark:hover:border-blue-500/40 dark:bg-white/[0.03] dark:hover:bg-blue-500/5',
							)}
						>
							<div
								className={cn(
									'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition',
									form.ilovalar
										? 'bg-blue-500 text-white'
										: 'bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-white/10 dark:text-white/40 dark:group-hover:bg-blue-500/20 dark:group-hover:text-blue-400',
								)}
							>
								<Paperclip size={16} />
							</div>
							<div className='flex-1 min-w-0'>
								{form.ilovalar ? (
									<>
										<p className='text-blue-700 dark:text-blue-300 text-xs font-semibold truncate'>
											{form.ilovalar.name}
										</p>
										<p className='text-blue-500/60 dark:text-blue-400/50 text-[11px]'>
											Fayl tanlandi ✓
										</p>
									</>
								) : (
									<>
										<p className='text-slate-600 dark:text-white/50 text-xs font-medium'>
											Fayl tanlang
										</p>
										<p className='text-slate-400 dark:text-white/25 text-[11px]'>
											Bosing yoki sudrang
										</p>
									</>
								)}
							</div>
							{form.ilovalar && (
								<button
									type='button'
									onClick={e => {
										e.preventDefault()
										setForm(p => ({ ...p, ilovalar: null }))
									}}
									className='text-slate-400 hover:text-red-500 dark:text-white/20 dark:hover:text-red-400 transition shrink-0'
								>
									<X size={14} />
								</button>
							)}
							<input
								type='file'
								multiple
								className='hidden'
								onChange={e =>
									setForm(p => ({ ...p, ilovalar: e.target.files[0] || null }))
								}
							/>
						</label>
					</div>

					{/* Akt fayl */}
					<div className='flex flex-col gap-2'>
						<Label className='text-slate-700 dark:text-white/70 text-sm font-medium'>
							Akt fayl
						</Label>
						<label
							className={cn(
								'flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition group',
								'border-2 border-dashed',
								form.akt_file
									? 'border-blue-400 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500/50'
									: 'border-slate-200 hover:border-blue-300 bg-slate-50 hover:bg-blue-50/50 dark:border-white/10 dark:hover:border-blue-500/40 dark:bg-white/[0.03] dark:hover:bg-blue-500/5',
							)}
						>
							<div
								className={cn(
									'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition',
									form.akt_file
										? 'bg-blue-500 text-white'
										: 'bg-slate-200 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 dark:bg-white/10 dark:text-white/40 dark:group-hover:bg-blue-500/20 dark:group-hover:text-blue-400',
								)}
							>
								<FileText size={16} />
							</div>
							<div className='flex-1 min-w-0'>
								{form.akt_file ? (
									<>
										<p className='text-blue-700 dark:text-blue-300 text-xs font-semibold truncate'>
											{form.akt_file.name}
										</p>
										<p className='text-blue-500/60 dark:text-blue-400/50 text-[11px]'>
											Fayl tanlandi ✓
										</p>
									</>
								) : (
									<>
										<p className='text-slate-600 dark:text-white/50 text-xs font-medium'>
											Fayl tanlang
										</p>
										<p className='text-slate-400 dark:text-white/25 text-[11px]'>
											Bosing yoki sudrang
										</p>
									</>
								)}
							</div>
							{form.akt_file && (
								<button
									type='button'
									onClick={e => {
										e.preventDefault()
										setForm(p => ({ ...p, akt_file: null }))
									}}
									className='text-slate-400 hover:text-red-500 dark:text-white/20 dark:hover:text-red-400 transition shrink-0'
								>
									<X size={14} />
								</button>
							)}
							<input
								type='file'
								className='hidden'
								onChange={e =>
									setForm(p => ({ ...p, akt_file: e.target.files[0] || null }))
								}
							/>
						</label>
					</div>
				</div>

				{/* Footer */}
				<div className='flex gap-3 px-6 pb-6'>
					<button
						onClick={onClose}
						className='flex-1 py-3 rounded-2xl text-sm font-medium transition
              bg-slate-100 text-slate-600 hover:bg-slate-200
              dark:bg-white/[0.06] dark:text-white/50 dark:hover:text-white dark:border dark:border-white/[0.08] dark:hover:bg-white/10'
					>
						Bekor qilish
					</button>
					<button
						disabled={!form.ilovalar || !form.akt_file || isDone || isLoading}
						onClick={onSubmit}
						className='flex-1 py-3 rounded-2xl text-white text-sm font-semibold transition flex items-center justify-center gap-2
              bg-gradient-to-r from-blue-500 to-blue-700 hover:opacity-90 disabled:opacity-40
              shadow-lg shadow-blue-500/20 dark:shadow-blue-900/30'
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
						className={`text-sm leading-relaxed break-words ${isMe ? 'text-white' : 'text-slate-800 dark:text-white/90'}`}
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
                  ${isMe ? 'bg-white/15 hover:bg-white/25' : 'bg-slate-100 hover:bg-slate-200 dark:bg-white/[0.06] dark:hover:bg-white/10'}`}
								style={{ padding: '10px 12px' }}
								onClick={() => onMediaClick(allMedia, mediaIdx)}
							>
								<div className='w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500 to-blue-700 shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform'>
									<FileText size={16} className='text-white' />
								</div>
								<div className='flex-1 min-w-0'>
									<p
										className={`text-xs font-semibold truncate ${isMe ? 'text-white/90' : 'text-slate-700 dark:text-white/80'}`}
									>
										PDF hujjat
									</p>
									<p
										className={`text-[11px] ${isMe ? 'text-white/50' : 'text-slate-400 dark:text-white/35'}`}
									>
										Ko'rish uchun bosing
									</p>
								</div>
								<Download
									size={14}
									className={`shrink-0 transition ${isMe ? 'text-white/30 group-hover:text-white/60' : 'text-slate-400 group-hover:text-slate-600 dark:text-white/30 dark:group-hover:text-white/60'}`}
								/>
							</div>
						)
					})}

				{/* Timestamp */}
				<div
					className={`flex items-center justify-end gap-1 mt-1.5 ${isMe ? 'text-white/40' : 'text-slate-400 dark:text-white/30'}`}
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

	const statusOptions = [
		{ label: 'Qaytarish', value: 'qaytarildi' },
		{ label: 'Bajarilmoqda', value: 'bajarilmoqda' },
		{ label: 'Tasdiqlanmoqda', value: 'tasdiqlanmoqda' },
	]
	const statusOptions3 = [
		{ label: 'Bajarilmoqda', value: 'bajarilmoqda' },
		{ label: 'Tasdiqlanmoqda', value: 'tasdiqlanmoqda' },
	]
	const statusOptions1 = [{ label: 'Tasdiqlanmoqda', value: 'tasdiqlanmoqda' }]

	const currentOptions =
		data?.status === 'tasdiqlanmoqda' || data?.status === 'rad_etildi'
			? statusOptions1
			: data?.status === 'bajarilmoqda'
				? statusOptions3
				: statusOptions

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
		fd.append(
			'holat',
			data?.status === 'tasdiqlanmoqda' || data?.status === 'rad_etildi'
				? 'tasdiqlanmoqda'
				: form.status,
		)
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
		bajarilmoqda: {
			label: 'Bajarilmoqda',
			cls: 'text-amber-600 dark:text-amber-400',
			dot: 'bg-amber-500',
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
			<div className='flex flex-col h-full bg-slate-50 dark:bg-[#0d1b2a]'>
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
					{!data?.kelganlar?.length && (
						<div className='flex flex-col items-center justify-center h-40 gap-3'>
							<div className='w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-500/10'>
								<ImageIcon size={24} className='text-blue-400/60' />
							</div>
							<p className='text-slate-400 dark:text-white/20 text-sm'>
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
					className='shrink-0 px-3 py-3
          bg-white dark:bg-[#0d1b2a]/98
          border-t border-slate-200 dark:border-white/[0.05]'
				>
					{/* Status selector */}
					<div className='mb-3'>
						<SegmentedButtonGroup
							options={currentOptions}
							value={
								data?.status === 'tasdiqlanmoqda' ||
								data?.status === 'rad_etildi'
									? 'tasdiqlanmoqda'
									: form.status
							}
							onChange={value => {
								if (
									data?.status === 'tasdiqlanmoqda' ||
									data?.status === 'rad_etildi'
								) {
									setForm(p => ({ ...p, status: 'tasdiqlanmoqda' }))
								} else {
									setForm(p => ({ ...p, status: value }))
								}
							}}
						/>
					</div>

					{/* Textarea + Send row */}
					<div
						className='flex items-end gap-2 rounded-3xl px-3 py-2
            bg-slate-100 border border-slate-200
            dark:bg-[#182533] dark:border-white/[0.07]'
					>
						{/* Textarea */}
						<textarea
							placeholder='Komment yozing...'
							value={form.comment}
							onChange={e => setForm({ ...form, comment: e.target.value })}
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
							disabled={!isFormComplete() || isLoadingComing || isDone}
							onClick={() => {
								if (form.status === 'tasdiqlanmoqda') {
									setOpenSheet(true)
								} else {
									submitForm()
								}
							}}
							className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ${
								isFormComplete() && !isDone && !isLoadingComing
									? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-500/25 dark:shadow-blue-900/40 scale-100'
									: 'bg-slate-200 dark:bg-white/[0.08] scale-95 opacity-40'
							}`}
						>
							{isLoadingComing ? (
								<Loader size={15} className='text-white animate-spin' />
							) : isDone ? (
								<Check size={15} className='text-white' />
							) : (
								<Send
									size={15}
									className='text-white'
									style={{ marginLeft: 1 }}
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
