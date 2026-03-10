import { EmptyOutline } from '@/components/Empty/not_found'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
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
import { cn } from '@/lib/utils'
import {
	useComing_AplicationQuery,
	useOptionAplicationQuery,
	useOptionTuzilmaQuery,
} from '@/services/api'
import {
	CheckCircle2,
	ChevronDown,
	Clock,
	Eye,
	Filter,
	Loader2,
	RotateCcw,
	Search,
	Shield,
	XCircle,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// ─── STATUS CONFIG ─────────────────────────────────────────────────────────────
const statusConfig = {
	jarayonda: {
		label: 'Jarayonda',
		icon: Clock,
		className:
			'bg-amber-500/15 text-amber-400 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
		dot: 'bg-amber-400',
	},
	bajarilmoqda: {
		label: 'Bajarilmoqda',
		icon: Loader2,
		className:
			'bg-blue-500/15 text-blue-400 border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
		dot: 'bg-blue-400',
		spin: true,
	},
	tasdiqlanmoqda: {
		label: 'Tasdiqlanmoqda',
		icon: Shield,
		className:
			'bg-violet-500/15 text-violet-400 border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20',
		dot: 'bg-violet-400',
	},
	rad_etildi: {
		label: 'Rad etildi',
		icon: XCircle,
		className:
			'bg-red-500/15 text-red-400 border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
		dot: 'bg-red-400',
	},
	bajarilgan: {
		label: 'Bajarilgan',
		icon: CheckCircle2,
		className:
			'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
		dot: 'bg-emerald-400',
	},
	qaytarildi: {
		label: 'Qaytarildi',
		icon: RotateCcw,
		className:
			'bg-orange-500/15 text-orange-400 border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
		dot: 'bg-orange-400',
	},
}

// ─── STATUS BADGE COMPONENT ────────────────────────────────────────────────────
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
			<Icon className={cn('w-3.5 h-3.5', config.spin && 'animate-spin')} />
			{config.label}
		</span>
	)
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function Coming_Applications() {
	const [searchTerm, setSearchTerm] = useState('')
	const [statusFilter, setStatusFilter] = useState('')
	const [sortBy, setSortBy] = useState('')
	const navigate = useNavigate()
	const [page, setPage] = useState(1)
	const limit = 50
	const [totalPages, setTotalPages] = useState(1)

	const { data, isLoading, total_pages } = useComing_AplicationQuery({
		page,
		limit,
		search: searchTerm,
		status: statusFilter,
		tuzilma_nomi: sortBy,
	})
	const { data: OptionAplications, isLoading: OptionAplicationLoading } =
		useOptionAplicationQuery()
	const { data: OptionTuzilma, isLoading: OptionTuzilmaLoader } =
		useOptionTuzilmaQuery()

	useEffect(() => {
		if (total_pages) setTotalPages(total_pages)
	}, [total_pages])

	const statusFilterOptions = [
		{ value: '', label: 'Barchasi' },
		{ value: 'jarayonda', label: 'Jarayonda' },
		{ value: 'bajarilmoqda', label: 'Bajarilmoqda' },
		{ value: 'tasdiqlanmoqda', label: 'Tasdiqlanmoqda' },
		{ value: 'rad_etildi', label: 'Rad etildi' },
		{ value: 'bajarilgan', label: 'Bajarilgan' },
		{ value: 'qaytarildi', label: 'Qaytarildi' },
	]

	return (
		<div className='w-full space-y-4'>
			{/* ── TOOLBAR ─────────────────────────────────────────────────────── */}
			<div className='flex flex-col xl:flex-row w-full gap-3'>
				{/* Search */}
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
					{/* Status Filter */}
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

					{/* Kimga Filter */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant='outline'
								size='sm'
								className='h-10 gap-2 border-border/60 bg-card hover:bg-muted/60 font-medium'
							>
								Kimdan
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
				</div>
			</div>

			{/* ── TABLE ───────────────────────────────────────────────────────── */}
			<div className='border border-border/50 rounded-xl bg-card shadow-sm overflow-hidden'>
				<Table>
					<TableHeader>
						<TableRow className='bg-muted/40 hover:bg-muted/40 border-border/40'>
							<TableHead className='w-[22%] text-xs font-semibold text-muted-foreground uppercase tracking-wide py-3'>
								Ariza beruvchi
							</TableHead>
							<TableHead className='w-[18%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Yaratuvchi
							</TableHead>
							<TableHead className='w-[12%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Turi
							</TableHead>
							<TableHead className='w-[16%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Status
							</TableHead>
							<TableHead className='w-[27%] text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Izoh
							</TableHead>
							<TableHead className='w-[5%] text-right text-xs font-semibold text-muted-foreground uppercase tracking-wide'>
								Ko'rish
							</TableHead>
						</TableRow>
					</TableHeader>

					<TableBody>
						{isLoading || OptionTuzilmaLoader || OptionAplicationLoading ? (
							[...Array(10)].map((_, i) => (
								<TableRow key={i} className='border-border/30'>
									{[...Array(6)].map((_, j) => (
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
									{/* Ariza beruvchi */}
									<TableCell className='py-3'>
										<div className='flex items-center gap-2.5'>
											{item?.kim_tomonidan?.photo ? (
												<img
													src={item.kim_tomonidan.photo}
													alt={item.kim_tomonidan.name}
													className='w-8 h-8 rounded-full object-cover ring-2 ring-border/40 flex-shrink-0'
												/>
											) : (
												<div className='w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm uppercase flex-shrink-0 ring-2 ring-border/30'>
													{item?.kim_tomonidan?.name?.charAt(0) || '?'}
												</div>
											)}
											<span className='text-sm font-medium truncate'>
												{item?.kim_tomonidan?.name || '—'}
											</span>
										</div>
									</TableCell>

									{/* Yaratuvchi */}
									<TableCell className='py-3 text-sm text-muted-foreground'>
										{item?.created_by || '—'}
									</TableCell>

									{/* Turi */}
									<TableCell className='py-3'>
										<span
											className={cn(
												'text-xs font-medium px-2 py-1 rounded-md',
												item?.turi === 'ijro'
													? 'bg-blue-500/10 text-blue-500 dark:text-blue-400'
													: 'bg-muted/60 text-muted-foreground',
											)}
										>
											{item?.turi === 'ijro' ? 'Ijro' : "Ma'lumot"}
										</span>
									</TableCell>

									{/* Status */}
									<TableCell className='py-3'>
										<StatusBadge status={item.status} />
									</TableCell>

									{/* Izoh */}
									<TableCell className='py-3 text-sm text-muted-foreground max-w-[200px]'>
										<span className='line-clamp-2 leading-relaxed'>
											{item?.comment
												? item.comment.length > 70
													? item.comment.slice(0, 70) + '...'
													: item.comment
												: '—'}
										</span>
									</TableCell>

									{/* Ko'rish */}
									<TableCell className='py-3 text-right'>
										<Button
											variant='ghost'
											size='icon'
											className='h-8 w-8 hover:bg-primary/10 hover:text-primary transition-colors'
											onClick={() => {
												navigate(`${item?.created_by}/${item?.id}`)
											}}
										>
											<Eye className='w-4 h-4' />
										</Button>
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={6} className='py-16 text-center'>
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
