import { EmptyOutline } from '@/components/Empty/not_found'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
	useMEQuery,
	useOptionAplicationQuery,
	useOptionTuzilmaQuery,
	useXarid_postMutation,
	useXaridQuery,
} from '@/services/api'
import { format, parseISO } from 'date-fns'
import { uz } from 'date-fns/locale'
import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	ExternalLink,
	FileCheck,
	FileText,
	Filter,
	Handshake,
	Loader2,
	MessageSquare,
	Plus,
	Search,
	Send,
	Upload,
	X,
	XCircle,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const statusConfig = {
	yuborildi: {
		label: 'Yuborildi',
		icon: Send,
		className:
			'bg-blue-500/15 text-blue-600 border-blue-500/30 dark:text-blue-400',
		dot: 'bg-blue-400',
	},
	kelishildi: {
		label: 'Kelishildi',
		icon: Handshake,
		className:
			'bg-violet-500/15 text-violet-600 border-violet-500/30 dark:text-violet-400',
		dot: 'bg-violet-400',
	},
	tasdiqlandi: {
		label: 'Tasdiqlandi',
		icon: CheckCircle2,
		className:
			'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:text-emerald-400',
		dot: 'bg-emerald-400',
	},
	rad_etildi: {
		label: 'Rad etildi',
		icon: XCircle,
		className: 'bg-red-500/15 text-red-600 border-red-500/30 dark:text-red-400',
		dot: 'bg-red-400',
	},
}

// ─── STATUS BADGE ──────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
	const config = statusConfig[status]
	if (!config)
		return (
			<span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-muted/50 text-muted-foreground border-border'>
				<span className='w-1.5 h-1.5 rounded-full bg-muted-foreground' />
				{status || "Noma'lum"}
			</span>
		)
	const Icon = config.icon
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border whitespace-nowrap',
				config.className,
			)}
		>
			<Icon className='w-3.5 h-3.5' />
			{config.label}
		</span>
	)
}

// ─── COMMENT POPOVER ──────────────────────────────────────────────────────────
function CommentPopover({ comment }) {
	const [open, setOpen] = useState(false)
	const [pos, setPos] = useState({ top: 0, left: 0 })
	const triggerRef = useRef(null)

	const handleClick = e => {
		e.stopPropagation()
		if (!open) {
			const rect = triggerRef.current.getBoundingClientRect()
			const popW = 280
			let left = rect.left + rect.width / 2 - popW / 2
			if (left < 8) left = 8
			if (left + popW > window.innerWidth - 8)
				left = window.innerWidth - popW - 8
			setPos({ top: rect.bottom + 6, left })
		}
		setOpen(v => !v)
	}

	useEffect(() => {
		if (!open) return
		const close = e => {
			if (triggerRef.current && !triggerRef.current.contains(e.target))
				setOpen(false)
		}
		const onKey = e => e.key === 'Escape' && setOpen(false)
		document.addEventListener('mousedown', close)
		document.addEventListener('keydown', onKey)
		return () => {
			document.removeEventListener('mousedown', close)
			document.removeEventListener('keydown', onKey)
		}
	}, [open])

	if (!comment)
		return <span className='text-muted-foreground/40 text-xs'>—</span>

	const preview = comment.length > 40 ? comment.slice(0, 40) + '...' : comment

	return (
		<>
			<button
				ref={triggerRef}
				onClick={handleClick}
				className={cn(
					'group flex items-start gap-1.5 text-left w-full cursor-pointer rounded-lg px-2 py-1.5 -mx-2 -my-1.5 transition-colors',
					open
						? 'bg-primary/8 text-foreground'
						: 'hover:bg-muted/60 text-muted-foreground',
				)}
			>
				<MessageSquare
					className={cn(
						'w-3.5 h-3.5 mt-0.5 flex-shrink-0 transition-colors',
						open
							? 'text-primary'
							: 'text-muted-foreground/60 group-hover:text-muted-foreground',
					)}
				/>
				<span className='text-xs leading-relaxed break-words'>{preview}</span>
			</button>

			{open &&
				createPortal(
					<div
						className='fixed z-[99998] w-[280px]'
						style={{ top: pos.top, left: pos.left }}
						onClick={e => e.stopPropagation()}
					>
						<div className='absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-card border-t border-l border-border rotate-45' />
						<div className='bg-card border border-border rounded-xl shadow-2xl overflow-hidden'>
							<div className='flex items-center justify-between px-3.5 py-2.5 border-b border-border/60 bg-muted/30'>
								<div className='flex items-center gap-1.5'>
									<MessageSquare className='w-3.5 h-3.5 text-primary' />
									<span className='text-xs font-semibold text-foreground'>
										Izoh
									</span>
								</div>
								<button
									onClick={e => {
										e.stopPropagation()
										setOpen(false)
									}}
									className='w-5 h-5 rounded flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground hover:text-foreground'
								>
									<X className='w-3 h-3' />
								</button>
							</div>
							<div className='px-3.5 py-3 max-h-48 overflow-y-auto'>
								<p className='text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap break-words'>
									{comment}
								</p>
							</div>
						</div>
					</div>,
					document.body,
				)}
		</>
	)
}

