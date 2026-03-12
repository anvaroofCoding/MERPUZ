'use client'

import { formatDistanceToNow } from 'date-fns'
import { uz } from 'date-fns/locale'
import {
	Bell,
	CheckCheck,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	Clock,
	Eye,
	Package,
	Search,
	Users,
	X,
	XCircle,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { Button } from '@/components/ui/button'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'

import {
	useNotificationsQuery,
	useNotificationViewMutation,
} from '@/services/api'
import { toast } from 'sonner'

// ─── Notification type config ────────────────────────────────────────────────
function getNotifConfig(title = '') {
	if (title.toLowerCase().includes('tasdiqlandi')) {
		return {
			icon: <CheckCircle2 size={16} />,
			color: 'text-emerald-500',
			bg: 'bg-emerald-500/10',
			border: 'border-emerald-500/20',
			dot: 'bg-emerald-500',
			badge: 'bg-emerald-500/15 text-emerald-600',
		}
	}
	if (title.toLowerCase().includes('rad etildi')) {
		return {
			icon: <XCircle size={16} />,
			color: 'text-rose-500',
			bg: 'bg-rose-500/10',
			border: 'border-rose-500/20',
			dot: 'bg-rose-500',
			badge: 'bg-rose-500/15 text-rose-600',
		}
	}
	return {
		icon: <Package size={16} />,
		color: 'text-blue-500',
		bg: 'bg-blue-500/10',
		border: 'border-blue-500/20',
		dot: 'bg-blue-500',
		badge: 'bg-blue-500/15 text-blue-600',
	}
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function UserAvatar({ username, size = 'sm' }) {
	const initials = username?.slice(0, 2).toUpperCase() || '??'
	const colors = [
		'bg-violet-500',
		'bg-blue-500',
		'bg-emerald-500',
		'bg-amber-500',
		'bg-rose-500',
		'bg-cyan-500',
	]
	const color = colors[username?.charCodeAt(0) % colors.length] || colors[0]
	const sizeClass = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-8 h-8 text-xs'
	return (
		<div
			className={`${sizeClass} ${color} rounded-full flex items-center justify-center text-white font-bold ring-2 ring-background flex-shrink-0`}
		>
			{initials}
		</div>
	)
}

const AVATAR_COLORS = [
	'bg-violet-500',
	'bg-blue-500',
	'bg-emerald-500',
	'bg-amber-500',
	'bg-rose-500',
	'bg-cyan-500',
]

// ─── Portal Tooltip — renders into document.body, always on top ───────────────
function SeenUsersPortal({ usernames, anchorRef, visible }) {
	const [rect, setRect] = useState(null)

	useEffect(() => {
		if (!visible || !anchorRef.current) return
		const r = anchorRef.current.getBoundingClientRect()
		setRect(r)
	}, [visible, anchorRef])

	if (!visible || !rect || typeof document === 'undefined') return null

	const top = rect.top + rect.height / 2
	const left = rect.right + 14

	return createPortal(
		<div
			style={{
				position: 'fixed',
				top,
				left,
				transform: 'translateY(-50%)',
				zIndex: 999999,
				width: 220,
				transformOrigin: 'left center',
			}}
			className='bg-popover border border-border rounded-2xl shadow-2xl shadow-black/30 overflow-hidden pointer-events-none animate-in fade-in zoom-in-95 duration-150'
		>
			{/* Header */}
			<div className='flex items-center gap-2 px-3 py-2.5 border-b border-border/60 bg-muted/40'>
				<Users size={12} className='text-muted-foreground flex-shrink-0' />
				<span className='text-[11px] font-semibold text-muted-foreground'>
					Ko'rganlar — {usernames.length} kishi
				</span>
			</div>

			{/* User list: max 100 rendered, 260px max height */}
			<div className='overflow-y-auto py-1' style={{ maxHeight: 260 }}>
				{usernames.slice(0, 100).map(username => {
					const color =
						AVATAR_COLORS[username?.charCodeAt(0) % AVATAR_COLORS.length] ??
						AVATAR_COLORS[0]
					return (
						<div
							key={username}
							className='flex items-center gap-2.5 px-3 py-1.5'
						>
							<div
								className={`w-7 h-7 ${color} rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0`}
							>
								{username?.slice(0, 2).toUpperCase() ?? '??'}
							</div>
							<span className='text-xs font-medium text-foreground truncate'>
								{username}
							</span>
						</div>
					)
				})}
				{usernames.length > 100 && (
					<div className='px-3 py-2 border-t border-border/40 text-center text-[10px] text-muted-foreground'>
						+ yana {usernames.length - 100} ta foydalanuvchi
					</div>
				)}
			</div>

			{/* Left-pointing arrow */}
			<div
				style={{
					position: 'absolute',
					left: -6,
					top: '50%',
					transform: 'translateY(-50%) rotate(45deg)',
					width: 12,
					height: 12,
					background: 'hsl(var(--popover))',
					borderLeft: '1px solid hsl(var(--border))',
					borderBottom: '1px solid hsl(var(--border))',
				}}
			/>
		</div>,
		document.body,
	)
}

// ─── Seen Users Row ───────────────────────────────────────────────────────────
function SeenUsers({ usernames = [] }) {
	const [hovered, setHovered] = useState(false)
	const anchorRef = useRef(null)
	const leaveTimer = useRef(null)

	if (!usernames.length) return null

	const MAX = 3
	const visible = usernames.slice(0, MAX)
	const extra = usernames.length - MAX

	const enter = () => {
		clearTimeout(leaveTimer.current)
		setHovered(true)
	}
	const leave = () => {
		leaveTimer.current = setTimeout(() => setHovered(false), 80)
	}

	return (
		<div className='flex items-center gap-1.5 mt-2.5 w-fit'>
			<button
				ref={anchorRef}
				onMouseEnter={enter}
				onMouseLeave={leave}
				onClick={e => e.stopPropagation()}
				className={`
					flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 -mx-1.5 -my-0.5
					transition-colors duration-150 cursor-default
					${hovered ? 'bg-muted/70' : 'hover:bg-muted/50'}
				`}
			>
				<Eye
					size={11}
					className={`flex-shrink-0 transition-colors ${hovered ? 'text-foreground/60' : 'text-muted-foreground'}`}
				/>
				<div className='flex items-center'>
					{visible.map((u, i) => (
						<div key={u} style={{ marginLeft: i === 0 ? 0 : -6 }}>
							<UserAvatar username={u} size='sm' />
						</div>
					))}
					{extra > 0 && (
						<div
							className='w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[9px] font-bold text-muted-foreground'
							style={{ marginLeft: -6 }}
						>
							+{extra}
						</div>
					)}
				</div>
				<span
					className={`text-[10px] transition-colors ${hovered ? 'text-foreground/70' : 'text-muted-foreground'}`}
				>
					{usernames.length === 1
						? `${usernames[0]} ko'rdi`
						: `${usernames.length} kishi ko'rdi`}
				</span>
			</button>

			<SeenUsersPortal
				usernames={usernames}
				anchorRef={anchorRef}
				visible={hovered}
			/>
		</div>
	)
}

// ─── Single Notification Card ─────────────────────────────────────────────────
function NotifCard({ item, onRead, onAlreadyRead }) {
	const cfg = getNotifConfig(item.title)

	return (
		<div
			onClick={() => (item.is_read ? onAlreadyRead(item) : onRead(item))}
			className={`
				group relative rounded-2xl border p-4 cursor-pointer
				transition-all duration-200 hover:shadow-md hover:-translate-y-[1px]
				${
					item.is_read
						? 'bg-card border-border/50 hover:border-border'
						: `${cfg.bg} ${cfg.border} hover:shadow-${cfg.dot}/10`
				}
			`}
		>
			{/* Unread dot */}
			{!item.is_read && (
				<span
					className={`absolute top-3.5 right-3.5 w-2 h-2 rounded-full ${cfg.dot} animate-pulse`}
				/>
			)}

			<div className='flex gap-3'>
				{/* Icon */}
				<div
					className={`mt-0.5 flex-shrink-0 w-8 h-8 rounded-xl ${item.is_read ? 'bg-muted' : cfg.bg} flex items-center justify-center ${cfg.color}`}
				>
					{cfg.icon}
				</div>

				{/* Content */}
				<div className='flex-1 min-w-0'>
					<div className='flex items-start justify-between gap-2'>
						<p
							className={`text-sm font-semibold leading-snug ${item.is_read ? 'text-foreground/80' : 'text-foreground'}`}
						>
							{item.title}
						</p>
					</div>

					<p className='text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed'>
						{item.message}
					</p>

					{/* Footer */}
					<div className='flex items-center justify-between mt-2.5'>
						<div className='flex items-center gap-1 text-[10px] text-muted-foreground'>
							<Clock size={10} />
							<span>
								{formatDistanceToNow(new Date(item.created_at), {
									addSuffix: true,
									locale: uz,
								})}
							</span>
						</div>

						{item.is_read && item.read_time && (
							<div className='flex items-center gap-1 text-[10px] text-emerald-500'>
								<CheckCheck size={11} />
								<span>{item.read_time}</span>
							</div>
						)}
					</div>

					{/* Seen users — hover triggers tooltip panel */}
					<SeenUsers usernames={item.seen_usernames} />
				</div>
			</div>
		</div>
	)
}

// ─── Filter Tab ───────────────────────────────────────────────────────────────
function FilterTab({ label, active, count, onClick }) {
	return (
		<button
			onClick={onClick}
			className={`
				relative px-3 py-1.5 rounded-lg text-xs font-medium transition-all
				${
					active
						? 'bg-primary text-primary-foreground shadow-sm'
						: 'text-muted-foreground hover:text-foreground hover:bg-muted'
				}
			`}
		>
			{label}
			{count > 0 && (
				<span
					className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold
					${active ? 'bg-white/20 text-white' : 'bg-muted text-muted-foreground'}`}
				>
					{count}
				</span>
			)}
		</button>
	)
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Notification() {
	const [page, setPage] = useState(1)
	const [search, setSearch] = useState('')
	const [filter, setFilter] = useState('all') // all | unread | read
	const limit = 20

	const { data, isLoading } = useNotificationsQuery({ page, limit, search })

	const notifications = data?.results || []
	const totalCount = data?.count || 0
	const totalReadings = data?.unread_count || 0
	const totalPages = Math.ceil(totalCount / limit)

	const [markRead, { isLoading: marking }] = useNotificationViewMutation()

	const unreadCount = notifications.filter(n => !n.is_read).length
	const readCount = notifications.filter(n => n.is_read).length

	const filtered = useMemo(() => {
		return notifications
			.filter(n => {
				if (filter === 'unread') return !n.is_read
				if (filter === 'read') return n.is_read
				return true
			})
			.filter(
				n =>
					n.title.toLowerCase().includes(search.toLowerCase()) ||
					n.message.toLowerCase().includes(search.toLowerCase()),
			)
	}, [notifications, filter, search])

	const handleRead = async item => {
		try {
			await markRead({ formData: { is_read: true }, id: item.id }).unwrap()
			toast.success("Xabar o'qildi!", {
				description: item.title,
				icon: <CheckCircle2 size={16} className='text-emerald-500' />,
			})
		} catch {
			toast.error('Xatolik yuz berdi!')
		}
	}

	const handleAlreadyRead = item => {
		toast.info(`${item.read_time} da o'qilgan`, {
			description: item.title,
			icon: <CheckCheck size={16} />,
		})
	}

	return (
		<Drawer direction='left'>
			{/* ── Trigger ── */}
			<DrawerTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					className='relative w-9 h-9 rounded-xl hover:bg-muted transition-all'
				>
					<Bell size={18} />
					{totalReadings > 0 && (
						<span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-background'>
							{totalReadings > 9 ? '9+' : totalReadings}
						</span>
					)}
				</Button>
			</DrawerTrigger>

			{/* ── Panel ── */}
			<DrawerContent className='w-[420px] p-0 flex flex-col h-full rounded-r-2xl overflow-hidden border-r'>
				{/* Header */}
				<div className='px-5 pt-5 pb-4 border-b bg-card'>
					<div className='flex items-center justify-between mb-4'>
						<div>
							<h2 className='text-base font-bold tracking-tight'>
								Bildirishnomalar
							</h2>
							<p className='text-xs text-muted-foreground mt-0.5'>
								{unreadCount > 0
									? `${unreadCount} ta yangi xabar`
									: "Barcha xabarlar o'qilgan"}
							</p>
						</div>
						<div className='w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center'>
							<Bell size={18} className='text-primary' />
						</div>
					</div>

					{/* Search */}
					<div className='relative'>
						<Search
							size={14}
							className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground'
						/>
						<Input
							placeholder='Qidirish...'
							value={search}
							onChange={e => {
								setSearch(e.target.value)
								setPage(1)
							}}
							className='pl-9 h-9 text-sm rounded-xl bg-muted/50 border-transparent focus:border-primary focus:bg-background transition-all'
						/>
						{search && (
							<button
								onClick={() => setSearch('')}
								className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
							>
								<X size={13} />
							</button>
						)}
					</div>

					{/* Filter tabs */}
					<div className='flex gap-1 mt-3'>
						<FilterTab
							label='Barchasi'
							active={filter === 'all'}
							count={0}
							onClick={() => setFilter('all')}
						/>
						<FilterTab
							label='Yangi'
							active={filter === 'unread'}
							count={totalReadings}
							onClick={() => setFilter('unread')}
						/>
						<FilterTab
							label="O'qilgan"
							active={filter === 'read'}
							count={totalCount - totalReadings}
							onClick={() => setFilter('read')}
						/>
					</div>
				</div>

				{/* List */}
				<div className='flex-1 overflow-y-auto px-4 py-3 space-y-2.5'>
					{isLoading && (
						<div className='space-y-2.5 pt-2'>
							{[...Array(4)].map((_, i) => (
								<div
									key={i}
									className='rounded-2xl border bg-muted/30 h-28 animate-pulse'
								/>
							))}
						</div>
					)}

					{!isLoading && filtered.length === 0 && (
						<div className='flex flex-col items-center justify-center py-16 text-center'>
							<div className='w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mb-3'>
								<Bell size={22} className='text-muted-foreground' />
							</div>
							<p className='text-sm font-medium text-foreground/70'>
								Bildirishnoma topilmadi
							</p>
							<p className='text-xs text-muted-foreground mt-1'>
								Qidiruv yoki filtrni o'zgartiring
							</p>
						</div>
					)}

					{!isLoading &&
						filtered.map(item => (
							<NotifCard
								key={item.id}
								item={item}
								onRead={handleRead}
								onAlreadyRead={handleAlreadyRead}
							/>
						))}
				</div>

				{/* Pagination */}
				{totalPages > 1 && (
					<div className='border-t bg-card px-4 py-3 flex items-center justify-between gap-2'>
						<Button
							size='sm'
							variant='outline'
							disabled={page === 1}
							onClick={() => setPage(p => p - 1)}
							className='h-8 w-8 p-0 rounded-xl'
						>
							<ChevronLeft size={15} />
						</Button>

						<div className='flex items-center gap-1'>
							{[...Array(Math.min(totalPages, 5))].map((_, i) => {
								const p = i + 1
								return (
									<button
										key={p}
										onClick={() => setPage(p)}
										className={`w-7 h-7 rounded-lg text-xs font-medium transition-all
											${
												page === p
													? 'bg-primary text-primary-foreground'
													: 'text-muted-foreground hover:bg-muted'
											}`}
									>
										{p}
									</button>
								)
							})}
							{totalPages > 5 && (
								<span className='text-xs text-muted-foreground px-1'>...</span>
							)}
						</div>

						<Button
							size='sm'
							variant='outline'
							disabled={page === totalPages}
							onClick={() => setPage(p => p + 1)}
							className='h-8 w-8 p-0 rounded-xl'
						>
							<ChevronRight size={15} />
						</Button>
					</div>
				)}

				{/* Footer */}
				<div className='px-4 pb-4 pt-2 text-center'>
					<p className='text-[10px] text-muted-foreground'>
						Jami {totalCount} ta bildirishnoma
					</p>
				</div>
			</DrawerContent>
		</Drawer>
	)
}
