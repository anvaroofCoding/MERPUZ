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

/**
 * Toaster — iPhone-style blur toasts with rangli/rangsiz toggle
 *
 * localStorage key: "notiv"
 *   "rangli"   → colored glowing icons + glassmorphism bg
 *   "rangsiz"  → monochrome icons + theme-native bg  (default)
 */
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

	// Expose a setter so callers can toggle from outside
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

	if (!mounted) return null // avoid hydration flicker

	const isDark =
		resolvedTheme === 'dark' ||
		(resolvedTheme == null &&
			typeof window !== 'undefined' &&
			window.matchMedia('(prefers-color-scheme: dark)').matches)

	const isColored = notive === 'rangli'

	/* ─────────────────────────────────────────────
     CSS custom properties injected via `style`
  ───────────────────────────────────────────── */

	const coloredStyle = {
		// ── background glass ──
		'--normal-bg': isDark
			? 'rgba(15, 15, 20, 0.72)'
			: 'rgba(255, 255, 255, 0.68)',
		'--normal-border': isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
		'--normal-text': isDark ? 'rgba(240,240,255,0.96)' : 'rgba(10,10,20,0.92)',

		// ── success overrides ──
		'--success-bg': isDark ? 'rgba(6,50,30,0.78)' : 'rgba(220,255,235,0.82)',
		'--success-border': isDark
			? 'rgba(34,197,94,0.25)'
			: 'rgba(34,197,94,0.30)',
		'--success-text': isDark ? '#86efac' : '#15803d',

		// ── info overrides ──
		'--info-bg': isDark ? 'rgba(6,20,60,0.78)' : 'rgba(219,234,254,0.82)',
		'--info-border': isDark ? 'rgba(59,130,246,0.25)' : 'rgba(59,130,246,0.30)',
		'--info-text': isDark ? '#93c5fd' : '#1d4ed8',

		// ── warning overrides ──
		'--warning-bg': isDark ? 'rgba(50,35,0,0.78)' : 'rgba(255,251,210,0.85)',
		'--warning-border': isDark
			? 'rgba(234,179,8,0.25)'
			: 'rgba(234,179,8,0.35)',
		'--warning-text': isDark ? '#fde047' : '#854d0e',

		// ── error overrides ──
		'--error-bg': isDark ? 'rgba(50,8,8,0.78)' : 'rgba(254,226,226,0.82)',
		'--error-border': isDark ? 'rgba(239,68,68,0.25)' : 'rgba(239,68,68,0.30)',
		'--error-text': isDark ? '#fca5a5' : '#b91c1c',

		// ── shape & blur ──
		'--border-radius': '18px',
		backdropFilter: 'blur(24px) saturate(200%) brightness(1.05)',
		WebkitBackdropFilter: 'blur(24px) saturate(200%) brightness(1.05)',
	}

	const defaultStyle = {
		'--normal-bg': 'var(--popover)',
		'--normal-text': 'var(--popover-foreground)',
		'--normal-border': 'var(--border)',
		'--border-radius': 'var(--radius)',
	}

	/* ─────────────────────────────────────────────
     Icons
  ───────────────────────────────────────────── */

	const coloredIcons = {
		success: (
			<CircleCheckIcon
				className='size-[18px] shrink-0'
				style={{
					color: '#22c55e',
					filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.65))',
				}}
			/>
		),
		info: (
			<InfoIcon
				className='size-[18px] shrink-0'
				style={{
					color: '#3b82f6',
					filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.65))',
				}}
			/>
		),
		warning: (
			<TriangleAlertIcon
				className='size-[18px] shrink-0'
				style={{
					color: '#eab308',
					filter: 'drop-shadow(0 0 6px rgba(234,179,8,0.65))',
				}}
			/>
		),
		error: (
			<OctagonXIcon
				className='size-[18px] shrink-0'
				style={{
					color: '#ef4444',
					filter: 'drop-shadow(0 0 6px rgba(239,68,68,0.65))',
				}}
			/>
		),
		loading: (
			<Loader2Icon
				className='size-[18px] shrink-0 animate-spin'
				style={{ color: isDark ? '#a5b4fc' : '#6366f1' }}
			/>
		),
	}

	const normalIcons = {
		success: <CircleCheckIcon className='size-[18px] shrink-0 opacity-80' />,
		info: <InfoIcon className='size-[18px] shrink-0 opacity-80' />,
		warning: <TriangleAlertIcon className='size-[18px] shrink-0 opacity-80' />,
		error: <OctagonXIcon className='size-[18px] shrink-0 opacity-80' />,
		loading: (
			<Loader2Icon className='size-[18px] shrink-0 animate-spin opacity-80' />
		),
	}

	return (
		<Sonner
			theme={theme}
			className='toaster group'
			position='bottom-center' // mobile-friendly default
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
						'shadow-xl',
						// smooth entry/exit handled by Sonner internally
					].join(' '),
					title: 'font-semibold text-[13px] leading-snug',
					description: 'text-[12px] leading-relaxed opacity-75 mt-0.5',
					actionButton:
						'rounded-md px-3 py-1 text-xs font-semibold bg-white/20 hover:bg-white/30 transition-colors',
					cancelButton:
						'rounded-md px-3 py-1 text-xs font-semibold opacity-60 hover:opacity-90 transition-opacity',
					closeButton: 'opacity-40 hover:opacity-80 transition-opacity',
				},
			}}
			{...props}
		/>
	)
}

export { Toaster }