// ─── STEP CHIP ─────────────────────────────────────────────────────────────────
function StepChip({ status }) {
	if (status === 'rad_etildi')
		return (
			<span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-xs font-semibold text-red-600 dark:text-red-400 whitespace-nowrap'>
				<XCircle className='w-3.5 h-3.5' /> Rad etildi
			</span>
		)
	if (status === 'kelishildi' || status === 'tasdiqlandi')
		return (
			<span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-xs font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap'>
				<CheckCircle2 className='w-3.5 h-3.5' /> {statusConfig[status]?.label}
			</span>
		)
	return (
		<span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap'>
			<Send className='w-3.5 h-3.5' /> Yuborildi
		</span>
	)
}

// ─── STEPS MODAL (portal) ─────────────────────────────────────────────────────
function StepsModal({ steplar, total, doneCount, hasRad, pct, onClose }) {
	useEffect(() => {
		const h = e => e.key === 'Escape' && onClose()
		window.addEventListener('keydown', h)
		return () => window.removeEventListener('keydown', h)
	}, [onClose])

	return createPortal(
		<div
			className='fixed inset-0 z-[99999] flex items-center justify-center p-4'
			onClick={onClose}
		>
			<div className='absolute inset-0 bg-black/50 backdrop-blur-sm' />
			<div
				className='relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden'
				onClick={e => e.stopPropagation()}
			>
				{/* Header */}
				<div className='flex items-center justify-between px-6 py-4 border-b border-border/60'>
					<div>
						<h3 className='text-base font-bold text-foreground'>
							Bosqichlar holati
						</h3>
						<p className='text-xs text-muted-foreground mt-0.5'>
							{doneCount} ta tasdiqlandi · {total} ta jami
						</p>
					</div>
					<div className='flex items-center gap-2'>
						{hasRad && (
							<span className='inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/25 text-xs font-bold text-red-600 dark:text-red-400'>
								<XCircle className='w-3.5 h-3.5' /> Rad bor
							</span>
						)}
						<button
							onClick={onClose}
							className='w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors text-muted-foreground hover:text-foreground'
						>
							<X className='w-4 h-4' />
						</button>
					</div>
				</div>

				{/* Progress */}
				<div className='px-6 py-3 bg-muted/30 border-b border-border/40 flex items-center gap-3'>
					<div className='flex-1 h-2 bg-muted rounded-full overflow-hidden'>
						<div
							className={cn(
								'h-full rounded-full transition-all duration-700',
								hasRad
									? 'bg-red-500'
									: pct === 100
										? 'bg-emerald-500'
										: 'bg-primary',
							)}
							style={{ width: `${hasRad ? 100 : pct}%` }}
						/>
					</div>
					<span className='text-sm font-bold tabular-nums text-muted-foreground'>
						{hasRad ? '—' : `${pct}%`}
					</span>
				</div>

				{/* Steps */}
				<div className='overflow-y-auto max-h-[60vh]'>
					{steplar.length === 0 ? (
						<div className='px-6 py-10 text-center text-sm text-muted-foreground'>
							Hali hech kim qaror qabul qilmagan
						</div>
					) : (
						steplar.map((s, i) => {
							const isDone =
								s.status === 'kelishildi' || s.status === 'tasdiqlandi'
							const isRad = s.status === 'rad_etildi'
							return (
								<div
									key={s.id ?? i}
									className={cn(
										'flex gap-4 px-6 py-4',
										i < steplar.length - 1 && 'border-b border-border/40',
										isRad && 'bg-red-500/5',
										isDone && 'bg-emerald-500/5',
									)}
								>
									<div className='flex flex-col items-center gap-1 flex-shrink-0 pt-0.5'>
										<div
											className={cn(
												'w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-background shadow-sm',
												isDone
													? 'bg-emerald-500 text-white'
													: isRad
														? 'bg-red-500 text-white'
														: 'bg-muted text-muted-foreground border border-border',
											)}
										>
											{isDone ? (
												<CheckCircle2 className='w-4 h-4' />
											) : isRad ? (
												<XCircle className='w-4 h-4' />
											) : (
												<span className='text-xs font-bold'>{i + 1}</span>
											)}
										</div>
										{i < steplar.length - 1 && (
											<div
												className={cn(
													'w-0.5 flex-1 min-h-[12px] rounded-full',
													isDone
														? 'bg-emerald-500/40'
														: isRad
															? 'bg-red-500/40'
															: 'bg-border/60',
												)}
											/>
										)}
									</div>
									<div className='flex-1 min-w-0'>
										<div className='flex items-start justify-between gap-2 flex-wrap'>
											<div>
												<p className='text-sm font-bold text-foreground'>
													{s.tuzilma_nomi}
												</p>
												<p className='text-xs text-muted-foreground'>
													{s.user_nomi}
												</p>
											</div>
											<StepChip status={s.status} />
										</div>
										{s.comment && (
											<div className='mt-2 px-3 py-2 rounded-xl bg-muted/60 border border-border/40'>
												<p className='text-xs text-foreground/80 leading-relaxed whitespace-pre-wrap break-words'>
													{s.comment}
												</p>
											</div>
										)}
										{s.sana && (
											<p className='text-[10px] text-muted-foreground/60 mt-2'>
												{format(parseISO(s.sana), 'dd MMMM yyyy, HH:mm', {
													locale: uz,
												})}
											</p>
										)}
									</div>
								</div>
							)
						})
					)}
				</div>

				<div className='px-6 py-3 border-t border-border/40 bg-muted/20 flex justify-end'>
					<Button
						size='sm'
						variant='outline'
						onClick={onClose}
						className='h-8 text-xs px-4'
					>
						Yopish
					</Button>
				</div>
			</div>
		</div>,
		document.body,
	)
}

