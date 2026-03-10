import { CardContent } from '@/components/ui/card'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useTheme } from '@/context/ThemeContext'
import { loadLanguage } from '@/i18n/loadLanguage'
import {
	Bell,
	Languages,
	ListChecks,
	Loader2,
	Lock,
	Moon,
	Sun,
	Text,
	Volume2,
	VolumeX,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

/* ─── SettingRow ─────────────────────────────────────────── */
const SettingRow = ({
	icon: Icon,
	iconColor = 'text-primary',
	label,
	description,
	children,
}) => (
	<div className='flex items-center justify-between gap-4 py-4'>
		<div className='flex items-start gap-3 min-w-0'>
			<div
				className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-muted/60 ${iconColor}`}
			>
				<Icon size={16} />
			</div>
			<div className='min-w-0'>
				<p className='text-sm font-semibold text-foreground leading-none'>
					{label}
				</p>
				{description && (
					<p className='text-xs text-muted-foreground mt-1 leading-relaxed'>
						{description}
					</p>
				)}
			</div>
		</div>
		<div className='shrink-0'>{children}</div>
	</div>
)

/* ─── SettingGroup ────────────────────────────────────────── */
const SettingGroup = ({ title, children }) => (
	<div className='rounded-2xl border border-border bg-card overflow-hidden shadow-sm'>
		<div className='px-4 py-3 border-b border-border bg-muted/30'>
			<p className='text-[11px] font-bold text-muted-foreground uppercase tracking-widest'>
				{title}
			</p>
		</div>
		<div className='px-4 divide-y divide-border/60'>{children}</div>
	</div>
)

/* ─── StyledSwitch ────────────────────────────────────────── */
const StyledSwitch = ({ checked, onCheckedChange }) => (
	<Switch
		checked={checked}
		onCheckedChange={onCheckedChange}
		className='data-[state=checked]:bg-primary'
	/>
)

/* ─── StyledSelect ────────────────────────────────────────── */
const StyledSelect = ({
	value,
	onValueChange,
	placeholder,
	children,
	className = 'w-[140px]',
}) => (
	<Select value={value} onValueChange={onValueChange}>
		<SelectTrigger
			className={`${className} h-9 rounded-xl text-sm border-border bg-background`}
		>
			<SelectValue placeholder={placeholder} />
		</SelectTrigger>
		<SelectContent className='rounded-xl border-border'>
			{children}
		</SelectContent>
	</Select>
)

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function SettingsPanel() {
	const { t } = useTranslation()
	const { theme, toggleTheme } = useTheme()

	const [langs, setLang] = useState(
		() => localStorage.getItem('language') || 'uz',
	)
	const [loadingStyle, setLoadingStyle] = useState('spinner')
	const [soundEnabled, setSoundEnabled] = useState(false)
	const [notificationsEnabled, setNotificationsEnabled] = useState(true)
	const [notiv, setNotiv] = useState(
		() => localStorage.getItem('notiv') || 'rangli',
	)
	const [pass, setPass] = useState(true)
	const currentFont = localStorage.getItem('font') || 'roboto'

	const fonts = [
		{ value: 'roboto', label: 'Roboto (Default)' },
		{ value: 'nunito', label: 'Nunito' },
		{ value: 'Stack', label: 'Stack' },
		{ value: 'raleWay', label: 'Raleway' },
		{ value: 'Quicksand', label: 'Quicksand' },
		{ value: 'Libre', label: 'Libre' },
		{ value: 'Delius', label: 'Delius' },
		{ value: 'Bitter', label: 'Bitter' },
		{ value: 'playWrite', label: 'Playwrite' },
	]

	useEffect(() => {
		const changeLang = async () => await loadLanguage(langs)
		localStorage.setItem('language', langs)
		changeLang()
	}, [langs])

	useEffect(() => {
		localStorage.setItem('notiv', notiv)
	}, [notiv])

	const handleFontChange = value => {
		if (!value) return
		localStorage.setItem('font', value)
		window.location.reload()
	}

	return (
		<CardContent className='p-0 space-y-4'>
			{/* ── Interfeys ── */}
			<SettingGroup title='Interfeys'>
				{/* Dark mode */}
				<SettingRow
					icon={theme === 'dark' ? Moon : Sun}
					iconColor={theme === 'dark' ? 'text-indigo-400' : 'text-amber-500'}
					label={t('1_20251120')}
					description={
						theme === 'dark'
							? "Qorong'u rejim yoqilgan"
							: "Yorug' rejim yoqilgan"
					}
				>
					<StyledSwitch
						checked={theme === 'dark'}
						onCheckedChange={toggleTheme}
					/>
				</SettingRow>

				{/* Language */}
				<SettingRow
					icon={Languages}
					iconColor='text-blue-500'
					label={t('2_20251120')}
					description='Interfeys tilini tanlang'
				>
					<StyledSelect
						value={langs}
						onValueChange={setLang}
						placeholder='Tilni tanlang'
					>
						<SelectItem value='uz'>🇺🇿 {t('9_20251120')}</SelectItem>
						<SelectItem value='ru'>🇷🇺 {t('10_20251120')}</SelectItem>
						<SelectItem value='en'>🇺🇸 {t('11_20251120')}</SelectItem>
					</StyledSelect>
				</SettingRow>

				{/* Font */}
				<SettingRow
					icon={Text}
					iconColor='text-violet-500'
					label='Shrift tanlang'
					description='Ilovadagi matn uslubi'
				>
					<StyledSelect
						value={currentFont}
						onValueChange={handleFontChange}
						placeholder='Shrift tanlang'
					>
						{fonts.map(f => (
							<SelectItem key={f.value} value={f.value}>
								{f.label}
							</SelectItem>
						))}
					</StyledSelect>
				</SettingRow>

				{/* Loading style */}
				<SettingRow
					icon={Loader2}
					iconColor='text-cyan-500'
					label={t('3_20251120')}
					description='Yuklanish animatsiyasi turi'
				>
					<StyledSelect
						value={loadingStyle}
						onValueChange={setLoadingStyle}
						placeholder='Tanlang'
					>
						<SelectItem value='spinner'>{t('13_20251120')}</SelectItem>
						<SelectItem value='dots'>{t('14_20251120')}</SelectItem>
						<SelectItem value='skeleton'>{t('12_20251120')}</SelectItem>
					</StyledSelect>
				</SettingRow>
			</SettingGroup>

			{/* ── Bildirishnomalar ── */}
			<SettingGroup title='Bildirishnomalar'>
				{/* Notifications */}
				<SettingRow
					icon={Bell}
					iconColor='text-orange-500'
					label={t('5_20251120')}
					description={
						notificationsEnabled
							? 'Bildirishnomalar yoqilgan'
							: "Bildirishnomalar o'chirilgan"
					}
				>
					<StyledSwitch
						checked={notificationsEnabled}
						onCheckedChange={setNotificationsEnabled}
					/>
				</SettingRow>

				{/* Notification type */}
				<SettingRow
					icon={ListChecks}
					iconColor='text-emerald-500'
					label={t('7_20251120')}
					description="Bildirishnoma ko'rinish turi"
				>
					<StyledSelect
						value={notiv}
						onValueChange={setNotiv}
						placeholder='Tanlang'
					>
						<SelectItem value='rangli'>
							<span className='flex items-center gap-2'>
								<span className='w-2 h-2 rounded-full bg-primary inline-block' />
								Rangli
							</span>
						</SelectItem>
						<SelectItem value='rangsiz'>
							<span className='flex items-center gap-2'>
								<span className='w-2 h-2 rounded-full bg-muted-foreground inline-block' />
								Rangsiz
							</span>
						</SelectItem>
					</StyledSelect>
				</SettingRow>
			</SettingGroup>

			{/* ── Xavfsizlik va boshqa ── */}
			<SettingGroup title='Xavfsizlik va boshqa'>
				{/* Sound */}
				<SettingRow
					icon={soundEnabled ? Volume2 : VolumeX}
					iconColor='text-teal-500'
					label={t('4_20251120')}
					description={
						soundEnabled
							? 'Tovush signallari yoqilgan'
							: "Tovush signallari o'chirilgan"
					}
				>
					<StyledSwitch
						checked={soundEnabled}
						onCheckedChange={setSoundEnabled}
					/>
				</SettingRow>

				{/* Password */}
				<SettingRow
					icon={Lock}
					iconColor='text-rose-500'
					label={t('6_20251120')}
					description={
						pass ? 'Parol himoyasi yoqilgan' : "Parol himoyasi o'chirilgan"
					}
				>
					<StyledSwitch checked={pass} onCheckedChange={setPass} />
				</SettingRow>
			</SettingGroup>

			{/* ── version note ── */}
			<p className='text-center text-[11px] text-muted-foreground/50 pt-1'>
				v1.0.0 · Barcha sozlamalar avtomatik saqlanadi
			</p>
		</CardContent>
	)
}
