import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import {
	useMEQuery,
	usePprMonthQuery,
	usePPRtastiqlashGetForFindQuery,
} from '@/services/api'
import {
	AlertCircle,
	CalendarDays,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	ExternalLink,
	Lock,
	Star,
	TrendingUp,
	Zap,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AddPPRMonth from './add.ppr.month'

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTHS_UZ = [
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

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useCalendarData(currentDate, bolimCategory) {
	const { data: PPR_DATA, isLoading } = usePprMonthQuery({
		bolim_category: bolimCategory,
	})

	const dateMap = useMemo(() => {
		const map = new Map()
		PPR_DATA?.results?.forEach(entry => {
			if (!entry.sana) return
			if (!map.has(entry.sana)) map.set(entry.sana, [])
			map.get(entry.sana).push(entry)
		})
		return map
	}, [PPR_DATA])

	const days = useMemo(() => {
		const firstDay = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth(),
			1,
		).getDay()
		const totalDays = new Date(
			currentDate.getFullYear(),
			currentDate.getMonth() + 1,
			0,
		).getDate()
		const result = []
		for (let i = 0; i < firstDay; i++) result.push(null)
		for (let d = 1; d <= totalDays; d++) result.push(d)
		return result
	}, [currentDate])

	return { dateMap, days, isLoading }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getDateString(currentDate, dayNum) {
	const y = currentDate.getFullYear()
	const m = String(currentDate.getMonth() + 1).padStart(2, '0')
	const d = String(dayNum).padStart(2, '0')
	return `${y}-${m}-${d}`
}

function getDayStatus(dayNum, currentDate) {
	if (!dayNum) return 'empty'
	const today = new Date()
	const cleanToday = new Date(
		today.getFullYear(),
		today.getMonth(),
		today.getDate(),
	)
	const cell = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth(),
		dayNum,
	)
	if (cell > cleanToday) return 'future'
	if (
		dayNum === today.getDate() &&
		currentDate.getMonth() === today.getMonth() &&
		currentDate.getFullYear() === today.getFullYear()
	)
		return 'today'
	return 'past'
}

function getAvgFoiz(entries) {
	if (!entries.length) return 0
	const sum = entries.reduce((acc, e) => acc + (Number(e.umumiy_foiz) || 0), 0)
	return Math.round(sum / entries.length)
}

function getFoizColor(foiz) {
	if (foiz >= 80)
		return { bar: '#22c55e', text: 'text-green-500', bg: 'bg-green-500' }
	if (foiz >= 50)
		return { bar: '#f59e0b', text: 'text-amber-500', bg: 'bg-amber-500' }
	return { bar: '#ef4444', text: 'text-red-500', bg: 'bg-red-500' }
}

function hasMuddat(entries) {
	return entries.some(e => e.muddat)
}

// ─── Progress Ring (SVG) ──────────────────────────────────────────────────────

function ProgressRing({ value, size = 28, stroke = 3 }) {
	const r = (size - stroke * 2) / 2
	const circ = 2 * Math.PI * r
	const offset = circ - (value / 100) * circ
	const { bar } = getFoizColor(value)

	return (
		<svg width={size} height={size} className='rotate-[-90deg]' aria-hidden>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={r}
				fill='none'
				stroke='currentColor'
				strokeWidth={stroke}
				className='text-muted/40'
			/>
			<circle
				cx={size / 2}
				cy={size / 2}
				r={r}
				fill='none'
				stroke={bar}
				strokeWidth={stroke}
				strokeDasharray={circ}
				strokeDashoffset={offset}
				strokeLinecap='round'
				style={{ transition: 'stroke-dashoffset 0.5s ease' }}
			/>
		</svg>
	)
}

// ─── PPR Entry Card (inside Sheet) ───────────────────────────────────────────

function PPREntryCard({ entry, onClose }) {
	const foiz = Number(entry.umumiy_foiz) || 0
	const { bar, text } = getFoizColor(foiz)
	const isOverdue = !!entry.muddat

	return (
		<Link
			to={`${entry.ppr_turi_name}/${entry?.id}`}
			onClick={onClose}
			className='block group'
		>
			<div className='rounded-2xl border border-border bg-card hover:border-primary/40 hover:bg-accent/40 transition-all duration-200 overflow-hidden'>
				{/* Top */}
				<div className='flex items-start justify-between gap-3 p-4 pb-3'>
					<div className='flex items-center gap-2.5 min-w-0'>
						<div
							className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${isOverdue ? 'bg-red-500/10' : 'bg-primary/10'}`}
						>
							{isOverdue ? (
								<AlertCircle size={15} className='text-red-500' />
							) : (
								<TrendingUp size={15} className='text-primary' />
							)}
						</div>
						<div className='min-w-0'>
							<p className='text-sm font-semibold text-foreground truncate leading-tight'>
								{entry.ppr_turi_name}
							</p>
							{entry.sana && (
								<p className='text-[10px] text-muted-foreground mt-0.5'>
									{entry.sana}
								</p>
							)}
						</div>
					</div>

					{/* Progress Ring + percent */}
					<div className='flex flex-col items-center gap-0.5 flex-shrink-0'>
						<div className='relative flex items-center justify-center'>
							<ProgressRing value={foiz} size={36} stroke={3.5} />
							<span
								className='absolute text-[8px] font-bold'
								style={{ color: bar }}
							>
								{foiz}
							</span>
						</div>
						<span className={`text-[9px] font-medium ${text}`}>foiz</span>
					</div>
				</div>

				{/* Progress bar */}
				<div className='px-4 pb-3'>
					<div className='w-full h-1.5 rounded-full bg-muted overflow-hidden'>
						<div
							className='h-full rounded-full transition-all duration-700'
							style={{ width: `${foiz}%`, background: bar }}
						/>
					</div>
				</div>

				{/* Footer */}
				<div
					className={`flex items-center justify-between px-4 py-2.5 border-t ${isOverdue ? 'border-red-500/20 bg-red-500/5' : 'border-border bg-muted/20'}`}
				>
					{isOverdue ? (
						<span className='text-[10px] font-medium text-red-500 flex items-center gap-1'>
							<Clock size={10} /> Muddat o'tgan
						</span>
					) : (
						<span className='text-[10px] text-muted-foreground flex items-center gap-1'>
							<CheckCircle2 size={10} className='text-green-500' /> Faol
						</span>
					)}
					<span className='text-[10px] text-muted-foreground flex items-center gap-1 group-hover:text-primary transition-colors'>
						Ko'rish <ExternalLink size={9} />
					</span>
				</div>
			</div>
		</Link>
	)
}

// ─── Sheet Panel ──────────────────────────────────────────────────────────────

function DaySheet({
	open,
	onClose,
	dateStr,
	entries,
	isMonthApproved,
	meRole,
}) {
	if (!dateStr) return null

	const avg = getAvgFoiz(entries)
	const { bar, bg } = getFoizColor(avg)
	const overdue = entries.filter(e => e.muddat).length
	const active = entries.length - overdue

	const formattedDate = (() => {
		const d = new Date(dateStr)
		if (isNaN(d)) return dateStr
		return d.toLocaleDateString('uz-UZ', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})
	})()

	return (
		<Sheet open={open} onOpenChange={v => !v && onClose()}>
			<SheetContent
				side='right'
				className='w-full sm:w-[460px] p-0 flex flex-col gap-0 border-l border-border'
			>
				{/* ── Header ── */}
				<SheetHeader className='flex-shrink-0 px-5 pt-5 pb-4 border-b border-border bg-muted/30'>
					<div className='flex items-start gap-3'>
						<div className='w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0'>
							<CalendarDays size={18} className='text-primary' />
						</div>
						<div className='flex-1 min-w-0'>
							<div className='flex items-center gap-2 flex-wrap'>
								<SheetTitle className='text-sm font-bold text-foreground capitalize leading-tight'>
									{formattedDate}
								</SheetTitle>
								{(() => {
									const d = new Date(dateStr)
									const today = new Date()
									today.setHours(0, 0, 0, 0)
									if (d > today)
										return (
											<span className='inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-muted border border-dashed border-muted-foreground/30 text-muted-foreground'>
												<Lock size={9} /> Kelajak
											</span>
										)
									return null
								})()}
							</div>
							<p className='text-xs text-muted-foreground mt-0.5'>
								{entries.length} ta PPR yozuvi
							</p>
						</div>
					</div>

					{/* Stats row */}
					{entries.length > 0 && (
						<div className='mt-4 grid grid-cols-3 gap-2'>
							<div className='flex flex-col items-center gap-1 rounded-xl bg-background border border-border py-2.5 px-2'>
								<span className='text-base font-bold text-foreground'>
									{entries.length}
								</span>
								<span className='text-[9px] text-muted-foreground'>Jami</span>
							</div>
							<div className='flex flex-col items-center gap-1 rounded-xl bg-background border border-border py-2.5 px-2'>
								<span className='text-base font-bold text-green-500'>
									{active}
								</span>
								<span className='text-[9px] text-muted-foreground'>Faol</span>
							</div>
							<div className='flex flex-col items-center gap-1 rounded-xl bg-background border border-border py-2.5 px-2'>
								<span className='text-base font-bold text-red-500'>
									{overdue}
								</span>
								<span className='text-[9px] text-muted-foreground'>
									Muddati o'tgan
								</span>
							</div>
						</div>
					)}

					{/* Average progress */}
					{entries.length > 0 && (
						<div className='mt-3 rounded-xl border border-border bg-background px-4 py-3'>
							<div className='flex items-center justify-between mb-2'>
								<span className='text-xs text-muted-foreground font-medium'>
									O'rtacha progress
								</span>
								<span className='text-sm font-bold' style={{ color: bar }}>
									{avg}%
								</span>
							</div>
							<div className='w-full h-2 rounded-full bg-muted overflow-hidden'>
								<div
									className='h-full rounded-full transition-all duration-700'
									style={{ width: `${avg}%`, background: bar }}
								/>
							</div>
						</div>
					)}
				</SheetHeader>

				{/* ── Content ── */}
				<ScrollArea className='flex-1 overflow-y-auto'>
					<div className='px-4 py-4 flex flex-col gap-3'>
						{entries.length === 0 ? (
							<div className='flex flex-col items-center justify-center py-20 text-muted-foreground gap-3'>
								<Clock size={44} className='opacity-15' />
								<p className='text-sm font-medium'>
									Bu kun uchun PPR mavjud emas
								</p>
								<p className='text-xs opacity-60'>
									Yangi PPR qo'shishingiz mumkin
								</p>
							</div>
						) : (
							entries.map(entry => (
								<PPREntryCard key={entry.id} entry={entry} onClose={onClose} />
							))
						)}
					</div>
				</ScrollArea>

				{/* ── Footer ── */}
				<div className='flex-shrink-0 px-4 py-3 border-t border-border bg-background flex flex-col gap-2'>
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
	)
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CalendarSkeleton() {
	return (
		<div className='flex flex-col gap-4'>
			<div className='flex items-center justify-between'>
				<div className='w-9 h-9 rounded-xl bg-muted animate-pulse' />
				<div className='w-32 h-6 rounded-lg bg-muted animate-pulse' />
				<div className='w-9 h-9 rounded-xl bg-muted animate-pulse' />
			</div>
			<div className='grid grid-cols-7 gap-1 sm:gap-2'>
				{Array(7)
					.fill(0)
					.map((_, i) => (
						<div key={i} className='h-4 rounded bg-muted animate-pulse' />
					))}
			</div>
			<div className='grid grid-cols-7 gap-1 sm:gap-2'>
				{Array(35)
					.fill(0)
					.map((_, i) => (
						<div
							key={i}
							className='aspect-square rounded-xl bg-muted animate-pulse'
							style={{ animationDelay: `${i * 20}ms` }}
						/>
					))}
			</div>
		</div>
	)
}

// ─── Day Cell ─────────────────────────────────────────────────────────────────

function DayCell({
	dayNum,
	currentDate,
	dateMap,
	onOpen,
	meRole,
	isMonthApproved,
}) {
	const status = getDayStatus(dayNum, currentDate)
	if (status === 'empty') return <div />

	const dateStr = getDateString(currentDate, dayNum)
	const entries = dateMap.get(dateStr) || []
	const avg = getAvgFoiz(entries)
	const { bar } = getFoizColor(avg)
	const overdue = hasMuddat(entries)
	const isFuture = status === 'future'
	const canAdd = meRole === 'bolim' && !isMonthApproved

	const baseClass =
		'aspect-square rounded-xl flex flex-col items-center justify-start pt-1.5 px-1 pb-1.5 relative overflow-hidden select-none transition-all duration-150 cursor-pointer active:scale-95'

	const statusClass = {
		future:
			'bg-muted/30 border border-dashed border-muted-foreground/30 hover:bg-muted/50 hover:border-muted-foreground/50',
		today:
			'bg-primary/8 border-2 border-primary ring-2 ring-primary/15 shadow-md hover:bg-primary/12',
		past: 'bg-card border border-border/70 shadow-sm hover:shadow-md hover:border-primary/40',
	}[status]

	return (
		<button
			className={`${baseClass} ${statusClass}`}
			onClick={() => onOpen(dateStr, entries)}
		>
			{/* Top-right icon */}
			{isFuture && !overdue && (
				<Lock className='absolute top-1 right-1 w-3.5 h-4.5 text-muted-foreground/40 lg:block hidden' />
			)}
			{status === 'today' && !overdue && (
				<Star className='absolute top-1 right-1 w-2.5 h-2.5 text-primary fill-primary' />
			)}
			{overdue && (
				<Zap className='absolute top-1 right-1 w-2.5 h-2.5 text-red-500 fill-red-500' />
			)}

			{/* Day number */}
			<span
				className={`text-[11px] sm:text-sm font-bold leading-none mb-1 ${
					status === 'today'
						? 'text-primary'
						: isFuture
							? 'text-muted-foreground/50'
							: 'text-foreground'
				}`}
			>
				{dayNum}
			</span>

			{/* Colored dots per entry */}
			{entries.length > 0 && (
				<div className='flex flex-wrap items-center justify-center gap-[3px] mt-0.5 px-0.5'>
					{entries.map((entry, i) => {
						const f = Number(entry.umumiy_foiz) || 0
						const { bar: dotColor } = getFoizColor(f)
						return (
							<span
								key={i}
								className='w-[6px] h-[6px] rounded-full flex-shrink-0'
								style={{ background: dotColor }}
								title={`${entry.ppr_turi_name}: ${f}%`}
							/>
						)
					})}
				</div>
			)}

			{/* + tugmasi — bo'sh o'tgan/bugungi kunlar uchun */}

			{meRole === 'bolim' && !isMonthApproved && (
				<div onClick={e => e.stopPropagation()} className=' w-full h=full'>
					<AddPPRMonth startDate={dateStr} />
				</div>
			)}
			{/* Bottom progress bar */}
			{entries.length > 0 && (
				<div className='absolute bottom-0 left-0 right-0 h-0.5 bg-muted/40'>
					<div
						className='h-full rounded-full transition-all duration-500'
						style={{ width: `${avg}%`, background: bar }}
					/>
				</div>
			)}
		</button>
	)
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PprMonth() {
	const bolim = useSelector(state => state.bolim.bolim)
	const { data: me } = useMEQuery()
	const { data: yuborishStatus } = usePPRtastiqlashGetForFindQuery()

	const bolimCategory = me?.role === 'bolim' ? me?.bolim_nomi : bolim

	const today = new Date()
	const [currentDate, setCurrentDate] = useState(
		new Date(today.getFullYear(), today.getMonth(), 1),
	)

	// Sheet state
	const [sheet, setSheet] = useState({
		open: false,
		dateStr: null,
		entries: [],
	})

	const { dateMap, days, isLoading } = useCalendarData(
		currentDate,
		bolimCategory,
	)

	const isMonthApproved = useMemo(() => {
		if (!yuborishStatus?.results) return false
		return yuborishStatus.results.some(
			item =>
				item.status === 'tasdiqlandi' &&
				item.yil === currentDate.getFullYear() &&
				item.oy === currentDate.getMonth() + 1,
		)
	}, [yuborishStatus, currentDate])

	const prevMonth = useCallback(
		() =>
			setCurrentDate(
				new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
			),
		[currentDate],
	)
	const nextMonth = useCallback(
		() =>
			setCurrentDate(
				new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
			),
		[currentDate],
	)

	const handleOpen = useCallback((dateStr, entries) => {
		setSheet({ open: true, dateStr, entries })
	}, [])

	const handleClose = useCallback(() => {
		setSheet(prev => ({ ...prev, open: false }))
	}, [])

	// Month summary stats — faqat joriy oy kunlari
	const monthStats = useMemo(() => {
		const y = currentDate.getFullYear()
		const m = String(currentDate.getMonth() + 1).padStart(2, '0')
		let total = 0,
			overdue = 0,
			avgSum = 0,
			activeDays = 0

		dateMap.forEach((entries, key) => {
			// key format: "YYYY-MM-DD" — faqat joriy oy
			if (!key.startsWith(`${y}-${m}-`)) return
			total += entries.length
			overdue += entries.filter(e => e.muddat).length
			if (entries.length > 0) {
				avgSum += getAvgFoiz(entries)
				activeDays++
			}
		})

		return {
			total,
			overdue,
			avg: activeDays ? Math.round(avgSum / activeDays) : 0,
		}
	}, [dateMap, currentDate])

	const monthLabel = `${MONTHS_UZ[currentDate.getMonth()]} ${currentDate.getFullYear()}`

	return (
		<>
			<main className='min-h-screen bg-background'>
				<Card className='shadow-none border-none bg-transparent pt-0'>
					{isLoading ? (
						<CalendarSkeleton />
					) : (
						<div className='flex flex-col gap-4'>
							{/* ── Header ── */}
							<div className='flex items-center justify-between'>
								<Button
									variant='outline'
									size='icon'
									onClick={prevMonth}
									className='rounded-xl hover:bg-primary/10 hover:border-primary/40'
								>
									<ChevronLeft className='h-4 w-4' />
								</Button>

								<div className='flex flex-col items-center gap-1'>
									<h2 className='text-lg sm:text-2xl font-bold tracking-tight'>
										{monthLabel}
									</h2>
									{isMonthApproved && (
										<Badge className='text-[10px] px-2 py-0 h-5 bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30 rounded-full'>
											✓ Tasdiqlangan
										</Badge>
									)}
								</div>

								<Button
									variant='outline'
									size='icon'
									onClick={nextMonth}
									className='rounded-xl hover:bg-primary/10 hover:border-primary/40'
								>
									<ChevronRight className='h-4 w-4' />
								</Button>
							</div>

							{/* ── Month stats ── */}
							{monthStats.total > 0 && (
								<div className='grid grid-cols-3 gap-2 px-0.5'>
									{[
										{
											label: 'Jami PPR',
											value: monthStats.total,
											color: 'text-foreground',
										},
										{
											label: "O'rtacha foiz",
											value: `${monthStats.avg}%`,
											color: getFoizColor(monthStats.avg).text,
										},
										{
											label: "Muddati o'tgan",
											value: monthStats.overdue,
											color: 'text-red-500',
										},
									].map(({ label, value, color }) => (
										<div
											key={label}
											className='flex flex-col items-center gap-0.5 rounded-xl border border-border bg-card px-3 py-2.5'
										>
											<span className={`text-base font-bold ${color}`}>
												{value}
											</span>
											<span className='text-[9px] text-muted-foreground text-center'>
												{label}
											</span>
										</div>
									))}
								</div>
							)}

							{/* ── Week headers ── */}
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

							{/* ── Calendar grid ── */}
							<div className='grid grid-cols-7 gap-1 sm:gap-2'>
								{days.map((dayNum, idx) => (
									<DayCell
										key={idx}
										dayNum={dayNum}
										currentDate={currentDate}
										dateMap={dateMap}
										onOpen={handleOpen}
										meRole={me?.role}
										isMonthApproved={isMonthApproved}
									/>
								))}
							</div>

							{/* ── Legend ── */}
							<Separator />
							<div className='flex flex-wrap items-center justify-center gap-4 pb-1'>
								{[
									{ color: 'bg-green-500', label: '80%+' },
									{ color: 'bg-amber-500', label: '50–79%' },
									{ color: 'bg-red-500', label: '50%−' },
								].map(({ color, label }) => (
									<div key={label} className='flex items-center gap-1.5'>
										<span className={`w-2 h-2 rounded-full ${color}`} />
										<span className='text-[10px] sm:text-xs text-muted-foreground'>
											{label}
										</span>
									</div>
								))}
								<div className='flex items-center gap-1.5'>
									<span className='w-2.5 h-2.5 rounded-sm border-2 border-primary' />
									<span className='text-[10px] sm:text-xs text-muted-foreground'>
										Bugun
									</span>
								</div>
								<div className='flex items-center gap-1.5'>
									<Zap className='w-2.5 h-2.5 text-red-500 fill-red-500' />
									<span className='text-[10px] sm:text-xs text-muted-foreground'>
										Muddat o'tgan
									</span>
								</div>
							</div>
						</div>
					)}
				</Card>
			</main>

			{/* ── Right Side Sheet ── */}
			<DaySheet
				open={sheet.open}
				onClose={handleClose}
				dateStr={sheet.dateStr}
				entries={sheet.entries}
				isMonthApproved={isMonthApproved}
				meRole={me?.role}
			/>
		</>
	)
}
