import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useKelganQuery } from '@/services/api'
import {
	Bell,
	Calendar,
	ChevronLeft,
	ChevronRight,
	Clock,
	FileText,
	User,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const MONTHS = [
	'Yanvar',
	'Fevral',
	'Mart',
	'Aprel',
	'May',
	'Iyun',
	'Iyul',
	'Avgust',
	'Sentabr',
	'Oktabr',
	'Noyabr',
	'Dekabr',
]
const WEEK_DAYS = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']

// Status bo'yicha rang
function getStatusColor(status) {
	switch (status) {
		case 'bajarilgan':
			return 'green'
		case 'bajarilmoqda':
			return 'blue'
		case 'tasdiqlanmoqda':
			return 'yellow'
		case 'jarayonda':
			return 'orange'
		case 'qaytarildi':
			return 'red'
		default:
			return 'gray'
	}
}

const STATUS_STYLES = {
	green: {
		dot: 'bg-green-500 dark:bg-green-400',
		badge:
			'bg-green-100 text-green-700 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700',
	},
	blue: {
		dot: 'bg-blue-500 dark:bg-blue-400',
		badge:
			'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700',
	},
	yellow: {
		dot: 'bg-yellow-400 dark:bg-yellow-300',
		badge:
			'bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-700',
	},
	orange: {
		dot: 'bg-orange-400 dark:bg-orange-300',
		badge:
			'bg-orange-100 text-orange-700 border-orange-300 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-700',
	},
	red: {
		dot: 'bg-red-500 dark:bg-red-400',
		badge:
			'bg-red-100 text-red-700 border-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-700',
	},
	gray: {
		dot: 'bg-gray-400 dark:bg-gray-500',
		badge:
			'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600',
	},
}

const STATUS_LABELS = {
	bajarildi: 'Bajaarilgan',
	bajarilmoqda: 'Bajarilmoqda',
	tasdiqlanmoqda: 'Tasdiqlanmoqda',
	jarayonda: 'Jarayonda',
	qaytarildi: 'Qaytarildi',
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function CalendarSkeleton() {
	return (
		<div className='w-full h-full flex flex-col gap-4 p-4'>
			<div className='flex items-center justify-between'>
				<Skeleton className='h-9 w-9 rounded-xl' />
				<div className='flex flex-col items-center gap-1.5'>
					<Skeleton className='h-5 w-36 rounded-lg' />
					<Skeleton className='h-3 w-24 rounded' />
				</div>
				<Skeleton className='h-9 w-9 rounded-xl' />
			</div>
			<div className='grid grid-cols-7 gap-2'>
				{Array(7)
					.fill(0)
					.map((_, i) => (
						<Skeleton key={i} className='h-4 rounded' />
					))}
			</div>
			<div className='grid grid-cols-7 gap-2 flex-1'>
				{Array(35)
					.fill(0)
					.map((_, i) => (
						<Skeleton key={i} className='aspect-square rounded-xl' />
					))}
			</div>
			<div className='flex justify-center gap-4 pt-2 border-t border-border'>
				{Array(4)
					.fill(0)
					.map((_, i) => (
						<Skeleton key={i} className='h-4 w-20 rounded' />
					))}
			</div>
		</div>
	)
}

// ─── PPR Card ─────────────────────────────────────────────────────────────────
function PPRCard({ item }) {
	const color = getStatusColor(item.status)
	const style = STATUS_STYLES[color]

	return (
		<Link
			to={`/Kelgan-Arizalar/Arizalar/Kelgan Arizalar/${item.created_by}/${item.id}`}
			target='_blank'
			className='block'
		>
			<div
				className={cn(
					'rounded-2xl border p-4 transition-colors',
					'bg-card dark:bg-card border-border',
				)}
			>
				{/* Top row */}
				<div className='flex items-start justify-between gap-2 mb-3'>
					<div className='flex items-center gap-2 min-w-0'>
						<div
							className={cn(
								'w-2 h-2 rounded-full flex-shrink-0 mt-1',
								style.dot,
							)}
						/>
						<p className='font-semibold text-sm text-foreground leading-snug'>
							#{item.id} — {item.comment}
						</p>
					</div>
					<Badge
						className={cn(
							'text-[10px] px-2 py-0 h-5 flex-shrink-0 rounded-full border font-medium',
							style.badge,
						)}
					>
						{STATUS_LABELS[item.status] || item.status}
					</Badge>
				</div>

				{/* Meta info */}
				<div className='flex flex-col gap-1.5'>
					<div className='flex items-center gap-1.5 text-muted-foreground'>
						<User size={11} />
						<span className='text-[11px]'>
							{item.created_by} → {item.kim_tomonidan?.name}
						</span>
					</div>

					{item.turi && (
						<div className='flex items-center gap-1.5 text-muted-foreground'>
							<FileText size={11} />
							<span className='text-[11px] capitalize'>{item.turi}</span>
						</div>
					)}

					{item.ijro_muddati && (
						<div className='flex items-center gap-1.5 text-muted-foreground'>
							<Clock size={11} />
							<span className='text-[11px]'>Muddat: {item.ijro_muddati}</span>
						</div>
					)}

					{item.extra_comment ? (
						<p className='text-[11px] text-muted-foreground mt-1 italic'>
							{item.extra_comment}
						</p>
					) : null}
				</div>
			</div>
		</Link>
	)
}

export default function PPRCalendar() {
	const { data: pprData, isLoading } = useKelganQuery()
	const today = new Date()
	const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

	const [currentDate, setCurrentDate] = useState(
		new Date(today.getFullYear(), today.getMonth(), 1),
	)
	const [sheetOpen, setSheetOpen] = useState(false)
	const [selectedDay, setSelectedDay] = useState(null)

	const year = currentDate.getFullYear()
	const month = currentDate.getMonth()

	// ── dateMap: "YYYY-MM-DD" → [ppr items] ──────────────────────────────────
	const dateMap = useMemo(() => {
		const map = new Map()
		pprData?.results?.forEach(item => {
			if (!item.ijro_muddati) return
			const key = item.ijro_muddati // "06-03-2026" → "2026-03-06"
			if (!map.has(key)) map.set(key, [])
			map.get(key).push(item)
		})
		return map
	}, [pprData])

	// ── Grid ─────────────────────────────────────────────────────────────────
	const daysInMonth = new Date(year, month + 1, 0).getDate()
	const firstDay = new Date(year, month, 1).getDay()
	const days = [
		...Array(firstDay).fill(null),
		...Array.from({ length: daysInMonth }, (_, i) => i + 1),
	]

	const getDayKey = d =>
		`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

	const isToday = d => getDayKey(d) === todayKey
	const isFuture = d => {
		const cell = new Date(year, month, d)
		const now = new Date()
		now.setHours(0, 0, 0, 0)
		return cell > now
	}

	// ── Click handler ─────────────────────────────────────────────────────────
	const handleDayClick = d => {
		if (!d) return
		const key = getDayKey(d)
		const entries = dateMap.get(key) || []
		setSelectedDay({ d, key, entries })

		if (entries.length === 0) {
			toast.info(`${d} ${MONTHS[month]} ${year} sanasida ma'lumot mavjud emas`)
		} else {
			setSheetOpen(true)
		}
	}

	// ── Dots for a day (max 4) ────────────────────────────────────────────────
	const getDots = d =>
		(dateMap.get(getDayKey(d)) || [])
			.slice(0, 4)
			.map(item => getStatusColor(item.status))

	// ── Legend items ──────────────────────────────────────────────────────────
	const LEGEND = [
		{ color: STATUS_STYLES.green.dot, label: 'Bajarildi' },
		{ color: STATUS_STYLES.blue.dot, label: 'Bajarilmoqda' },
		{ color: STATUS_STYLES.yellow.dot, label: 'Tasdiqlanmoqda' },
		{ color: STATUS_STYLES.red.dot, label: 'Qaytarildi' },
	]

	return (
		<div className='w-full h-full min-h-screen bg-background text-foreground flex flex-col'>
			{isLoading ? (
				<CalendarSkeleton />
			) : (
				<div className='flex flex-col flex-1  gap-3 sm:gap-5'>
					{/* ── Header ──────────────────────────────────────────────── */}
					<div className='flex items-center justify-between'>
						<Button
							variant='outline'
							size='icon'
							className='rounded-xl h-9 w-9 flex-shrink-0'
							onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
						>
							<ChevronLeft size={17} />
						</Button>

						<div className='text-center select-none'>
							<h2 className='font-bold text-base sm:text-xl text-foreground leading-tight'>
								{MONTHS[month]} {year}
							</h2>
							<p className='text-[11px] text-muted-foreground mt-0.5'>
								Bugun: {today.getDate()} {MONTHS[today.getMonth()]}
							</p>
						</div>

						<Button
							variant='outline'
							size='icon'
							className='rounded-xl h-9 w-9 flex-shrink-0'
							onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
						>
							<ChevronRight size={17} />
						</Button>
					</div>

					{/* ── Week labels ─────────────────────────────────────────── */}
					<div className='grid grid-cols-7 gap-1 sm:gap-2'>
						{WEEK_DAYS.map((wd, i) => (
							<div
								key={i}
								className='text-center text-[10px] sm:text-xs font-semibold text-muted-foreground py-1 select-none'
							>
								{wd}
							</div>
						))}
					</div>

					{/* ── Day cells ───────────────────────────────────────────── */}
					<div className='grid grid-cols-7 gap-1 sm:gap-2 flex-1'>
						{days.map((d, idx) => {
							if (!d) return <div key={idx} />

							const future = isFuture(d)
							const todayFlag = isToday(d)
							const dots = getDots(d)
							const entries = dateMap.get(getDayKey(d)) || []
							const hasData = entries.length > 0

							return (
								<button
									key={idx}
									onClick={() => handleDayClick(d)}
									className={cn(
										'aspect-square rounded-xl flex flex-col items-center justify-start pt-[6px] pb-[4px] px-[2px]',
										'transition-all duration-150 select-none cursor-pointer active:scale-95',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
										todayFlag
											? 'bg-primary/10 border-2 border-primary hover:bg-primary/15 dark:bg-primary/15'
											: future && hasData
												? 'bg-card border border-border hover:bg-accent hover:border-primary/50 dark:bg-card dark:hover:bg-accent shadow-sm'
												: future
													? 'bg-muted/30 border border-dashed border-border hover:bg-muted/50'
													: hasData
														? 'bg-card border border-border hover:bg-accent hover:border-primary/50 dark:bg-card dark:hover:bg-accent shadow-sm'
														: 'bg-card border border-border hover:bg-accent hover:border-border/80 dark:bg-card dark:hover:bg-accent',
									)}
								>
									{/* Day number */}
									<span
										className={cn(
											'text-[11px] sm:text-sm font-bold leading-none mb-[3px]',
											todayFlag
												? 'text-primary'
												: future && !hasData
													? 'text-muted-foreground/50'
													: 'text-foreground',
										)}
									>
										{d}
									</span>

									{/* Dots */}
									{hasData && (
										<div className='flex flex-wrap gap-[2px] justify-center items-center w-full px-0.5'>
											{dots.map((color, i) => (
												<span
													key={i}
													className={cn(
														'rounded-full flex-shrink-0 w-[5px] h-[5px] sm:w-[6px] sm:h-[6px]',
														STATUS_STYLES[color]?.dot || 'bg-gray-400',
													)}
												/>
											))}
											{entries.length > 4 && (
												<span className='text-[8px] font-bold text-muted-foreground leading-none'>
													+{entries.length - 4}
												</span>
											)}
										</div>
									)}
								</button>
							)
						})}
					</div>

					{/* ── Legend ──────────────────────────────────────────────── */}
					<Separator />
					<div className='flex flex-wrap items-center justify-center gap-3 sm:gap-5 pb-1'>
						{LEGEND.map(({ color, label }) => (
							<div key={label} className='flex items-center gap-1.5'>
								<span
									className={cn('w-2 h-2 rounded-full flex-shrink-0', color)}
								/>
								<span className='text-[10px] sm:text-xs text-muted-foreground'>
									{label}
								</span>
							</div>
						))}
						<div className='flex items-center gap-1.5'>
							<span className='w-2.5 h-2.5 rounded-sm border-2 border-primary flex-shrink-0' />
							<span className='text-[10px] sm:text-xs text-muted-foreground'>
								Bugun
							</span>
						</div>
					</div>
				</div>
			)}

			{/* ── Sheet ───────────────────────────────────────────────────────── */}
			<Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
				<SheetContent
					side='right'
					className='w-full sm:w-[440px] p-0 flex flex-col gap-0 border-l border-border'
				>
					{/* Header */}
					<SheetHeader className='px-5 py-4 border-b border-border bg-muted/40 flex-shrink-0'>
						<div className='flex items-center justify-between'>
							<div className='flex items-center gap-3'>
								<div className='w-9 h-9 rounded-xl bg-primary/10 dark:bg-primary/15 flex items-center justify-center flex-shrink-0'>
									<Calendar size={16} className='text-primary' />
								</div>
								<div>
									<SheetTitle className='text-sm font-bold leading-tight text-foreground'>
										{selectedDay?.d} {MONTHS[month]} {year}
									</SheetTitle>
									<p className='text-xs text-muted-foreground mt-0.5'>
										{selectedDay?.entries.length} ta yozuv
									</p>
								</div>
							</div>
						</div>
					</SheetHeader>

					{/* Content */}
					<ScrollArea className='flex-1 px-4 py-3 overflow-y-scroll'>
						{!selectedDay?.entries.length ? (
							<div className='flex flex-col items-center justify-center py-16 text-muted-foreground gap-3'>
								<Bell size={40} className='opacity-20' />
								<p className='text-sm'>Bu sanada ma'lumot topilmadi</p>
							</div>
						) : (
							<div className='flex flex-col gap-3 pb-6'>
								{selectedDay.entries.map(item => (
									<PPRCard key={item.id} item={item} />
								))}
							</div>
						)}
					</ScrollArea>

					{/* Footer */}
					<div className='px-4 py-3 border-t border-border flex-shrink-0 bg-background'>
						<SheetClose asChild>
							<Button
								variant='outline'
								className='w-full rounded-xl font-semibold'
							>
								Yopish
							</Button>
						</SheetClose>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}
