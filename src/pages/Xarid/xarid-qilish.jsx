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
	Plus,
	Search,
	Send,
	Upload,
	X,
	XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

// ─── STATUS CONFIG — faqat backend statuslari ─────────────────────────────────
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
	if (!config) {
		return (
			<span className='inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-muted/50 text-muted-foreground border-border'>
				<span className='w-1.5 h-1.5 rounded-full bg-muted-foreground' />
				{status || "Noma'lum"}
			</span>
		)
	}
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

// ─── STEP PROGRESS ─────────────────────────────────────────────────────────────
// step.status: yuborildi | kelishildi | tasdiqlandi | rad_etildi
function StepProgress({ steplar = [], tuzilma = [] }) {
	const tuzimaLength = tuzilma.length
	const total = tuzimaLength || steplar.length

	const hasRad = steplar.some(s => s.status === 'rad_etildi')

	const doneCount = steplar.filter(
		s => s.status === 'kelishildi' || s.status === 'tasdiqlandi',
	).length

	const pct = total ? Math.round((doneCount / total) * 100) : 0

	const dotStyle = s => {
		if (s.status === 'tasdiqlandi' || s.status === 'kelishildi')
			return 'bg-emerald-500 ring-emerald-500/30'
		if (s.status === 'rad_etildi') return 'bg-red-500 ring-red-500/30'
		return 'bg-muted border border-border ring-border/20'
	}

	if (!steplar.length)
		return (
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
		)

	return (
		<div className='flex flex-col gap-1.5 min-w-[110px]'>
			{/* Bar + raqam */}
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

			{/* Dot-lar */}
			<div className='flex items-center gap-1'>
				{steplar.map((s, i) => (
					<div key={s.id ?? i} className='relative group/dot'>
						{/* Dot */}
						<div
							className={cn(
								'w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-background transition-all duration-150 group-hover/dot:scale-110',
								dotStyle(s),
							)}
						>
							{(s.status === 'kelishildi' || s.status === 'tasdiqlandi') && (
								<CheckCircle2 className='w-3 h-3 text-white' />
							)}
							{s.status === 'rad_etildi' && (
								<XCircle className='w-3 h-3 text-white' />
							)}
						</div>

						{/* Hover tooltip — yuqoriga chiqadi */}
						<div className='absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 z-50 pointer-events-none opacity-0 group-hover/dot:opacity-100 transition-opacity duration-150'>
							<div className='bg-popover border border-border rounded-xl shadow-xl px-3 py-2.5 text-left w-max max-w-[200px]'>
								{/* Tuzilma + user */}
								<p className='text-[12px] font-bold text-foreground leading-tight'>
									{s.tuzilma_nomi}
								</p>
								<p className='text-[10px] text-muted-foreground mt-0.5'>
									{s.user_nomi}
								</p>

								{/* Comment */}
								{s.comment && (
									<p className='text-[10px] text-foreground/70 mt-1.5 leading-relaxed line-clamp-3 border-t border-border/40 pt-1.5'>
										{s.comment}
									</p>
								)}

								{/* Status chip */}
								<div className='mt-2 flex items-center gap-1'>
									{s.status === 'rad_etildi' && (
										<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-[10px] font-semibold text-red-600 dark:text-red-400'>
											<XCircle className='w-2.5 h-2.5' />
											Rad etildi
										</span>
									)}
									{(s.status === 'kelishildi' ||
										s.status === 'tasdiqlandi') && (
										<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400'>
											<CheckCircle2 className='w-2.5 h-2.5' />
											{statusConfig[s.status]?.label}
										</span>
									)}
									{s.status === 'yuborildi' && (
										<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/15 border border-blue-500/30 text-[10px] font-semibold text-blue-600 dark:text-blue-400'>
											<Send className='w-2.5 h-2.5' />
											Yuborildi
										</span>
									)}
								</div>

								{/* Sana */}
								{s.sana && (
									<p className='text-[9px] text-muted-foreground/60 mt-1.5'>
										{format(parseISO(s.sana), 'dd MMM yyyy, HH:mm', {
											locale: uz,
										})}
									</p>
								)}

								{/* Arrow */}
								<div className='absolute top-full left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-popover border-b border-r border-border rotate-45 -mt-[5px]' />
							</div>
						</div>
					</div>
				))}

				{/* Rad etildi warning chip — dots yonida */}
				{hasRad && (
					<span className='inline-flex items-center gap-1 ml-1 px-1.5 py-0.5 rounded-md bg-red-500/10 border border-red-500/25 text-[9px] font-bold text-red-600 dark:text-red-400 whitespace-nowrap'>
						<XCircle className='w-2.5 h-2.5' />
						Rad
					</span>
				)}
			</div>
		</div>
	)
}