// ─── STEP PROGRESS ─────────────────────────────────────────────────────────────
function StepProgress({ steplar = [], tuzilma = [] }) {
	const [open, setOpen] = useState(false)
	const total = tuzilma.length || steplar.length
	const hasRad = steplar.some(s => s.status === 'rad_etildi')
	const doneCount = steplar.filter(
		s => s.status === 'kelishildi' || s.status === 'tasdiqlandi',
	).length
	const pct = total ? Math.round((doneCount / total) * 100) : 0
	const dotColor = s => {
		if (s.status === 'tasdiqlandi' || s.status === 'kelishildi')
			return 'bg-emerald-500'
		if (s.status === 'rad_etildi') return 'bg-red-500'
		return 'bg-muted border border-border'
	}

	if (!steplar.length)
		return (
			<>
				<button
					onClick={e => {
						e.stopPropagation()
						setOpen(true)
					}}
					className='flex items-center gap-2 hover:opacity-70 transition-opacity cursor-pointer'
				>
					<div className='h-1.5 bg-muted rounded-full w-16' />
					<span className='text-[10px] font-semibold tabular-nums text-muted-foreground'>
						0/{total}
					</span>
				</button>
				{open && (
					<StepsModal
						steplar={[]}
						total={total}
						doneCount={0}
						hasRad={false}
						pct={0}
						onClose={() => setOpen(false)}
					/>
				)}
			</>
		)

	return (
		<>
			<button
				onClick={e => {
					e.stopPropagation()
					setOpen(true)
				}}
				className='flex flex-col gap-1.5 min-w-[100px] text-left group/prog cursor-pointer hover:opacity-80 transition-opacity'
				title="Bosqichlarni ko'rish"
			>
				<div className='flex items-center gap-2'>
					<div className='flex-1 h-1.5 bg-muted rounded-full overflow-hidden'>
						<div
							className={cn(
								'h-full rounded-full transition-all duration-500',
								hasRad
									? 'bg-red-500'
									: pct === 100
										? 'bg-emerald-500'
										: 'bg-primary',
							)}
							style={{ width: `${hasRad ? 100 : pct}%` }}
						/>
					</div>
					<span className='text-[10px] font-semibold tabular-nums text-muted-foreground whitespace-nowrap'>
						{doneCount}/{total}
					</span>
				</div>
				<div className='flex items-center gap-1'>
					{steplar.map((s, i) => (
						<div
							key={s.id ?? i}
							className={cn(
								'w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-background transition-transform group-hover/prog:scale-110',
								dotColor(s),
							)}
						>
							{(s.status === 'kelishildi' || s.status === 'tasdiqlandi') && (
								<CheckCircle2 className='w-3 h-3 text-white' />
							)}
							{s.status === 'rad_etildi' && (
								<XCircle className='w-3 h-3 text-white' />
							)}
						</div>
					))}
					{hasRad && (
						<span className='inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/25 text-[9px] font-bold text-red-600 dark:text-red-400'>
							<XCircle className='w-2.5 h-2.5' /> Rad
						</span>
					)}
				</div>
			</button>
			{open && (
				<StepsModal
					steplar={steplar}
					total={total}
					doneCount={doneCount}
					hasRad={hasRad}
					pct={pct}
					onClose={() => setOpen(false)}
				/>
			)}
		</>
	)
}

