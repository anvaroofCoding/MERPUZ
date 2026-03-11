import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Textarea } from '@/components/ui/textarea'
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import {
	usePPRbajarildiPOSTMutation,
	usePprMonthDetailsQuery,
} from '@/services/api'
import { IconX } from '@tabler/icons-react'
import {
	ArrowLeft,
	Building2,
	Calendar,
	CheckCircle2,
	Clock,
	FileText,
	ImagePlus,
	Lock,
	MessageSquare,
	Plus,
	Save,
	Send,
	Upload,
	User,
	XCircle,
	Zap,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

/* ─── helpers ─────────────────────────────────────────────── */
const isToday = dateString => {
	const today = new Date()
	const inputDate = new Date(dateString)
	today.setHours(0, 0, 0, 0)
	inputDate.setHours(0, 0, 0, 0)
	return inputDate <= today
}

const getRemainingDays = dateString => {
	const today = new Date()
	const target = new Date(dateString)
	today.setHours(0, 0, 0, 0)
	target.setHours(0, 0, 0, 0)
	return (target - today) / (1000 * 60 * 60 * 24)
}

const formatDate = dateString => {
	if (!dateString) return ''
	return new Date(dateString).toLocaleDateString('uz-UZ', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})
}

const formatDateTime = dateString => {
	if (!dateString) return ''
	return new Date(dateString).toLocaleString('uz-UZ', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
	})
}

/* ─── status config ───────────────────────────────────────── */
const STATUS_MAP = {
	tasdiqlandi: {
		label: 'Tasdiqlandi',
		icon: CheckCircle2,
		badge: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500',
		dot: 'bg-emerald-500',
		bar: 'from-emerald-400 to-teal-500',
	},
	rad_etildi: {
		label: 'Rad etildi',
		icon: XCircle,
		badge: 'bg-destructive/10 border border-destructive/20 text-destructive',
		dot: 'bg-destructive',
		bar: 'from-destructive to-red-400',
	},
	yuborildi: {
		label: 'Yuborildi',
		icon: Send,
		badge: 'bg-blue-500/10 border border-blue-500/20 text-blue-500',
		dot: 'bg-blue-500',
		bar: 'from-blue-400 to-indigo-500',
	},
	jarayonda: {
		label: 'Jarayonda',
		icon: Clock,
		badge: 'bg-amber-500/10 border border-amber-500/20 text-amber-500',
		dot: 'bg-amber-500',
		bar: 'from-amber-400 to-orange-400',
	},
	bajarildi: {
		label: 'Bajarildi',
		icon: CheckCircle2,
		badge: 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500',
		dot: 'bg-emerald-500',
		bar: 'from-emerald-400 to-teal-500',
	},
}

/* ─── CircleProgress ──────────────────────────────────────── */
const CircleProgress = ({ value = 0, size = 96 }) => {
	const r = 44
	const circ = 2 * Math.PI * r
	const offset = circ - (value / 100) * circ
	const stroke =
		value === 100 ? '#10b981' : value >= 60 ? '#f59e0b' : 'hsl(235,100%,60%)'

	return (
		<svg width={size} height={size} viewBox='0 0 100 100' className='shrink-0'>
			<circle
				cx='50'
				cy='50'
				r={r}
				fill='none'
				stroke='currentColor'
				strokeWidth='8'
				className='text-muted-foreground/20'
			/>
			<circle
				cx='50'
				cy='50'
				r={r}
				fill='none'
				stroke={stroke}
				strokeWidth='8'
				strokeLinecap='round'
				strokeDasharray={circ}
				strokeDashoffset={offset}
				transform='rotate(-90 50 50)'
				style={{ transition: 'stroke-dashoffset 0.8s ease' }}
			/>
			<text
				x='50'
				y='46'
				textAnchor='middle'
				dominantBaseline='central'
				fontSize='17'
				fontWeight='700'
				fill={stroke}
			>
				{value}%
			</text>
			<text
				x='50'
				y='62'
				textAnchor='middle'
				fontSize='8'
				fill='currentColor'
				className='text-muted-foreground'
				opacity='0.55'
			>
				bajarildi
			</text>
		</svg>
	)
}

/* ─── StatChip ────────────────────────────────────────────── */
const StatChip = ({ label, value, accent }) => (
	<div
		className={`flex flex-col items-center justify-center rounded-xl border px-3 py-2 min-w-[64px]
      ${
				accent
					? 'border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-500/10'
					: 'border-border bg-muted/40'
			}`}
	>
		<span
			className={`text-base font-bold leading-none ${accent ? 'text-emerald-500' : 'text-foreground'}`}
		>
			{value}
		</span>
		<span className='text-[10px] text-muted-foreground font-medium mt-0.5 whitespace-nowrap'>
			{label}
		</span>
	</div>
)

