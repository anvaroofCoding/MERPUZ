import {
	CircleCheckIcon,
	InfoIcon,
	Loader2Icon,
	OctagonXIcon,
	TriangleAlertIcon,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useCallback, useEffect, useState } from 'react'
import { Toaster as Sonner } from 'sonner'

const Toaster = ({ ...props }) => {
	const { resolvedTheme, theme = 'system' } = useTheme()
	const [notive, setNotive] = useState('rangsiz')
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
		try {
			const stored = localStorage.getItem('notiv') || 'rangsiz'
			setNotive(stored)
		} catch {
			setNotive('rangsiz')
		}
	}, [])

	const toggleNotive = useCallback(
		val => {
			const next = val ?? (notive === 'rangli' ? 'rangsiz' : 'rangli')
			try {
				localStorage.setItem('notiv', next)
			} catch {}
			setNotive(next)
		},
		[notive],
	)

	if (!mounted) return null

	const isDark =
		resolvedTheme === 'dark' ||
		(resolvedTheme == null &&
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-color-scheme: dark)').matches)

	const isColored = notive === 'rangli'

	/* ── RANGLI: vivid solid backgrounds ── */
	const coloredStyle = {
		// default / normal
		'--normal-bg': isDark ? '#1a1a2e' : '#ffffff',
		'--normal-border': isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
		'--normal-text': isDark ? '#f0f0ff' : '#0a0a14',

		// success — yam-yashil
		'--success-bg': isDark ? '#052e16' : '#dcfce7',
		'--success-border': isDark ? '#16a34a' : '#16a34a',
		'--success-text': isDark ? '#4ade80' : '#14532d',

		// info — to'q ko'k
		'--info-bg': isDark ? '#0c1a4a' : '#dbeafe',
		'--info-border': isDark ? '#2563eb' : '#2563eb',
		'--info-text': isDark ? '#60a5fa' : '#1e3a8a',

		// warning — to'q sariq
		'--warning-bg': isDark ? '#2d1a00' : '#fef9c3',
		'--warning-border': isDark ? '#ca8a04' : '#ca8a04',
		'--warning-text': isDark ? '#facc15' : '#713f12',

		// error — qip-qizil
		'--error-bg': isDark ? '#2d0606' : '#fee2e2',
		'--error-border': isDark ? '#dc2626' : '#dc2626',
		'--error-text': isDark ? '#f87171' : '#7f1d1d',

		'--border-radius': '14px',
	}

	/* ── RANGSIZ: theme-native, dark modega mos ── */
	const defaultStyle = {
		'--normal-bg': isDark ? 'hsl(240 6% 13%)' : 'hsl(0 0% 100%)',
		'--normal-border': isDark ? 'hsl(240 4% 22%)' : 'hsl(240 6% 90%)',
		'--normal-text': isDark ? 'hsl(0 0% 95%)' : 'hsl(240 6% 10%)',

		'--success-bg': isDark ? 'hsl(240 6% 13%)' : 'hsl(0 0% 100%)',
		'--success-border': isDark ? 'hsl(240 4% 22%)' : 'hsl(240 6% 90%)',
		'--success-text': isDark ? 'hsl(0 0% 95%)' : 'hsl(240 6% 10%)',

		'--info-bg': isDark ? 'hsl(240 6% 13%)' : 'hsl(0 0% 100%)',
		'--info-border': isDark ? 'hsl(240 4% 22%)' : 'hsl(240 6% 90%)',
		'--info-text': isDark ? 'hsl(0 0% 95%)' : 'hsl(240 6% 10%)',

		'--warning-bg': isDark ? 'hsl(240 6% 13%)' : 'hsl(0 0% 100%)',
		'--warning-border': isDark ? 'hsl(240 4% 22%)' : 'hsl(240 6% 90%)',
		'--warning-text': isDark ? 'hsl(0 0% 95%)' : 'hsl(240 6% 10%)',

		'--error-bg': isDark ? 'hsl(240 6% 13%)' : 'hsl(0 0% 100%)',
		'--error-border': isDark ? 'hsl(240 4% 22%)' : 'hsl(240 6% 90%)',
		'--error-text': isDark ? 'hsl(0 0% 95%)' : 'hsl(240 6% 10%)',

		'--border-radius': '10px',
	}

	/* ── RANGLI ikonalar — jonli glow ── */
	const coloredIcons = {
		success: (
			<CircleCheckIcon
				className='size-[18px] shrink-0'
				style={{
					color: '#22c55e',
					filter: 'drop-shadow(0 0 8px #22c55e) drop-shadow(0 0 2px #16a34a)',
				}}
			/>
		),
		info: (
			<InfoIcon
				className='size-[18px] shrink-0'
				style={{
					color: '#3b82f6',
					filter: 'drop-shadow(0 0 8px #3b82f6) drop-shadow(0 0 2px #2563eb)',
				}}
			/>
		),
		warning: (
			<TriangleAlertIcon
				className='size-[18px] shrink-0'
				style={{
					color: '#eab308',
					filter: 'drop-shadow(0 0 8px #eab308) drop-shadow(0 0 2px #ca8a04)',
				}}
			/>
		),
		error: (
			<OctagonXIcon
				className='size-[18px] shrink-0'
				style={{
					color: '#ef4444',
					filter: 'drop-shadow(0 0 8px #ef4444) drop-shadow(0 0 2px #dc2626)',
				}}
			/>
		),
		loading: (
			<Loader2Icon
				className='size-[18px] shrink-0 animate-spin'
				style={{
					color: isDark ? '#818cf8' : '#4f46e5',
					filter: 'drop-shadow(0 0 6px #6366f1)',
				}}
			/>
		),
	}

	/* ── RANGSIZ ikonalar ── */
	const normalIcons = {
		success: (
			<CircleCheckIcon
				className='size-[18px] shrink-0'
				style={{ color: isDark ? '#a1a1aa' : '#52525b' }}
			/>
		),
		info: (
			<InfoIcon
				className='size-[18px] shrink-0'
				style={{ color: isDark ? '#a1a1aa' : '#52525b' }}
			/>
		),
		warning: (
			<TriangleAlertIcon
				className='size-[18px] shrink-0'
				style={{ color: isDark ? '#a1a1aa' : '#52525b' }}
			/>
		),
		error: (
			<OctagonXIcon
				className='size-[18px] shrink-0'
				style={{ color: isDark ? '#a1a1aa' : '#52525b' }}
			/>
		),
		loading: (
			<Loader2Icon
				className='size-[18px] shrink-0 animate-spin'
				style={{ color: isDark ? '#a1a1aa' : '#52525b' }}
			/>
		),
	}

	return (
		<Sonner
			theme={theme}
			className='toaster group'
			position='bottom-center'
			mobileOffset={16}
			offset={20}
			gap={10}
			visibleToasts={4}
			icons={isColored ? coloredIcons : normalIcons}
			style={isColored ? coloredStyle : defaultStyle}
			toastOptions={{
				classNames: {
					toast: [
						'group/toast',
						'flex items-start gap-3 w-full',
						'px-4 py-3 text-sm font-medium',
						isColored ? 'shadow-2xl border-l-[3px]' : 'shadow-md border',
					].join(' '),
					title: 'font-semibold text-[13px] leading-snug',
					description: 'text-[12px] leading-relaxed opacity-70 mt-0.5',
					actionButton:
						'rounded px-3 py-1 text-xs font-semibold bg-current/10 hover:bg-current/20 transition-colors',
					cancelButton:
						'rounded px-3 py-1 text-xs font-semibold opacity-50 hover:opacity-80 transition-opacity',
					closeButton: 'opacity-40 hover:opacity-90 transition-opacity',
				},
			}}
			{...props}
		/>
	)
}

export { Toaster }