// ─── FAYL BUTTON ───────────────────────────────────────────────────────────────
function FaylButton({ url }) {
	if (!url) return <span className='text-muted-foreground/40 text-xs'>—</span>
	const filename = url.split('/').pop()
	return (
		<a
			href={url}
			target='_blank'
			rel='noopener noreferrer'
			onClick={e => e.stopPropagation()}
			className='inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors max-w-[120px]'
		>
			<FileText className='w-3 h-3 flex-shrink-0' />
			<span className='truncate'>{filename}</span>
			<ExternalLink className='w-2.5 h-2.5 flex-shrink-0 opacity-60' />
		</a>
	)
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function XaridQilish() {
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('')
	const [sortBy, setSortBy] = useState('')
	const [page, setPage] = useState(1)
	const limit = 50
	const [show, setShow] = useState(false)
	const [structureSearch, setStructureSearch] = useState('')
	const [totalPages, setTotalPages] = useState(1)
	const [form, setForm] = useState({ comment: '', targets: [], bildirgi: null })

	const aplication_clear = () =>
		setForm({ comment: '', targets: [], bildirgi: null })

	const handleBildirgiUpload = e => {
		const file = e.target.files[0]
		if (file) setForm(prev => ({ ...prev, bildirgi: file }))
	}

	const handleStructureToggle = structure => {
		setForm(prev => {
			const exists = prev.targets.find(item => item.tuzilma === structure.id)
			if (exists)
				return {
					...prev,
					targets: prev.targets.filter(item => item.tuzilma !== structure.id),
				}
			return {
				...prev,
				targets: [
					...prev.targets,
					{ tuzilma: structure.id, tuzilma_nomi: structure.tuzilma_nomi },
				],
			}
		})
	}

	const { data, isLoading, total_pages } = useXaridQuery({
		page,
		limit,
		search: searchTerm,
		status: statusFilter,
		tuzilma_nomi: sortBy,
	})
	const { data: me, isLoading: meLoading } = useMEQuery()
	const { data: OptionAplications, isLoading: OptionAplicationLoading } =
		useOptionAplicationQuery()
	const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
		useOptionTuzilmaQuery()
	const [xarid_post, { isLoading: AplicationLoader, isError, error }] =
		useXarid_postMutation()

	useEffect(() => {
		if (total_pages) setTotalPages(total_pages)
	}, [total_pages])

	useEffect(() => {
		if (isError) {
			if (error?.data?.comment) toast.error(error?.data?.comment[0])
			if (error?.data?.fayl) toast.error(error?.data?.fayl[0])
			if (error?.data?.message) toast.error(error?.data?.message[0])
		}
	}, [isError, error])

	const filteredStructures =
		OptionTuzilma?.filter(item =>
			item?.tuzilma_nomi.toLowerCase().includes(structureSearch.toLowerCase()),
		) || []

	const isFormComplete = () =>
		form.comment.trim() !== '' && form.targets.length > 0

	const submitForm = async () => {
		const fd = new FormData()
		fd.append('comment', form.comment)
		form.targets.forEach(item => fd.append('tuzilmalar', item.tuzilma))
		if (form.bildirgi) fd.append('fayl', form.bildirgi)
		await toast.promise(xarid_post(fd).unwrap(), {
			loading: 'Yuborilmoqda...',
			success: 'Yuborildi!',
			error: 'Xatolik!',
		})
		setShow(false)
		aplication_clear()
	}

	const statusFilterOptions = [
		{ value: '', label: 'Barchasi' },
		{ value: 'yuborildi', label: 'Yuborildi' },
		{ value: 'kelishildi', label: 'Kelishildi' },
		{ value: 'tasdiqlandi', label: 'Tasdiqlandi' },
		{ value: 'rad_etildi', label: 'Rad etildi' },
	]

	const isTableLoading =
		isLoading || OptionTuzilmaLoader || OptionAplicationLoading || meLoading

	return (
		<div className='w-full space-y-4'>
			{/* ── TOOLBAR ─────────────────────────────────────────────────────── */}
			<div className='flex flex-col xl:flex-row w-full gap-3'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none' />
					<Input
						placeholder="Izoh bo'yicha qidiring..."
						className='pl-10 h-10 bg-card border-border/60 focus:border-primary/50 transition-colors'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</div>

				<div className='flex flex-wrap gap-2 items-center'>
					{/* Status filter */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='outline'
								size='sm'
								className='h-10 gap-2 border-border/60 bg-card hover:bg-muted/60 font-medium'
							>
								<Filter className='w-3.5 h-3.5' />
								{statusFilter ? statusConfig[statusFilter]?.label : 'Status'}
								<ChevronDown className='w-3.5 h-3.5 opacity-50' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='start'
							className='bg-card border-border/60 shadow-xl min-w-[160px]'
						>
							{statusFilterOptions.map(({ value, label }) => (
								<DropdownMenuItem
									key={value || 'all'}
									onClick={() => setStatusFilter(value)}
									className={cn(
										'cursor-pointer gap-2 rounded-md my-0.5 text-sm',
										statusFilter === value
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted/60',
									)}
								>
									{value && statusConfig[value] && (
										<span
											className={cn(
												'w-2 h-2 rounded-full',
												statusConfig[value].dot,
											)}
										/>
									)}
									{label}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Kimga filter */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='outline'
								size='sm'
								className='h-10 gap-2 border-border/60 bg-card hover:bg-muted/60 font-medium'
							>
								Kimga <ChevronDown className='w-3.5 h-3.5 opacity-50' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							align='start'
							className='bg-card border-border/60 shadow-xl max-h-60 overflow-y-auto'
						>
							<DropdownMenuItem
								onClick={() => setSortBy('')}
								className={cn(
									'cursor-pointer rounded-md my-0.5 text-sm',
									sortBy === ''
										? 'bg-primary text-primary-foreground'
										: 'hover:bg-muted/60',
								)}
							>
								Barchasi
							</DropdownMenuItem>
							{OptionTuzilma?.map(item => (
								<DropdownMenuItem
									key={item?.id}
									onClick={() => setSortBy(item?.tuzilma_nomi)}
									className={cn(
										'cursor-pointer rounded-md my-0.5 text-sm',
										sortBy === item?.tuzilma_nomi
											? 'bg-primary text-primary-foreground'
											: 'hover:bg-muted/60',
									)}
								>
									{item?.tuzilma_nomi}
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Ariza qo'shish toggle */}
					{show ? (
						<Button
							variant='destructive'
							size='sm'
							className='h-10 gap-2'
							onClick={() => {
								setShow(false)
								aplication_clear()
							}}
						>
							<X className='w-4 h-4' /> Yopish
						</Button>
					) : (
						<Button
							size='sm'
							className='h-10 gap-2 shadow-sm'
							onClick={() => setShow(true)}
						>
							<Plus className='w-4 h-4' /> Ariza qo'shish
						</Button>
					)}
				</div>
			</div>

			{/* ── FORM CARD ────────────────────────────────────────────────────── */}
			{show && (
				<Card className='w-full border-border/50 shadow-lg bg-card/95 backdrop-blur-sm'>
					<CardHeader className='border-b border-border/40 pb-4 pt-5 px-6'>
						<div className='flex items-center gap-3'>
							<div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
								<Send className='w-4 h-4 text-primary' />
							</div>
							<div>
								<CardTitle className='text-base font-semibold'>
									Xarid uchun ariza berish
								</CardTitle>
								<p className='text-xs text-muted-foreground mt-0.5'>
									Barcha bo'sh joylarni to'ldiring va xarid uchun arizani
									jo'nating
								</p>
							</div>
						</div>
					</CardHeader>

					<CardContent className='px-6 py-5'>
						<form className='space-y-5' onSubmit={e => e.preventDefault()}>
							{/* Tuzilmalar */}
							<div className='space-y-3'>
								<div>
									<Label className='text-sm font-semibold'>Tuzilmalar</Label>
									<p className='text-xs text-muted-foreground mt-0.5'>
										Bir nechta tuzilmalarni tanlashingiz mumkin
									</p>
								</div>
								<div className='relative'>
									<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none' />
									<Input
										placeholder='Tuzilma qidiring...'
										className='pl-9 h-9 text-sm bg-muted/40 border-border/50'
										value={structureSearch}
										onChange={e => setStructureSearch(e.target.value)}
									/>
								</div>
								<div className='flex flex-wrap gap-1.5'>
									{filteredStructures.length > 0 ? (
										filteredStructures
											.filter(
												item => item.tuzilma_nomi !== me?.tarkibiy_tuzilma,
											)
											.map(item => {
												const isSelected = form.targets.some(
													t => t.tuzilma === item.id,
												)
												return (
													<button
														key={item?.id}
														type='button'
														onClick={() => handleStructureToggle(item)}
														className={cn(
															'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
															isSelected
																? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
																: 'bg-muted/50 text-muted-foreground border-border/50 hover:border-primary/40 hover:text-foreground hover:bg-muted/80',
														)}
													>
														{item?.tuzilma_nomi}
													</button>
												)
											})
									) : (
										<p className='text-xs text-muted-foreground py-2'>
											Tuzilmalar topilmadi
										</p>
									)}
								</div>
								{form.targets.length > 0 && (
									<div className='flex items-center gap-1.5'>
										<CheckCircle2 className='w-3.5 h-3.5 text-emerald-500' />
										<p className='text-xs text-emerald-600 dark:text-emerald-400 font-medium'>
											{form.targets.length} ta tuzilma tanlangan
										</p>
									</div>
								)}
							</div>

							{/* Fayl */}
							<div className='space-y-2'>
								<Label className='text-sm font-semibold'>Fayl</Label>
								<label className='inline-flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-primary/30 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/60 transition-all'>
									<Upload size={15} className='text-primary/60 flex-shrink-0' />
									<span className='text-sm text-muted-foreground'>
										Fayl yuklash
									</span>
									<input
										type='file'
										className='hidden'
										accept='.pdf,.doc,.docx,.txt,.jpg,.png'
										onChange={handleBildirgiUpload}
									/>
								</label>
								{form.bildirgi && (
									<div className='inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium border border-emerald-500/20'>
										<FileCheck className='w-3.5 h-3.5' />
										{form.bildirgi.name}
									</div>
								)}
							</div>

							{/* Umumiy xabar */}
							<div className='space-y-2'>
								<Label className='text-sm font-semibold'>Umumiy xabar</Label>
								<Textarea
									placeholder='Xabaringizni yozing...'
									className='resize-none h-24 text-sm bg-card border-border/60'
									value={form.comment}
									onChange={e =>
										setForm(prev => ({ ...prev, comment: e.target.value }))
									}
								/>
							</div>

							{!isFormComplete() && (
								<div className='flex items-center gap-2.5 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg'>
									<AlertCircle className='w-4 h-4 text-amber-500 flex-shrink-0' />
									<p className='text-xs text-amber-600 dark:text-amber-400'>
										Tuzilma va umumiy xabar to'ldirilishi shart
									</p>
								</div>
							)}

							<div className='flex gap-2 pt-1'>
								<Button
									type='button'
									variant='outline'
									className='text-sm h-9 border-border/60 bg-transparent'
									onClick={() => {
										setShow(false)
										aplication_clear()
									}}
								>
									Bekor qilish
								</Button>
								{AplicationLoader ? (
									<Button className='flex-1 text-sm h-9' disabled>
										<Loader2 className='w-4 h-4 animate-spin mr-2' />{' '}
										Yuborilmoqda...
									</Button>
								) : (
									<Button
										type='button'
										className='flex-1 text-sm h-9 gap-2'
										disabled={!isFormComplete()}
										onClick={submitForm}
									>
										Jo'natish <Send className='w-3.5 h-3.5' />
									</Button>
								)}
							</div>
						</form>
					</CardContent>
				</Card>
			)}

			{/* ── TABLE ───────────────────────────────────────────────────────── */}
			<div className='border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40 border-border/40'>
							<TableHead className='w-[4%] text-xs font-semibold text-muted-foreground uppercase tracking-wide py-3 pl-4'>
								#
							</TableHead>
							<TableHead className='w-[20%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Tuzilmalar
							</TableHead>
							<TableHead className='w-[22%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Izoh
							</TableHead>
							<TableHead className='w-[12%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Status
							</TableHead>
							<TableHead className='w-[18%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Bosqichlar
							</TableHead>
							<TableHead className='w-[12%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Fayl
							</TableHead>
							<TableHead className='w-[12%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Sana
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isTableLoading ? (
							[...Array(8)].map((_, i) => (
								<TableRow key={i} className='border-border/30'>
									{[...Array(7)].map((_, j) => (
										<TableCell key={j} className='py-3'>
											<Skeleton className='h-4 w-full rounded-md' />
										</TableCell>
									))}
								</TableRow>
							))
						) : data?.results?.length > 0 ? (
							data.results.map((item, index) => (
								<TableRow
									key={item.id}
									className={cn(
										'border-border/30 transition-colors cursor-pointer',
										index % 2 === 0
											? 'bg-background/40 hover:bg-muted/30'
											: 'bg-background/70 hover:bg-muted/30',
									)}
								>
									{/* # */}
									<TableCell className='py-3 pl-4'>
										<span className='text-xs font-mono text-muted-foreground'>
											{(page - 1) * limit + index + 1}
										</span>
									</TableCell>

									{/* Tuzilmalar */}
									<TableCell className='py-3'>
										<div className='flex flex-wrap gap-1'>
											{item?.tuzilma_nomlari?.length ? (
												item.tuzilma_nomlari.map((name, i) => (
													<Badge
														key={i}
														variant='secondary'
														className='text-[10px] px-1.5 py-0.5 font-medium bg-muted/60'
													>
														{name}
													</Badge>
												))
											) : (
												<span className='text-muted-foreground/40 text-xs'>
													—
												</span>
											)}
										</div>
									</TableCell>

									{/* Izoh — CommentPopover */}
									<TableCell
										className='py-3'
										onClick={e => e.stopPropagation()}
									>
										<CommentPopover comment={item?.comment} />
									</TableCell>

									{/* Status */}
									<TableCell className='py-3'>
										<StatusBadge status={item.status} />
									</TableCell>

									{/* Bosqichlar */}
									<TableCell className='py-3'>
										<StepProgress
											steplar={item.steplar || []}
											tuzilma={item.tuzilmalar}
										/>
									</TableCell>

									{/* Fayl */}
									<TableCell
										className='py-3'
										onClick={e => e.stopPropagation()}
									>
										<FaylButton url={item.fayl} />
									</TableCell>

									{/* Sana */}
									<TableCell className='py-3'>
										<div className='flex flex-col gap-0.5'>
											<span className='text-xs font-medium text-foreground/80'>
												{item.sana
													? format(parseISO(item.sana), 'dd MMM yyyy', {
															locale: uz,
														})
													: '—'}
											</span>
											{item.sana && (
												<span className='text-[10px] text-muted-foreground'>
													{format(parseISO(item.sana), 'HH:mm')}
												</span>
											)}
										</div>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={7} className='py-16 text-center'>
									<EmptyOutline />
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* ── PAGINATION ──────────────────────────────────────────────────── */}
			{totalPages > 1 && (
				<div className='flex justify-center pt-1'>
					<Pagination>
						<PaginationContent>
							<PaginationPrevious
								onClick={() => setPage(Math.max(1, page - 1))}
								isActive={page === 1}
								className='cursor-pointer'
							/>
							{[...Array(totalPages)].map((_, index) => (
								<PaginationItem key={index}>
									<PaginationLink
										onClick={() => setPage(index + 1)}
										isActive={page === index + 1}
										className='cursor-pointer'
									>
										{index + 1}
									</PaginationLink>
								</PaginationItem>
							))}
							<PaginationNext
								onClick={() => setPage(Math.min(totalPages, page + 1))}
								isActive={page === totalPages}
								className='cursor-pointer'
							/>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	)
}