// ─── FAYL BUTTON ───────────────────────────────────────────────────────────────
function FaylButton({ url }) {
	if (!url) return <span className='text-muted-foreground text-sm'>—</span>
	const filename = url.split('/').pop()
	return (
		<a
			href={url}
			target='_blank'
			rel='noopener noreferrer'
			onClick={e => e.stopPropagation()}
			className='inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-colors max-w-[130px]'
		>
			<FileText className='w-3 h-3 flex-shrink-0' />
			<span className='truncate'>{filename}</span>
			<ExternalLink className='w-2.5 h-2.5 flex-shrink-0 opacity-60' />
		</a>
	)
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function XaridQilish() {
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('')
	const [sortBy, setSortBy] = useState('')
	const navigate = useNavigate()
	const [page, setPage] = useState(1)
	const limit = 50
	const [show, setShow] = useState(false)
	const [structureSearch, setStructureSearch] = useState('')
	const [totalPages, setTotalPages] = useState(1)
	const [form, setForm] = useState({
		comment: '',
		targets: [],
		bildirgi: '',
	})
	const aplication_clear = () => {
		setForm({
			comment: '',
			targets: [],
			bildirgi: '',
		})
	}
	const handleBildirgiUpload = e => {
		const file = e.target.files[0]
		if (file) setForm({ ...form, bildirgi: file })
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
	const filteredStructures =
		OptionTuzilma?.filter(item =>
			item?.tuzilma_nomi.toLowerCase().includes(structureSearch.toLowerCase()),
		) || []
	const isFormComplete = () =>
		form.comment.trim() !== '' && form.targets.length > 0
	const submitForm = async () => {
		const fd = new FormData()

		fd.append('comment', form.comment)

		form.targets.forEach(item => {
			fd.append('tuzilmalar', item.tuzilma)
		})

		if (form.bildirgi) fd.append('fayl', form.bildirgi)

		await toast.promise(xarid_post(fd).unwrap(), {
			loading: 'Yuborilmoqda...',
			success: 'Yuborildi!',
			error: 'Xatolik!',
		})

		setShow(false)
		aplication_clear()
	}
	const handleSubmit = async e => {
		e.preventDefault()
	}
	useEffect(() => {
		if (isError) {
			if (error?.data?.comment) {
				toast.error(error?.data?.comment[0])
				aplication_clear()
			}
			if (error?.data?.fayl) {
				toast.error(error?.data?.fayl[0])
				aplication_clear()
			}
			if (error?.data?.message) {
				toast.error(error?.data?.message[0])
				aplication_clear()
			}
		}
	}, [isError, error])

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
								Kimga
								<ChevronDown className='w-3.5 h-3.5 opacity-50' />
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
							<X className='w-4 h-4' />
							Yopish
						</Button>
					) : (
						<Button
							size='sm'
							className='h-10 gap-2 shadow-sm'
							onClick={() => setShow(true)}
						>
							<Plus className='w-4 h-4' />
							Ariza qo'shish
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
						<form className='space-y-5' onSubmit={handleSubmit}>
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
								<div className='flex gap-2 overflow-x-auto pb-1'>
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
															'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all flex-shrink-0 border',
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
									onChange={e => setForm({ ...form, comment: e.target.value })}
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
										<Loader2 className='w-4 h-4 animate-spin mr-2' />
										Yuborilmoqda...
									</Button>
								) : (
									<Button
										type='submit'
										className='flex-1 text-sm h-9 gap-2'
										disabled={!isFormComplete()}
										onClick={submitForm}
									>
										Jo'natish
										<Send className='w-3.5 h-3.5' />
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
							<TableHead className='w-[5%] text-xs font-semibold text-muted-foreground uppercase tracking-wide py-3 pl-4'>
								#
							</TableHead>
							<TableHead className='w-[20%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Tuzilmalar
							</TableHead>
							<TableHead className='w-[23%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Izoh
							</TableHead>
							<TableHead className='w-[13%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Status
							</TableHead>
							<TableHead className='w-[18%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Bosqichlar
							</TableHead>
							<TableHead className='w-[12%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Fayl
							</TableHead>
							<TableHead className='w-[9%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
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
									onClick={() => navigate(`${item.id}`)}
									className={cn(
										'border-border/30 transition-colors cursor-pointer',
										index % 2 === 0
											? 'bg-background/40 hover:bg-muted/30'
											: 'bg-background/70 hover:bg-muted/30',
									)}
								>
									<TableCell className='py-3 pl-4'>
										<span className='text-xs font-mono text-muted-foreground'>
											{(page - 1) * limit + index + 1}
										</span>
									</TableCell>

									<TableCell className='py-3'>
										<div className='flex flex-wrap gap-1'>
											{item?.tuzilma_nomlari?.length ? (
												item.tuzilma_nomlari.map((name, i) => (
													<Badge
														key={i}
														variant='secondary'
														className='text-[11px] px-2 py-0.5 font-medium bg-muted/60'
													>
														{name}
													</Badge>
												))
											) : (
												<span className='text-muted-foreground text-sm'>—</span>
											)}
										</div>
									</TableCell>

									<TableCell className='py-3 max-w-[200px]'>
										<span className='text-sm text-muted-foreground line-clamp-2 leading-relaxed'>
											{item?.comment
												? item.comment.length > 80
													? item.comment.slice(0, 80) + '...'
													: item.comment
												: '—'}
										</span>
									</TableCell>

									<TableCell className='py-3'>
										<StatusBadge status={item.status} />
									</TableCell>

									<TableCell className='py-3'>
										<StepProgress
											steplar={item.steplar || []}
											tuzilma={item.tuzilmalar}
										/>
									</TableCell>

									<TableCell
										className='py-3'
										onClick={e => e.stopPropagation()}
									>
										<FaylButton url={item.fayl} />
									</TableCell>

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
