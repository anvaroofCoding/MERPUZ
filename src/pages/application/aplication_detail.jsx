import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { useAplication2Query } from '@/services/api'
import {
	ArrowLeft,
	CheckCircle2,
	Clock,
	Loader2,
	RotateCcw,
	Search,
	Shield,
	SlidersHorizontal,
	XCircle,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Aplication_Main_Page from './aplication.Main.Page'

// ─── STATUS CONFIG (shared design system) ─────────────────────────────────────
const statusConfig = {
	jarayonda: {
		label: 'Jarayonda',
		icon: Clock,
		className:
			'bg-amber-500/15 text-amber-400 border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
		dot: 'bg-amber-400',
		tabActive: 'text-amber-500',
	},
	bajarilmoqda: {
		label: 'Bajarilmoqda',
		icon: Loader2,
		className:
			'bg-blue-500/15 text-blue-400 border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
		dot: 'bg-blue-400',
		spin: true,
		tabActive: 'text-blue-500',
	},
	tasdiqlanmoqda: {
		label: 'Tasdiqlanmoqda',
		icon: Shield,
		className:
			'bg-violet-500/15 text-violet-400 border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-400 dark:border-violet-500/20',
		dot: 'bg-violet-400',
		tabActive: 'text-violet-500',
	},
	rad_etildi: {
		label: 'Rad etildi',
		icon: XCircle,
		className:
			'bg-red-500/15 text-red-400 border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20',
		dot: 'bg-red-400',
		tabActive: 'text-red-500',
	},
	bajarilgan: {
		label: 'Bajarilgan',
		icon: CheckCircle2,
		className:
			'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
		dot: 'bg-emerald-400',
		tabActive: 'text-emerald-500',
	},
	qaytarildi: {
		label: 'Qaytarildi',
		icon: RotateCcw,
		className:
			'bg-orange-500/15 text-orange-400 border-orange-500/30 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20',
		dot: 'bg-orange-400',
		tabActive: 'text-orange-500',
	},
}

function StatusBadge({ status }) {
	const config = statusConfig[status]
	if (!config) {
		return (
			<span className='inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border bg-muted/50 text-muted-foreground border-border'>
				<span className='w-1.5 h-1.5 rounded-full bg-muted-foreground' />
				{status || '—'}
			</span>
		)
	}
	const Icon = config.icon
	return (
		<span
			className={cn(
				'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border whitespace-nowrap',
				config.className,
			)}
		>
			<Icon className={cn('w-3 h-3', config.spin && 'animate-spin')} />
			{config.label}
		</span>
	)
}

// ─── STATUS TABS ───────────────────────────────────────────────────────────────
const statusTabs = [
	{ label: 'Hammasi', value: 'all' },
	{ label: 'Jarayonda', value: 'jarayonda' },
	{ label: 'Bajarilmoqda', value: 'bajarilmoqda' },
	{ label: 'Tasdiqlanmoqda', value: 'tasdiqlanmoqda' },
	{ label: 'Bajarilgan', value: 'bajarilgan' },
	{ label: 'Qaytarilgan', value: 'qaytarildi' },
	{ label: 'Rad etildi', value: 'rad_etildi' },
]

// ─── AVATAR ────────────────────────────────────────────────────────────────────
function Avatar({ name, size = 'md' }) {
	const letter = name?.charAt(0)?.toUpperCase() || '?'
	const colors = [
		'from-blue-500 to-blue-600',
		'from-violet-500 to-violet-600',
		'from-emerald-500 to-emerald-600',
		'from-amber-500 to-amber-600',
		'from-rose-500 to-rose-600',
		'from-cyan-500 to-cyan-600',
	]
	const colorIndex = name ? name.charCodeAt(0) % colors.length : 0
	const sizeClass = size === 'sm' ? 'w-9 h-9 text-sm' : 'w-11 h-11 text-base'

	return (
		<div
			className={cn(
				'rounded-full bg-gradient-to-br flex items-center justify-center font-bold text-white flex-shrink-0',
				sizeClass,
				colors[colorIndex],
			)}
		>
			{letter}
		</div>
	)
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────────────
export default function ApplicationDetailPage() {
	const [selectedTab, setSelectedTab] = useState('all')
	const { id } = useParams()
	const [mainID, setMainID] = useState(id)
	const [mobileView, setMobileView] = useState('list') // "list" | "detail"
	const navigate = useNavigate()
	const [search, setSearch] = useState('')
	const tabScrollRef = useRef(null)

	const { data, isLoading } = useAplication2Query({
		search,
		status: selectedTab === 'all' ? '' : selectedTab,
	})

	// Mobile: auto switch to detail when item selected
	const handleSelect = itemId => {
		setMainID(itemId)
		setMobileView('detail')
	}

	return (
		<div className='grid grid-cols-1 lg:grid-cols-3 h-[89vh] overflow-hidden rounded-xl border border-border/50 bg-card shadow-sm'>
			{/* ── LEFT PANEL ──────────────────────────────────────────────────── */}
			<div
				className={cn(
					'lg:col-span-1 flex flex-col border-r border-border/40 overflow-hidden',
					mobileView === 'detail' ? 'hidden lg:flex' : 'flex',
				)}
			>
				{/* Header */}
				<div className='flex-shrink-0 px-3 pt-3 pb-2 space-y-2 border-b border-border/40 bg-card/80 backdrop-blur-sm'>
					<div className='flex items-center gap-2'>
						<Button
							variant='ghost'
							size='icon'
							className='h-8 w-8 hover:bg-muted/60'
							onClick={() => navigate(-1)}
						>
							<ArrowLeft className='w-4 h-4' />
						</Button>
						<h2 className='text-sm font-semibold flex-1 tracking-tight'>
							Yuborilgan arizalar
						</h2>
						{data?.count != null && (
							<span className='text-xs text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-full font-medium'>
								{data.count}
							</span>
						)}
					</div>

					{/* Search */}
					<div className='relative'>
						<Search className='absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none' />
						<Input
							placeholder='Qidirish...'
							value={search}
							onChange={e => setSearch(e.target.value)}
							className='pl-8 h-9 text-sm bg-muted/40 border-border/50 focus:border-primary/40'
						/>
					</div>

					{/* Status tabs — horizontal scroll */}
					<div
						ref={tabScrollRef}
						className='flex gap-1 overflow-x-auto no-scrollbar pb-0.5'
					>
						{statusTabs.map(tab => {
							const isActive = selectedTab === tab.value
							const cfg = statusConfig[tab.value]
							return (
								<button
									key={tab.value}
									onClick={() => setSelectedTab(tab.value)}
									className={cn(
										'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all border',
										isActive
											? 'bg-primary text-primary-foreground border-primary shadow-sm'
											: 'bg-muted/40 text-muted-foreground border-transparent hover:border-border/50 hover:bg-muted/70 hover:text-foreground',
									)}
								>
									{cfg && (
										<span
											className={cn(
												'w-1.5 h-1.5 rounded-full flex-shrink-0',
												isActive ? 'bg-primary-foreground/70' : cfg.dot,
											)}
										/>
									)}
									{tab.label}
								</button>
							)
						})}
					</div>
				</div>

				{/* List */}
				<ScrollArea className='flex-1 overflow-hidden'>
					<div className='flex flex-col'>
						{isLoading ? (
							Array.from({ length: 10 }).map((_, i) => (
								<div
									key={i}
									className='flex items-center gap-3 px-3 py-3 border-b border-border/30'
								>
									<Skeleton className='w-11 h-11 rounded-full flex-shrink-0' />
									<div className='flex-1 space-y-2'>
										<Skeleton className='h-3.5 w-[55%] rounded-md' />
										<Skeleton className='h-3 w-[75%] rounded-md' />
									</div>
									<Skeleton className='h-5 w-16 rounded-full' />
								</div>
							))
						) : data?.results?.length > 0 ? (
							data.results.map(item => {
								const isActive = mainID === item.id
								const name = item?.tuzilma_nomlari?.[0] || '?'

								return (
									<div
										key={item.id}
										onClick={() => handleSelect(item.id)}
										className={cn(
											'relative flex items-center gap-3 px-3 py-3 cursor-pointer transition-colors border-b border-border/20',
											isActive
												? 'bg-primary/8 dark:bg-primary/10'
												: 'hover:bg-muted/40',
										)}
									>
										{/* Active left bar */}
										{isActive && (
											<span className='absolute left-0 top-2 bottom-2 w-[3px] bg-primary rounded-r-full' />
										)}

										<Avatar name={name} />

										<div className='flex-1 min-w-0'>
											{/* Top row */}
											<div className='flex items-start justify-between gap-2 mb-0.5'>
												<p
													className={cn(
														'text-sm truncate leading-tight',
														isActive
															? 'font-semibold text-foreground'
															: 'font-medium text-foreground/90',
													)}
												>
													{item?.tuzilma_nomlari?.join(', ')}
												</p>
												<span className='text-[10px] text-muted-foreground shrink-0 mt-0.5'>
													{item?.sana}
												</span>
											</div>

											{/* Bottom row */}
											<div className='flex items-center justify-between gap-2'>
												<p className='text-xs text-muted-foreground truncate'>
													{item?.comment
														? item.comment.length > 35
															? item.comment.slice(0, 35) + '...'
															: item.comment
														: '—'}
												</p>
												<StatusBadge status={item.status} />
											</div>
										</div>
									</div>
								)
							})
						) : (
							<div className='flex flex-col items-center justify-center py-16 text-center px-4'>
								<div className='w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3'>
									<Search className='w-5 h-5 text-muted-foreground/50' />
								</div>
								<p className='text-sm font-medium text-muted-foreground'>
									Hech narsa topilmadi
								</p>
								<p className='text-xs text-muted-foreground/60 mt-1'>
									Qidiruv yoki filterni o'zgartiring
								</p>
							</div>
						)}
					</div>
				</ScrollArea>
			</div>

			{/* ── RIGHT PANEL ─────────────────────────────────────────────────── */}
			<div
				className={cn(
					'lg:col-span-2 overflow-hidden',
					mobileView === 'list' ? 'hidden lg:block' : 'block',
				)}
			>
				{/* Mobile back button */}
				<div className='lg:hidden flex items-center gap-2 px-3 py-2 border-b border-border/40'>
					<Button
						variant='ghost'
						size='sm'
						className='h-8 gap-1.5 text-xs'
						onClick={() => setMobileView('list')}
					>
						<ArrowLeft className='w-3.5 h-3.5' />
						Orqaga
					</Button>
				</div>

				<div className='h-full overflow-auto p-4'>
					{mainID ? (
						<Aplication_Main_Page id={mainID} />
					) : (
						<div className='h-full flex flex-col items-center justify-center text-center'>
							<div className='w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4'>
								<SlidersHorizontal className='w-7 h-7 text-muted-foreground/40' />
							</div>
							<p className='text-sm font-medium text-muted-foreground'>
								Ariza tanlang
							</p>
							<p className='text-xs text-muted-foreground/60 mt-1'>
								Chapdan arizani bosing
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