/* ─── StepCard (replaces Accordion) ──────────────────────── */
const StepCard = ({ step, index }) => {
	const [imgOpen, setImgOpen] = useState(null)

	return (
		<div className='relative pl-9 sm:pl-11'>
			{/* timeline vertical line */}
			<div className='absolute left-[13px] sm:left-[17px] top-8 bottom-0 w-px bg-gradient-to-b from-primary/30 via-border to-transparent' />

			{/* index dot */}
			<div className='absolute left-0 top-4 w-[26px] h-[26px] rounded-full bg-primary flex items-center justify-center shadow ring-4 ring-primary/15'>
				<span className='text-primary-foreground text-[10px] font-bold'>
					{index + 1}
				</span>
			</div>

			<div className='mb-5 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-300'>
				{/* card header */}
				<div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 pt-4 pb-3 border-b border-border'>
					<div className='flex flex-wrap items-center gap-x-2 gap-y-1'>
						<div className='flex items-center gap-1.5 text-sm'>
							<User size={13} className='text-primary' />
							<span className='font-semibold text-foreground'>{step.user}</span>
						</div>
						<span className='text-muted-foreground/40 hidden sm:inline'>·</span>
						<div className='flex items-center gap-1 text-xs text-muted-foreground'>
							<Calendar size={11} />
							<span>{formatDateTime(step.created_at)}</span>
						</div>
					</div>
					<span className='flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 w-fit'>
						<Zap size={11} />
						{step.foiz}% bajarildi
					</span>
				</div>

				<div className='p-4 space-y-3'>
					{/* objects */}
					{step.bajarilgan_obyektlar_nomi?.length > 0 && (
						<div>
							<p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2'>
								Bajarilgan obyektlar
							</p>
							<div className='flex flex-wrap gap-1.5'>
								{step.bajarilgan_obyektlar_nomi.map((name, i) => (
									<span
										key={i}
										className='flex items-center gap-1.5 bg-primary/5 text-primary text-xs font-medium px-2.5 py-1 rounded-lg border border-primary/15'
									>
										<Building2 size={10} />
										{name}
									</span>
								))}
							</div>
						</div>
					)}

					{/* comment */}
					{step.comment && (
						<div className='flex gap-2 bg-muted/50 rounded-xl px-3 py-2.5'>
							<MessageSquare
								size={13}
								className='text-muted-foreground mt-0.5 shrink-0'
							/>
							<p className='text-sm text-muted-foreground leading-relaxed'>
								{step.comment}
							</p>
						</div>
					)}

					{/* file */}
					{step.file && (
						<a
							href={step.file}
							target='_blank'
							rel='noreferrer'
							className='inline-flex items-center gap-1.5 text-xs text-primary hover:underline underline-offset-2 font-medium'
						>
							<FileText size={13} />
							Fayl ko'rish
						</a>
					)}

					{/* images */}
					{step.images?.length > 0 && (
						<div>
							<p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2'>
								Rasmlar
							</p>
							<div className='flex flex-wrap gap-2'>
								{step.images.map((img, i) => (
									<button
										key={i}
										onClick={() => setImgOpen(img.image)}
										className='w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 border-border hover:border-primary transition-all hover:scale-105 shadow-sm'
									>
										<img
											src={img.image}
											alt={`rasm-${i}`}
											className='w-full h-full object-cover'
										/>
									</button>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* lightbox */}
			{imgOpen && (
				<div
					className='fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4'
					onClick={() => setImgOpen(null)}
				>
					<img
						src={imgOpen}
						alt='preview'
						className='max-w-full max-h-[90vh] rounded-2xl shadow-2xl'
					/>
					<button
						className='absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors'
						onClick={() => setImgOpen(null)}
					>
						<IconX size={16} className='text-white' />
					</button>
				</div>
			)}
		</div>
	)
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function PprMonthDetails() {
	const [open, setOpen] = useState(false)
	const { id } = useParams()
	console.log(id)
	const { data, isLoading } = usePprMonthDetailsQuery(id)
	const navigate = useNavigate()
	const [form, setForm] = useState({
		bajarilgan_obyektlar: [],
		comment: '',
		file: null,
		images: [],
		jadval: id,
	})
	const [postPpr, { isLoading: postPprLoading }] = usePPRbajarildiPOSTMutation()

	/* ── submit ── */
	const submit = async () => {
		try {
			const fd = new FormData()
			fd.append('jadval', form.jadval)
			fd.append('comment', form.comment)
			form.bajarilgan_obyektlar.forEach(i =>
				fd.append('bajarilgan_obyektlar', i),
			)
			if (form.file) fd.append('file', form.file)
			form.images.forEach(img => fd.append('images', img))
			await postPpr(fd).unwrap()
			setForm({ bajarilgan_obyektlar: [], comment: '', file: null, images: [] })
			toast.success("Ma'lumot muvaffaqiyatli yuborildi")
		} catch {
			toast.error('Xatolik yuz berdi')
		} finally {
			setOpen(false)
		}
	}

	/* ── loading ── */
	if (isLoading) {
		return (
			<div className='max-w-2xl mx-auto px-3 sm:px-4 py-6 space-y-4'>
				<Skeleton className='h-7 w-24 rounded-xl' />
				<div className='rounded-3xl border border-border bg-card p-5 sm:p-6 space-y-4'>
					<div className='flex gap-4'>
						<Skeleton className='w-24 h-24 rounded-full shrink-0' />
						<div className='flex-1 space-y-3 pt-1'>
							<Skeleton className='h-5 w-2/3' />
							<Skeleton className='h-4 w-1/2' />
							<div className='flex gap-2 pt-1'>
								{[...Array(3)].map((_, i) => (
									<Skeleton key={i} className='h-14 w-16 rounded-xl' />
								))}
							</div>
						</div>
					</div>
					<Skeleton className='h-px w-full' />
					<div className='grid grid-cols-2 gap-2'>
						<Skeleton className='h-10 rounded-xl' />
						<Skeleton className='h-10 rounded-xl' />
					</div>
				</div>
			</div>
		)
	}

	if (!data) return null

	/* ── derived ── */
	const cfg = STATUS_MAP[data.status] || STATUS_MAP.jarayonda
	const StatusIcon = cfg.icon
	const todayStatus = isToday(data.sana)
	const daysLeft = getRemainingDays(data.sana)
	const stepObjectIds = data.steps?.flatMap(s => s.bajarilgan_obyektlar) || []
	const completedCount = stepObjectIds.length
	const totalCount = data.obyektlar?.length || 0

	const toggleObject = (objId, checked) =>
		setForm(p => ({
			...p,
			bajarilgan_obyektlar: checked
				? [...p.bajarilgan_obyektlar, objId]
				: p.bajarilgan_obyektlar.filter(x => x !== objId),
		}))

	/* ── render ── */
	return (
		<div className='min-h-screen bg-background'>
			<div className=' mx-auto px-3 space-y-5'>
				{/* Back */}
				<button
					onClick={() => navigate(-1)}
					className='flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors group w-fit'
				>
					<ArrowLeft
						size={16}
						className='group-hover:-translate-x-1 transition-transform duration-200'
					/>
					Orqaga
				</button>

				{/* ══════ HERO CARD ══════ */}
				<div className='rounded-3xl border border-border bg-card shadow-sm overflow-hidden'>
					{/* accent bar */}
					<div className={`h-1.5 w-full bg-gradient-to-r ${cfg.bar}`} />

					{/* top section */}
					<div className='p-4 sm:p-6'>
						<div className='flex items-start gap-4'>
							<CircleProgress value={data.umumiy_foiz} size={96} />

							<div className='flex-1 min-w-0 space-y-3'>
								{/* title + status */}
								<div className='flex items-start justify-between gap-2 flex-wrap'>
									<div className='min-w-0'>
										<h1 className='text-base sm:text-xl font-bold text-foreground leading-tight'>
											{data.bolim_nomi}
										</h1>
										<div className='flex items-center gap-2 mt-1 flex-wrap'>
											<span className='flex items-center gap-1 text-xs text-muted-foreground'>
												<Calendar size={11} />
												{formatDate(data.sana)}
											</span>
											<span className='text-[11px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md'>
												{data.ppr_turi_name}
											</span>
										</div>
									</div>

									<div
										className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full shrink-0 ${cfg.badge}`}
									>
										<div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
										<StatusIcon size={11} />
										{cfg.label}
									</div>
								</div>

								{/* stats */}
								<div className='flex items-center gap-2 flex-wrap'>
									<StatChip label='Jami obyekt' value={totalCount} />
									<StatChip label='Bajarildi' value={completedCount} accent />
									<StatChip label='Qaydlar' value={data.steps?.length || 0} />
								</div>

								{/* comment */}
								{data.comment && (
									<div className='flex gap-2 bg-muted/50 rounded-xl px-3 py-2 border border-border'>
										<MessageSquare
											size={12}
											className='text-muted-foreground mt-0.5 shrink-0'
										/>
										<p className='text-xs text-muted-foreground leading-relaxed'>
											{data.comment}
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* objects */}
					<div className='border-t border-border px-4 sm:px-6 py-4'>
						<p className='text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-3'>
							PPR obyektlari
						</p>
						<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
							{data.obyektlar?.map(obj => {
								const done = stepObjectIds.includes(obj.id)
								return (
									<div
										key={obj.id}
										className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all
                      ${
												done
													? 'border-emerald-500/25 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400'
													: 'border-border bg-muted/30 text-muted-foreground'
											}`}
									>
										{done ? (
											<CheckCircle2
												size={14}
												className='text-emerald-500 shrink-0'
											/>
										) : (
											<div className='w-3.5 h-3.5 rounded-full border-2 border-muted-foreground/25 shrink-0' />
										)}
										<span className='truncate flex-1'>{obj.obyekt_nomi}</span>
										{done && (
											<span className='text-[10px] font-bold text-emerald-500 shrink-0'>
												✓
											</span>
										)}
									</div>
								)
							})}
						</div>
					</div>

					{/* CTA */}
					<div className='border-t border-border px-4 sm:px-6 py-4 bg-muted/20 flex justify-end'>
						<Dialog open={open} onOpenChange={setOpen}>
							<DialogTrigger asChild>
								{todayStatus ? (
									<Tooltip>
										<TooltipTrigger asChild>
											<Button
												disabled={data?.umumiy_foiz === 100}
												size='sm'
												onClick={() => setOpen(true)}
												className='flex items-center gap-2 rounded-xl shadow-sm'
											>
												<Plus size={14} />
												Ro'yxatga olish
											</Button>
										</TooltipTrigger>
										<TooltipContent>
											PPRni 100% bajarsangiz qayta ro'yxatga olmaysiz
										</TooltipContent>
									</Tooltip>
								) : (
									<Tooltip>
										<TooltipTrigger asChild>
											<span>
												<Button
													disabled
													variant='outline'
													size='sm'
													className='flex items-center gap-2 rounded-xl'
												>
													<Lock size={13} />
													{daysLeft > 0
														? `${daysLeft} kun qoldi`
														: daysLeft === 0
															? 'Bugun'
															: `${Math.abs(daysLeft)} kun o'tgan`}
												</Button>
											</span>
										</TooltipTrigger>
										<TooltipContent>
											PPR vaqti kelgandan keyin ro'yxatga olish mumkin
										</TooltipContent>
									</Tooltip>
								)}
							</DialogTrigger>

							{/* ══ DIALOG ══ */}
							<DialogContent className='w-[calc(100vw-16px)] sm:max-w-2xl p-0 overflow-hidden rounded-3xl'>
								<DialogHeader className='px-5 sm:px-7 pt-6 pb-4 border-b border-border bg-muted/20'>
									<DialogTitle className='text-lg font-bold text-foreground'>
										Ro'yxatga olish
									</DialogTitle>
									<DialogDescription className='text-sm text-muted-foreground'>
										Bugungi bajarilgan ishlar bo'yicha hisobotni to'ldiring.
									</DialogDescription>
								</DialogHeader>

								<div className='px-5 sm:px-7 py-5 space-y-6 max-h-[58vh] sm:max-h-[62vh] overflow-y-auto'>
									{/* Objects */}
									<div className='space-y-2.5'>
										<Label className='text-sm font-bold text-foreground flex items-center gap-2'>
											<Building2 size={14} className='text-primary' />
											Bajarilgan obyektlar
										</Label>
										<div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
											{data.obyektlar?.map(ins => {
												const isChecked = form.bajarilgan_obyektlar.includes(
													ins.id,
												)
												const isDisabled = stepObjectIds.includes(ins.id)
												return (
													<label
														key={ins.id}
														className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all select-none
                              ${isChecked ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:bg-muted/40'}
                              ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}
                            `}
													>
														<Checkbox
															checked={isChecked}
															disabled={isDisabled}
															onCheckedChange={v => toggleObject(ins.id, v)}
														/>
														<span className='text-sm font-medium text-foreground flex-1 truncate'>
															{ins.obyekt_nomi}
														</span>
														{isDisabled && (
															<CheckCircle2
																size={13}
																className='text-emerald-500 shrink-0'
															/>
														)}
													</label>
												)
											})}
										</div>
									</div>

									{/* Images */}
									<div className='space-y-2.5'>
										<Label className='text-sm font-bold text-foreground flex items-center gap-2'>
											<ImagePlus size={14} className='text-primary' />
											Rasmlar
										</Label>
										<div className='flex flex-wrap gap-2.5'>
											<label className='flex flex-col items-center justify-center w-[68px] h-[68px] rounded-2xl border-2 border-dashed border-primary/30 cursor-pointer hover:bg-primary/5 hover:border-primary/60 transition-all group'>
												<Plus
													size={18}
													className='text-primary/50 group-hover:text-primary transition-colors'
												/>
												<span className='text-[9px] font-semibold text-primary/50 group-hover:text-primary mt-0.5'>
													Qo'shish
												</span>
												<input
													type='file'
													className='hidden'
													accept='image/*'
													multiple
													onChange={e =>
														setForm(p => ({
															...p,
															images: [
																...p.images,
																...Array.from(e.target.files),
															],
														}))
													}
												/>
											</label>
											{form.images.map((photo, i) => (
												<div
													key={i}
													className='relative group w-[68px] h-[68px] rounded-2xl overflow-hidden border-2 border-border hover:border-primary transition-all shadow-sm'
												>
													<img
														src={URL.createObjectURL(photo)}
														className='w-full h-full object-cover'
														alt=''
													/>
													<button
														type='button'
														onClick={() =>
															setForm(p => ({
																...p,
																images: p.images.filter((_, idx) => idx !== i),
															}))
														}
														className='absolute inset-0 bg-black/55 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
													>
														<IconX size={14} className='text-white' />
													</button>
												</div>
											))}
										</div>
										{form.images.length === 0 && (
											<p className='text-xs text-muted-foreground'>
												Rasmlar yuklanmagan
											</p>
										)}
									</div>

									{/* File */}
									<div className='space-y-2.5'>
										<Label className='text-sm font-bold text-foreground flex items-center gap-2'>
											<FileText size={14} className='text-primary' />
											Fayl biriktirish
										</Label>
										<label className='flex items-center gap-3 px-4 py-3 border border-border rounded-xl cursor-pointer hover:bg-muted/40 hover:border-primary/30 transition-all'>
											<Upload
												size={15}
												className='text-muted-foreground shrink-0'
											/>
											<span className='text-sm text-muted-foreground truncate flex-1'>
												{form.file ? form.file.name : 'Fayl tanlash'}
											</span>
											{form.file && (
												<button
													type='button'
													onClick={e => {
														e.preventDefault()
														setForm(p => ({ ...p, file: null }))
													}}
													className='text-muted-foreground hover:text-destructive transition-colors shrink-0'
												>
													<IconX size={14} />
												</button>
											)}
											<input
												type='file'
												className='hidden'
												accept='.pdf,.doc,.docx,.txt,.jpg,.png'
												onChange={e => {
													const file = e.target.files[0]
													if (file) setForm(p => ({ ...p, file }))
												}}
											/>
										</label>
									</div>

									{/* Comment */}
									<div className='space-y-2.5'>
										<Label className='text-sm font-bold text-foreground flex items-center gap-2'>
											<MessageSquare size={14} className='text-primary' />
											Izoh
										</Label>
										<Textarea
											value={form.comment}
											onChange={e =>
												setForm(p => ({ ...p, comment: e.target.value }))
											}
											placeholder='Bajarilgan ish haqida batafsil yozing...'
											className='min-h-[96px] resize-none rounded-xl bg-background border-border text-sm'
										/>
									</div>
								</div>

								<DialogFooter className='px-5 sm:px-7 py-4 border-t border-border bg-muted/20'>
									<Button
										disabled={postPprLoading}
										onClick={submit}
										className='w-full sm:w-auto flex items-center gap-2 rounded-xl'
									>
										{postPprLoading ? (
											<>
												<span className='w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
												Saqlanmoqda...
											</>
										) : (
											<>
												<Save size={14} />
												Saqlash
											</>
										)}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{/* ══════ STEPS TIMELINE ══════ */}
				<div>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-sm font-bold text-foreground'>
							Bajarish tarixi
						</h2>
						<span className='text-xs text-muted-foreground bg-muted rounded-full px-3 py-1 border border-border'>
							{data.steps?.length || 0} ta qayd
						</span>
					</div>

					{data.steps?.length > 0 ? (
						<div>
							{data.steps.map((step, i) => (
								<StepCard key={step.id} step={step} index={i} />
							))}
						</div>
					) : (
						<div className='flex flex-col items-center justify-center py-14 rounded-2xl border border-dashed border-border bg-card text-center'>
							<div className='w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3'>
								<FileText size={20} className='text-muted-foreground' />
							</div>
							<p className='text-sm font-semibold text-muted-foreground'>
								Hali qaydlar yo'q
							</p>
							<p className='text-xs text-muted-foreground/60 mt-1'>
								Birinchi hisobotni qo'shing
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
