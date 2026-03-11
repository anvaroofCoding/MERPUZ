import { EmptyOutline } from '@/components/Empty/not_found'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
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
	useOptionTuzilmaQuery,
	useXarid_tastiqlash_postMutation,
	useXarid_tastiqlash_putMutation,
	useXarid_tastiqlashQuery,
} from '@/services/api'
import { format, parseISO } from 'date-fns'
import { uz } from 'date-fns/locale'
import {
	CheckCircle2,
	ChevronDown,
	ExternalLink,
	FileText,
	Filter,
	Handshake,
	Loader2,
	MessageSquare,
	Search,
	Send,
	ShieldCheck,
	User,
	X,
	XCircle,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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

// ─── COMMENT POPOVER (portal, click-based) ────────────────────────────────────
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
			// viewport chiqib ketmasin
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
						{/* Arrow */}
						<div
							className='absolute -top-[5px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-card border-t border-l border-border rotate-45'
							style={{ marginLeft: 0 }}
						/>
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
												'w-9 h-9 rounded-full flex items-center justify-center ring-2 ring-background',
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

// ─── ODDIY ROL MODAL — POST ───────────────────────────────────────────────────
function QarorModal({ item, onClose, onSubmit, isLoading }) {
	const [qaror, setQaror] = useState('kelishildi')
	const [comment, setComment] = useState('')

	useEffect(() => {
		const h = e => e.key === 'Escape' && onClose()
		window.addEventListener('keydown', h)
		return () => window.removeEventListener('keydown', h)
	}, [onClose])

	const handleSubmit = () => {
		if (!comment.trim()) {
			toast.warning('Izoh yozish shart!')
			return
		}
		onSubmit({ status: qaror, comment: comment.trim() })
	}

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className='sm:max-w-md border-border/60 bg-card shadow-2xl'>
				<DialogHeader className='pb-2'>
					<DialogTitle className='text-base font-bold'>
						Qaror qabul qilish
					</DialogTitle>
					<p className='text-xs text-muted-foreground'>
						<span className='font-semibold text-foreground'>
							{item.kim_tomonidan_nomi}
						</span>{' '}
						tomonidan yuborilgan ariza
					</p>
				</DialogHeader>

				<div className='space-y-4'>
					{/* Ariza ma'lumotlari */}
					<div className='rounded-xl bg-muted/40 border border-border/40 overflow-hidden'>
						<div className='px-4 py-2.5 border-b border-border/40 bg-muted/30 flex flex-wrap gap-1'>
							{item.tuzilma_nomlari?.map((name, i) => (
								<Badge
									key={i}
									variant='secondary'
									className='text-[11px] px-2 py-0.5 bg-background/60'
								>
									{name}
								</Badge>
							))}
						</div>
						{item.comment && (
							<div className='px-4 py-3 max-h-28 overflow-y-auto'>
								<p className='text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap break-words'>
									{item.comment}
								</p>
							</div>
						)}
					</div>

					{/* Qaror */}
					<div className='space-y-2'>
						<Label className='text-sm font-semibold'>Qaroringiz</Label>
						<div className='grid grid-cols-2 gap-2'>
							<button
								type='button'
								onClick={() => setQaror('kelishildi')}
								className={cn(
									'flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
									qaror === 'kelishildi'
										? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
										: 'border-border/50 text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-600',
								)}
							>
								<CheckCircle2 className='w-4 h-4' /> Kelishildi
							</button>
							<button
								type='button'
								onClick={() => setQaror('rad_etildi')}
								className={cn(
									'flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
									qaror === 'rad_etildi'
										? 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-400'
										: 'border-border/50 text-muted-foreground hover:border-red-500/40 hover:text-red-600',
								)}
							>
								<XCircle className='w-4 h-4' /> Rad etildi
							</button>
						</div>
					</div>

					{/* Izoh */}
					<div className='space-y-2'>
						<Label className='text-sm font-semibold'>
							Izoh <span className='text-red-500'>*</span>
						</Label>
						<Textarea
							placeholder='Qaroringiz sababini yozing...'
							className='resize-none h-28 text-sm bg-muted/40 border-border/60'
							value={comment}
							onChange={e => setComment(e.target.value)}
							autoFocus
						/>
					</div>

					<div className='flex gap-2'>
						<Button
							type='button'
							variant='outline'
							className='flex-1 h-9 text-sm'
							onClick={onClose}
						>
							Bekor qilish
						</Button>
						{isLoading ? (
							<Button className='flex-1 h-9 text-sm' disabled>
								<Loader2 className='w-4 h-4 animate-spin mr-1.5' />
								Yuborilmoqda...
							</Button>
						) : (
							<Button
								type='button'
								onClick={handleSubmit}
								className={cn(
									'flex-1 h-9 text-sm gap-1.5',
									qaror === 'rad_etildi'
										? 'bg-red-500 hover:bg-red-600 text-white'
										: 'bg-emerald-500 hover:bg-emerald-600 text-white',
								)}
							>
								{qaror === 'kelishildi' ? (
									<>
										<CheckCircle2 className='w-4 h-4' />
										Kelishildi
									</>
								) : (
									<>
										<XCircle className='w-4 h-4' />
										Rad etildi
									</>
								)}
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

// ─── MONITORING MODAL — PUT ───────────────────────────────────────────────────
// Body: { tuzilmalar: [...all ids], comment, status }
// tuzilmalarni orqa tarafga HAMMASI berib yuboriladi, tanlash yo'q
function MonitoringQarorModal({ item, onClose, onSubmit, isLoading }) {
	const [qaror, setQaror] = useState('tasdiqlandi')
	const [comment, setComment] = useState('')

	useEffect(() => {
		const h = e => e.key === 'Escape' && onClose()
		window.addEventListener('keydown', h)
		return () => window.removeEventListener('keydown', h)
	}, [onClose])

	const handleSubmit = () => {
		if (!comment.trim()) {
			toast.warning('Izoh yozish shart!')
			return
		}
		// Barcha tuzilmalarni yuborish — foydalanuvchi tanlashiga shart yo'q
		onSubmit({
			tuzilmalar: item.tuzilmalar || [],
			comment: comment.trim(),
			status: qaror,
		})
	}

	return (
		<Dialog open onOpenChange={onClose}>
			<DialogContent className='sm:max-w-md border-border/60 bg-card shadow-2xl'>
				<DialogHeader className='pb-2'>
					<div className='flex items-center gap-2.5'>
						<div className='w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0'>
							<ShieldCheck className='w-4 h-4 text-amber-500' />
						</div>
						<div>
							<DialogTitle className='text-base font-bold'>
								Monitoring qaror
							</DialogTitle>
							<p className='text-xs text-muted-foreground'>
								<span className='font-semibold text-foreground'>
									{item.kim_tomonidan_nomi}
								</span>{' '}
								tomonidan yuborilgan ariza
							</p>
						</div>
					</div>
				</DialogHeader>

				<div className='space-y-4'>
					{/* Ariza tuzilmalari + izohi */}
					<div className='rounded-xl bg-muted/40 border border-border/40 overflow-hidden'>
						<div className='px-4 py-2.5 border-b border-border/40 bg-muted/30 flex flex-wrap gap-1'>
							{item.tuzilma_nomlari?.map((name, i) => (
								<Badge
									key={i}
									variant='secondary'
									className='text-[11px] px-2 py-0.5 bg-background/60'
								>
									{name}
								</Badge>
							))}
						</div>
						{item.comment && (
							<div className='px-4 py-3 max-h-28 overflow-y-auto'>
								<p className='text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap break-words'>
									{item.comment}
								</p>
							</div>
						)}
					</div>

					{/* Qaror */}
					<div className='space-y-2'>
						<Label className='text-sm font-semibold'>Qaroringiz</Label>
						<div className='grid grid-cols-2 gap-2'>
							<button
								type='button'
								onClick={() => setQaror('tasdiqlandi')}
								className={cn(
									'flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
									qaror === 'tasdiqlandi'
										? 'bg-emerald-500/15 border-emerald-500 text-emerald-600 dark:text-emerald-400'
										: 'border-border/50 text-muted-foreground hover:border-emerald-500/40 hover:text-emerald-600',
								)}
							>
								<CheckCircle2 className='w-4 h-4' /> Tasdiqlandi
							</button>
							<button
								type='button'
								onClick={() => setQaror('rad_etildi')}
								className={cn(
									'flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all',
									qaror === 'rad_etildi'
										? 'bg-red-500/15 border-red-500 text-red-600 dark:text-red-400'
										: 'border-border/50 text-muted-foreground hover:border-red-500/40 hover:text-red-600',
								)}
							>
								<XCircle className='w-4 h-4' /> Rad etildi
							</button>
						</div>
					</div>

					{/* Izoh */}
					<div className='space-y-2'>
						<Label className='text-sm font-semibold'>
							Izoh <span className='text-red-500'>*</span>
						</Label>
						<Textarea
							placeholder='Qaroringiz sababini yozing...'
							className='resize-none h-28 text-sm bg-muted/40 border-border/60'
							value={comment}
							onChange={e => setComment(e.target.value)}
							autoFocus
						/>
					</div>

					<div className='flex gap-2'>
						<Button
							type='button'
							variant='outline'
							className='flex-1 h-9 text-sm'
							onClick={onClose}
						>
							Bekor qilish
						</Button>
						{isLoading ? (
							<Button className='flex-1 h-9 text-sm' disabled>
								<Loader2 className='w-4 h-4 animate-spin mr-1.5' />
								Yuborilmoqda...
							</Button>
						) : (
							<Button
								type='button'
								onClick={handleSubmit}
								className={cn(
									'flex-1 h-9 text-sm gap-1.5',
									qaror === 'rad_etildi'
										? 'bg-red-500 hover:bg-red-600 text-white'
										: 'bg-emerald-500 hover:bg-emerald-600 text-white',
								)}
							>
								{qaror === 'tasdiqlandi' ? (
									<>
										<ShieldCheck className='w-4 h-4' />
										Tasdiqlash
									</>
								) : (
									<>
										<XCircle className='w-4 h-4' />
										Rad etish
									</>
								)}
							</Button>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function XaridTastiqlash() {
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('')
	const [sortBy, setSortBy] = useState('')
	const [page, setPage] = useState(1)
	const limit = 50
	const [totalPages, setTotalPages] = useState(1)
	const [selectedItem, setSelectedItem] = useState(null)

	const { data: me } = useMEQuery()
	const isMonitoring = me?.role === 'monitoring'

	const { data, isLoading, total_pages } = useXarid_tastiqlashQuery({
		page,
		limit,
		search: searchTerm,
		status: statusFilter,
		tuzilma_nomi: sortBy,
	})

	const [xaridTastiqlashPost, { isLoading: postLoading }] =
		useXarid_tastiqlash_postMutation()
	const [xaridTastiqlashPut, { isLoading: putLoading }] =
		useXarid_tastiqlash_putMutation()
	const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
		useOptionTuzilmaQuery()

	useEffect(() => {
		if (total_pages) setTotalPages(total_pages)
	}, [total_pages])

	const handleQaror = async ({ status, comment }) => {
		try {
			await xaridTastiqlashPost({
				id: selectedItem.id,
				body: { status, comment },
			}).unwrap()
			toast.success(
				status === 'kelishildi' ? 'Kelishildi deb belgilandi!' : 'Rad etildi!',
			)
			setSelectedItem(null)
		} catch (err) {
			toast.error(err?.data?.error || err?.data?.detail || 'Xatolik yuz berdi!')
		}
	}

	const handleMonitoringQaror = async ({ tuzilmalar, comment, status }) => {
		try {
			await xaridTastiqlashPut({
				id: selectedItem.id,
				body: { tuzilmalar, comment, status },
			}).unwrap()
			toast.success(status === 'tasdiqlandi' ? 'Tasdiqlandi!' : 'Rad etildi!')
			setSelectedItem(null)
		} catch (err) {
			toast.error(err?.data?.error || err?.data?.detail || 'Xatolik yuz berdi!')
		}
	}

	const canDecide = item => {
		if (isMonitoring)
			return item.status === 'kelishildi' || item.status === 'yuborildi'
		return item.status === 'yuborildi'
	}

	const statusFilterOptions = [
		{ value: '', label: 'Barchasi' },
		{ value: 'yuborildi', label: 'Yuborildi' },
		{ value: 'kelishildi', label: 'Kelishildi' },
		{ value: 'tasdiqlandi', label: 'Tasdiqlandi' },
		{ value: 'rad_etildi', label: 'Rad etildi' },
	]

	const isTableLoading = isLoading || OptionTuzilmaLoader

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

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='outline'
								size='sm'
								className='h-10 gap-2 border-border/60 bg-card hover:bg-muted/60 font-medium'
							>
								Kimdan <ChevronDown className='w-3.5 h-3.5 opacity-50' />
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
				</div>
			</div>

			{/* ── TABLE ───────────────────────────────────────────────────────── */}
			<div className='border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40 border-border/40'>
							<TableHead className='w-[4%] text-xs font-semibold text-muted-foreground uppercase tracking-wide py-3 pl-4'>
								#
							</TableHead>
							<TableHead className='w-[11%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Kim yubordi
							</TableHead>
							<TableHead className='w-[16%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Tuzilmalar
							</TableHead>
							<TableHead className='w-[22%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Izoh
							</TableHead>
							<TableHead className='w-[11%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Status
							</TableHead>
							<TableHead className='w-[14%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Bosqichlar
							</TableHead>
							<TableHead className='w-[10%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Fayl
							</TableHead>
							<TableHead className='w-[8%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Sana
							</TableHead>
							<TableHead className='w-[4%]'></TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isTableLoading ? (
							[...Array(8)].map((_, i) => (
								<TableRow key={i} className='border-border/30'>
									{[...Array(9)].map((_, j) => (
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
										'border-border/30 transition-colors',
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

									{/* Kim yubordi */}
									<TableCell className='py-3'>
										<div className='flex items-center gap-1.5'>
											<div className='w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0'>
												<User className='w-3 h-3 text-primary' />
											</div>
											<span className='text-xs font-semibold text-foreground/80 truncate max-w-[90px]'>
												{item.kim_tomonidan_nomi || '—'}
											</span>
										</div>
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

									{/* Izoh — popover on click */}
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

									{/* Qaror */}
									<TableCell
										className='py-3'
										onClick={e => e.stopPropagation()}
									>
										{canDecide(item) ? (
											<Button
												size='sm'
												variant='ghost'
												onClick={() => setSelectedItem(item)}
												className={cn(
													'h-8 px-3 text-xs font-semibold gap-1.5 transition-all whitespace-nowrap',
													isMonitoring
														? 'text-amber-600 dark:text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-white hover:border-amber-500'
														: 'text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground',
												)}
											>
												{isMonitoring ? (
													<>
														<ShieldCheck className='w-3.5 h-3.5' />
														Qaror
													</>
												) : (
													<>
														<CheckCircle2 className='w-3.5 h-3.5' />
														Qaror
													</>
												)}
											</Button>
										) : (
											<span className='text-[10px] text-muted-foreground/40'>
												—
											</span>
										)}
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={9} className='py-16 text-center'>
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

			{/* ── MODAL ────────────────────────────────────────────────────────── */}
			{selectedItem &&
				(isMonitoring ? (
					<MonitoringQarorModal
						item={selectedItem}
						onClose={() => setSelectedItem(null)}
						onSubmit={handleMonitoringQaror}
						isLoading={putLoading}
					/>
				) : (
					<QarorModal
						item={selectedItem}
						onClose={() => setSelectedItem(null)}
						onSubmit={handleQaror}
						isLoading={postLoading}
					/>
				))}
		</div>
	)
}
