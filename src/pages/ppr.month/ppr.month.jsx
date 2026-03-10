import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	useMEQuery,
	usePprMonthQuery,
	usePPRtastiqlashGetForFindQuery,
} from '@/services/api'
import { IconPercentage } from '@tabler/icons-react'
import {
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	Clock,
	Lock,
	Star,
	TrendingUp,
	X,
} from 'lucide-react'
import { useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import AddPPRMonth from './add.ppr.month'

// ─── Hooks ───────────────────────────────────────────────────────────────────

function useCalendarData(currentDate, bolimCategory) {
	const { data: PPR_DATA } = usePprMonthQuery({ bolim_category: bolimCategory })

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

	return { dateMap, days }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const WEEK_DAYS = ['Yak', 'Dush', 'Sesh', 'Chor', 'Pay', 'Jum', 'Shan']

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

// ─── Mobile Drawer ────────────────────────────────────────────────────────────

function MobileDrawer({ dateStr, entries, onClose, isMonthApproved, meRole }) {
	if (!dateStr) return null

	const formattedDate = new Date(dateStr).toLocaleDateString('uz-UZ', {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
	})

	return (
		<>
			{/* Backdrop */}
			<div
				className='fixed inset-0 bg-black/50 z-40 backdrop-blur-sm'
				onClick={onClose}
			/>

			{/* Drawer */}
			<div className='fixed bottom-0 left-0 right-0 z-50 bg-background rounded-t-2xl shadow-2xl border-t border-border animate-slide-up'>
				{/* Handle */}
				<div className='flex justify-center pt-3 pb-1'>
					<div className='w-10 h-1 rounded-full bg-muted-foreground/30' />
				</div>

				{/* Header */}
				<div className='flex items-center justify-between px-5 py-3 border-b border-border'>
					<div className='flex items-center gap-2'>
						<CalendarDays className='w-4 h-4 text-primary' />
						<span className='font-semibold text-sm capitalize'>
							{formattedDate}
						</span>
					</div>
					<button
						onClick={onClose}
						className='w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/80 transition-colors'
					>
						<X className='w-4 h-4' />
					</button>
				</div>

				{/* Content */}
				<div className='px-5 py-4 max-h-[60vh] overflow-y-auto'>
					{entries.length === 0 ? (
						<div className='flex flex-col items-center justify-center py-8 text-muted-foreground'>
							<Clock className='w-10 h-10 mb-2 opacity-30' />
							<p className='text-sm'>Bu kun uchun PPR mavjud emas</p>
						</div>
					) : (
						<div className='flex flex-col gap-3'>
							{entries.map(entry => (
								<Link
									key={entry.id}
									to={`${entry.ppr_turi_name}/${entry?.id}`}
									onClick={onClose}
								>
									<div
										className={`flex items-center justify-between px-4 py-3 rounded-xl text-white shadow-md transition-all active:scale-95 ${
											entry.muddat
												? 'bg-gradient-to-r from-red-500 to-red-600'
												: 'bg-gradient-to-r from-primary to-primary/80'
										}`}
									>
										<div className='flex items-center gap-2'>
											<TrendingUp className='w-4 h-4 opacity-80' />
											<span className='font-medium text-sm'>
												{entry.ppr_turi_name}
											</span>
										</div>
										<div className='flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-full'>
											<span className='text-xs font-bold'>
												{entry.umumiy_foiz}
											</span>
											<IconPercentage stroke={2} size={12} />
										</div>
									</div>
								</Link>
							))}
						</div>
					)}

					{/* Add PPR button */}
					{meRole === 'bolim' && !isMonthApproved && (
						<div className='mt-4 pt-4 border-t border-border'>
							<AddPPRMonth startDate={dateStr} />
						</div>
					)}
				</div>

				{/* Bottom safe area */}
				<div className='h-safe-bottom pb-4' />
			</div>
		</>
	)
}

// ─── Day Cell ─────────────────────────────────────────────────────────────────

function DayCell({
	dayNum,
	currentDate,
	dateMap,
	isMonthApproved,
	meRole,
	onMobileOpen,
	isMobile,
}) {
	const status = getDayStatus(dayNum, currentDate)
	if (status === 'empty') return <div />

	const dateStr = getDateString(currentDate, dayNum)
	const entries = dateMap.get(dateStr) || []

	const cellClass = {
		future:
			'bg-muted/40 border border-dashed border-muted-foreground/30 text-muted-foreground',
		today:
			'bg-primary/8 border-2 border-primary ring-2 ring-primary/20 shadow-md shadow-primary/10',
		past: 'bg-card border border-border/60 shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-200',
	}[status]

	const handleCellClick = () => {
		if (isMobile) onMobileOpen(dateStr, dayNum, entries)
	}

	return (
		<div
			className={`rounded-xl p-1.5 sm:p-2 flex flex-col relative overflow-hidden min-h-[56px] sm:min-h-[80px] md:min-h-[100px] ${cellClass} ${
				isMobile && status !== 'future'
					? 'cursor-pointer active:scale-95 transition-transform'
					: ''
			}`}
			onClick={handleCellClick}
		>
			{/* Status icons */}
			{status === 'future' && (
				<Lock className='absolute top-1.5 right-1.5 w-3 h-3 text-muted-foreground/50' />
			)}
			{status === 'today' && (
				<Star className='absolute top-1.5 right-1.5 w-3 h-3 text-primary fill-primary' />
			)}

			{/* Day number */}
			<span
				className={`text-xs sm:text-sm font-bold leading-none mb-1 ${
					status === 'today' ? 'text-primary' : ''
				}`}
			>
				{dayNum}
			</span>

			{/* Desktop: entries list */}
			<div className='hidden sm:flex flex-1 flex-col gap-0.5 overflow-scroll-y'>
				{entries.map(entry => (
					<Link
						key={entry.id}
						to={`${entry.ppr_turi_name}/${entry?.id}`}
						onClick={e => e.stopPropagation()}
					>
						<div
							className={`text-[10px] px-1.5 py-0.5 rounded-md truncate flex items-center justify-between gap-1 text-white shadow-sm ${
								entry.muddat
									? 'bg-gradient-to-r from-red-500 to-red-600'
									: 'bg-gradient-to-r from-primary to-primary/80'
							}`}
						>
							<span className='truncate'>{entry.ppr_turi_name}</span>
							<span className='shrink-0 flex items-center opacity-90'>
								{entry.umumiy_foiz}
								<IconPercentage stroke={2} size={10} />
							</span>
						</div>
					</Link>
				))}
			</div>

			{/* Mobile: entry count badge */}
			{entries.length > 0 && (
				<div className='sm:hidden flex items-center gap-0.5 mt-0.5'>
					<div
						className={`w-1.5 h-1.5 rounded-full ${
							entries.some(e => e.muddat) ? 'bg-red-500' : 'bg-primary'
						}`}
					/>
					{entries.length > 1 && (
						<span className='text-[9px] text-muted-foreground font-medium'>
							{entries.length}
						</span>
					)}
				</div>
			)}

			{/* Desktop: Add PPR */}
			{meRole === 'bolim' && !isMonthApproved && (
				<div className='hidden sm:block mt-auto pt-0.5'>
					<AddPPRMonth startDate={dateStr} />
				</div>
			)}
		</div>
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

	// Mobile drawer state
	const [drawer, setDrawer] = useState(null) // { dateStr, dayNum, entries }

	const { dateMap, days } = useCalendarData(currentDate, bolimCategory)

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

	const handleMobileOpen = useCallback((dateStr, dayNum, entries) => {
		setDrawer({ dateStr, dayNum, entries })
	}, [])

	const handleDrawerClose = useCallback(() => setDrawer(null), [])

	const months = [
		'yanvar',
		'fevral',
		'mart',
		'aprel',
		'may',
		'iyun',
		'iyul',
		'avgust',
		'sentabr',
		'oktabr',
		'noyabr',
		'dekabr',
	]

	const year = currentDate.getFullYear()
	const month = months[currentDate.getMonth()]

	const monthLabel = `${year} ${month}`

	return (
		<>
			<style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slide-up { animation: slide-up 0.28s cubic-bezier(0.32,0.72,0,1) both; }
      `}</style>

			<main className='min-h-screen bg-background'>
				<Card className='shadow-none border-none bg-transparent pt-0'>
					{/* ── Header ── */}
					<div className='flex items-center justify-between mb-5'>
						<Button
							variant='outline'
							size='icon'
							onClick={prevMonth}
							className='rounded-xl hover:bg-primary/10 hover:border-primary/40 transition-colors'
						>
							<ChevronLeft className='h-4 w-4' />
						</Button>

						<div className='flex flex-col items-center gap-0.5'>
							<h2 className='text-lg sm:text-2xl font-bold capitalize tracking-tight'>
								{monthLabel}
							</h2>
							{isMonthApproved && (
								<span className='text-[10px] sm:text-xs px-2 py-0.5 bg-green-500/15 text-green-600 dark:text-green-400 rounded-full font-medium border border-green-500/20'>
									✓ Tasdiqlangan
								</span>
							)}
						</div>

						<Button
							variant='outline'
							size='icon'
							onClick={nextMonth}
							className='rounded-xl hover:bg-primary/10 hover:border-primary/40 transition-colors'
						>
							<ChevronRight className='h-4 w-4' />
						</Button>
					</div>

					{/* ── Week day headers ── */}
					<div className='grid grid-cols-7 gap-1 sm:gap-2 mb-1.5'>
						{WEEK_DAYS.map((day, idx) => (
							<div
								key={idx}
								className='text-center text-[10px] sm:text-xs font-semibold text-muted-foreground py-1'
							>
								{day}
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
								isMonthApproved={isMonthApproved}
								meRole={me?.role}
								onMobileOpen={handleMobileOpen}
								isMobile={
									typeof window !== 'undefined' && window.innerWidth < 640
								}
							/>
						))}
					</div>

					{/* ── Mobile hint ── */}
					<p className='sm:hidden text-center text-[10px] text-muted-foreground/60 mt-4'>
						Kun ustiga bosing — batafsil ko'rish uchun
					</p>
				</Card>
			</main>

			{/* ── Mobile Drawer ── */}
			{drawer && (
				<MobileDrawer
					dateStr={drawer.dateStr}
					dayNum={drawer.dayNum}
					entries={drawer.entries}
					onClose={handleDrawerClose}
					isMonthApproved={isMonthApproved}
					meRole={me?.role}
				/>
			)}
		</>
	)
}
