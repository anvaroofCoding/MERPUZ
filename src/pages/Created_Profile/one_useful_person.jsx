import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
	useEditRegisterPhotoMutation,
	useRegister_DetailQuery,
} from '@/services/api'
import {
	Briefcase,
	Calendar,
	Camera,
	FileCheck,
	Mail,
	MapPin,
	Pencil,
	Shield,
	User,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { EditUserForm } from './one_useful_person_edit'

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */
function Pulse({ className = '' }) {
	return (
		<div
			className={`animate-pulse rounded-lg bg-[var(--muted)] ${className}`}
		/>
	)
}

function ProfileSkeleton() {
	return (
		<div className='w-full'>
			<div className='h-52 w-full rounded-t-2xl bg-[var(--muted)] animate-pulse' />
			<div className='px-6 sm:px-10 pb-10 pt-0'>
				<div className='flex flex-col sm:flex-row sm:items-end gap-5 -mt-14 mb-10'>
					<Pulse className='w-28 h-28 rounded-2xl ring-4 ring-[var(--background)] flex-shrink-0' />
					<div className='flex-1 pb-1 space-y-2.5'>
						<Pulse className='h-7 w-44' />
						<Pulse className='h-4 w-28' />
						<div className='flex gap-2 pt-1'>
							<Pulse className='h-5 w-20 rounded-full' />
							<Pulse className='h-5 w-16 rounded-full' />
							<Pulse className='h-5 w-16 rounded-full' />
						</div>
					</div>
					<Pulse className='h-11 w-32 rounded-xl' />
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8'>
					{[1, 2, 3].map(i => (
						<Pulse key={i} className='h-16 rounded-xl' />
					))}
				</div>
				<div className='flex items-center gap-3 mb-5'>
					<div className='flex-1 h-px bg-[var(--border)]' />
					<Pulse className='h-4 w-24 rounded-full' />
					<div className='flex-1 h-px bg-[var(--border)]' />
				</div>
				<div className='grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8'>
					{[1, 2, 3, 4, 5, 6].map(i => (
						<Pulse key={i} className='h-20 rounded-xl' />
					))}
				</div>
				<div className='flex justify-between pt-5 border-t border-[var(--border)]'>
					<Pulse className='h-4 w-36' />
					<Pulse className='h-4 w-20' />
				</div>
			</div>
		</div>
	)
}

/* ─────────────────────────────────────────
   INFO CHIP
───────────────────────────────────────── */
function InfoChip({ icon: Icon, label, value, variant = 'primary' }) {
	const styles = {
		primary: {
			wrap: 'bg-[hsl(235,100%,98%)] dark:bg-[hsl(235,100%,9%)] border-[hsl(235,100%,88%)] dark:border-[hsl(235,100%,16%)]',
			icon: 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_2px_8px_hsl(235,100%,60%,0.35)]',
			label: 'text-[var(--primary)]',
		},
		teal: {
			wrap: 'bg-[hsl(174,55%,96%)] dark:bg-[hsl(174,55%,7%)] border-[hsl(174,55%,82%)] dark:border-[hsl(174,55%,15%)]',
			icon: 'bg-[hsl(174,55%,38%)] dark:bg-[hsl(174,55%,42%)] text-white shadow-[0_2px_8px_hsl(174,55%,38%,0.3)]',
			label: 'text-[hsl(174,55%,32%)] dark:text-[hsl(174,55%,60%)]',
		},
		amber: {
			wrap: 'bg-[hsl(43,100%,97%)] dark:bg-[hsl(43,100%,6%)] border-[hsl(43,100%,82%)] dark:border-[hsl(43,100%,15%)]',
			icon: 'bg-[hsl(43,90%,48%)] text-white shadow-[0_2px_8px_hsl(43,90%,48%,0.3)]',
			label: 'text-[hsl(43,80%,36%)] dark:text-[hsl(43,100%,62%)]',
		},
	}
	const s = styles[variant]
	return (
		<div
			className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all hover:shadow-md ${s.wrap}`}
		>
			<div
				className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${s.icon}`}
			>
				<Icon className='w-4 h-4' />
			</div>
			<div className='min-w-0'>
				<p
					className={`text-[10px] font-extrabold uppercase tracking-[0.13em] mb-0.5 ${s.label}`}
				>
					{label}
				</p>
				<p className='text-sm font-semibold text-[var(--card-foreground)] truncate'>
					{value || 'Mavjud emas'}
				</p>
			</div>
		</div>
	)
}

/* ─────────────────────────────────────────
   DETAIL CARD
───────────────────────────────────────── */
function DetailCard({ icon: Icon, label, value, accent = false }) {
	return (
		<div
			className={`relative overflow-hidden p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md
      ${
				accent
					? 'bg-[hsl(235,100%,98%)] dark:bg-[hsl(235,100%,7%)] border-[var(--primary)]'
					: 'bg-[var(--card)] border-[var(--border)] hover:border-[var(--primary)]'
			}`}
		>
			{accent && (
				<div className='absolute top-0 left-0 w-0.5 h-full bg-[var(--primary)] rounded-l-xl' />
			)}
			<div className='flex items-center gap-1.5 mb-2'>
				{Icon && (
					<Icon
						className={`w-3.5 h-3.5 flex-shrink-0 ${accent ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}
					/>
				)}
				<p
					className={`text-[10px] font-extrabold uppercase tracking-[0.13em] ${accent ? 'text-[var(--primary)]' : 'text-[var(--muted-foreground)]'}`}
				>
					{label}
				</p>
			</div>
			<p className='text-sm font-bold text-[var(--card-foreground)] leading-snug'>
				{value || 'Mavjud emas'}
			</p>
		</div>
	)
}

/* ─────────────────────────────────────────
   BADGE
───────────────────────────────────────── */
function StatusBadge({ ok, trueLabel, falseLabel }) {
	return (
		<span
			className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${
				ok
					? 'bg-[hsl(142,60%,95%)] dark:bg-[hsl(142,60%,7%)] border-[hsl(142,60%,78%)] dark:border-[hsl(142,60%,18%)] text-[hsl(142,55%,32%)] dark:text-[hsl(142,60%,58%)]'
					: 'bg-[hsl(0,75%,97%)] dark:bg-[hsl(0,75%,7%)] border-[hsl(0,75%,82%)] dark:border-[hsl(0,75%,18%)] text-[hsl(0,65%,48%)] dark:text-[hsl(0,70%,62%)]'
			}`}
		>
			{ok ? '✓' : '✗'} {ok ? trueLabel : falseLabel}
		</span>
	)
}

/* ─────────────────────────────────────────
   MAIN
───────────────────────────────────────── */
export default function MensProfileCard() {
	const [isDialogOpen, setIsDialogOpen] = useState(false)
	const [previewPhoto, setPreviewPhoto] = useState(null)
	const life = localStorage.getItem('life')
	const { id } = useParams()
	const { data, isLoading, refetch } = useRegister_DetailQuery(id)

	const [user, setUser] = useState({
		username: '',
		password: '',
		role: '',
		bekat_nomi: '',
		tuzilma_nomi: '',
		faoliyati: '',
		rahbari: '',
		passport_seriya: '',
		status: true,
		email: '',
		birth_date: '',
		photo: '',
	})

	useEffect(() => {
		if (data) {
			setUser({
				username: data?.username || '',
				password: life || '',
				role: data?.role || '',
				bekat_nomi: data?.bekat_nomi || '',
				tuzilma_nomi: data?.tarkibiy_tuzilma || '',
				faoliyati: data?.faoliyati || '',
				rahbari: data?.rahbari || '',
				passport_seriya: data?.passport_seriya || '',
				status: data?.status ?? true,
				email: data?.email || '',
				birth_date: data?.birth_date || '',
				photo: data?.photo || '',
			})
		}
	}, [data, life])

	const fileInputRef = useRef(null)
	const [uploadUserPhoto, { isLoading: photoUploading }] =
		useEditRegisterPhotoMutation()

	const handleAvatarClick = () => {
		if (!photoUploading) fileInputRef.current?.click()
	}

	const handleUpload = async e => {
		const file = e.target.files?.[0]
		if (!file) return
		if (!file.type.startsWith('image/')) {
			toast.error('Faqat rasm fayllari!')
			return
		}
		if (file.size > 5 * 1024 * 1024) {
			toast.error('Maksimal hajm 5MB!')
			return
		}

		const reader = new FileReader()
		reader.onload = ev => setPreviewPhoto(ev.target?.result)
		reader.readAsDataURL(file)

		const formData = new FormData()
		Object.entries({
			photo: file,
			username: user.username,
			password: user.password,
			role: user.role,
			bekat_nomi: user.bekat_nomi,
			tuzilma_nomi: user.tuzilma_nomi,
			faoliyati: user.faoliyati,
			rahbari: user.rahbari,
			passport_seriya: user.passport_seriya,
			status: String(user.status),
			email: user.email,
			birth_date: user.birth_date,
		}).forEach(([k, v]) => formData.append(k, v))

		try {
			await uploadUserPhoto({ id, body: formData }).unwrap()
			toast.success('Rasm muvaffaqiyatli yuklandi!')
			refetch()
		} catch (err) {
			setPreviewPhoto(null)
			toast.error(
				err?.data?.detail || err?.data?.message || 'Yuklashda xatolik!',
			)
		} finally {
			if (fileInputRef.current) fileInputRef.current.value = ''
		}
	}

	const avatarSrc = previewPhoto || data?.photo
	const initials = data?.username?.slice(0, 2)?.toUpperCase() || 'AR'
	const isActive = data?.status === true || data?.status === 'true'

	if (isLoading) {
		return (
			<Card className='w-full overflow-hidden rounded-2xl py-0 border-[var(--border)] bg-[var(--card)] shadow-xl'>
				<ProfileSkeleton />
			</Card>
		)
	}

	return (
		<>
			<Card className='w-full overflow-hidden py-0 rounded-2xl border-[var(--border)] bg-[var(--card)] shadow-xl'>
				{/* ── HERO BANNER ── */}
				<div className='relative h-52 overflow-hidden select-none'>
					{/* Base gradient using project primary */}
					<div className='absolute inset-0 bg-gradient-to-br from-[var(--primary)] via-[hsl(235,80%,42%)] to-[hsl(258,65%,32%)]' />

					{/* Glowing orbs */}
					<div className='absolute -top-16 -left-16 w-64 h-64 rounded-full bg-[hsl(235,100%,78%)] opacity-[0.22] blur-3xl' />
					<div className='absolute -bottom-8 right-8 w-52 h-52 rounded-full bg-[hsl(258,80%,62%)] opacity-[0.22] blur-2xl' />
					<div className='absolute top-8 right-1/3 w-36 h-36 rounded-full bg-[hsl(210,100%,75%)] opacity-[0.15] blur-2xl' />

					{/* Subtle grid texture */}
					<div
						className='absolute inset-0 opacity-[0.06]'
						style={{
							backgroundImage:
								'radial-gradient(circle, white 1px, transparent 1px)',
							backgroundSize: '20px 20px',
						}}
					/>

					{/* Diagonal lines */}
					<div
						className='absolute inset-0 opacity-[0.05]'
						style={{
							backgroundImage:
								'repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 14px)',
						}}
					/>

					{/* User's full name as big watermark */}
					<div className='absolute bottom-8 left-6 sm:left-10'>
						<p className='text-white/10 text-6xl sm:text-8xl font-black tracking-tight select-none pointer-events-none truncate max-w-md'>
							{data?.username}
						</p>
					</div>

					{/* Status pill */}
					<div className='absolute top-4 right-5'>
						<span
							className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-full backdrop-blur-md border ${
								isActive
									? 'bg-white/10 border-white/25 text-white'
									: 'bg-black/20 border-white/15 text-white/60'
							}`}
						>
							<span
								className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-[hsl(142,76%,68%)] animate-pulse shadow-[0_0_6px_hsl(142,76%,68%)]' : 'bg-white/40'}`}
							/>
							{isActive ? 'Faol' : 'Faol emas'}
						</span>
					</div>

					{/* Bottom fade into card */}
					<div className='absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[var(--card)] to-transparent' />
				</div>

				{/* ── BODY ── */}
				<div className='px-6 sm:px-10 pb-10 pt-0'>
					{/* Avatar + Name */}
					<div className='flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-14 mb-8'>
						<div className='flex flex-col sm:flex-row items-center sm:items-end gap-4'>
							{/* Avatar */}
							<div
								className={`relative group cursor-pointer flex-shrink-0 ${photoUploading ? 'pointer-events-none' : ''}`}
								onClick={handleAvatarClick}
								title="Rasm o'zgartirish uchun bosing"
							>
								<div className='relative w-28 h-28 rounded-2xl overflow-hidden ring-4 ring-[var(--card)] shadow-2xl transition-transform duration-200 group-hover:scale-[1.04]'>
									<Avatar className='w-full h-full rounded-none'>
										<AvatarImage
											src={avatarSrc}
											alt={data?.username}
											className='object-cover w-full h-full'
										/>
										<AvatarFallback className='w-full h-full rounded-none bg-gradient-to-br from-[var(--primary)] to-[hsl(258,65%,42%)] text-[var(--primary-foreground)] text-2xl font-black flex items-center justify-center'>
											{initials}
										</AvatarFallback>
									</Avatar>
									{/* Hover overlay */}
									<div className='absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center'>
										{photoUploading ? (
											<div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
										) : (
											<Camera className='w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg' />
										)}
									</div>
								</div>
								{isActive && (
									<span className='absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[hsl(142,70%,45%)] border-[3px] border-[var(--card)] shadow-md' />
								)}
								<input
									type='file'
									accept='image/*'
									ref={fileInputRef}
									className='hidden'
									onChange={handleUpload}
								/>
							</div>

							{/* Name block */}
							<div className='pb-0.5 text-center sm:text-left mt-10'>
								<h1 className='text-2xl sm:text-3xl font-black tracking-tight text-[var(--card-foreground)] leading-none mb-1.5'>
									{data?.username}
								</h1>
								{data?.faoliyati && (
									<p className='text-sm text-[var(--muted-foreground)] font-semibold mb-3'>
										{data.faoliyati}
									</p>
								)}
								<div className='flex flex-wrap gap-1.5 justify-center sm:justify-start'>
									<StatusBadge
										ok={!!data?.passport_seriya}
										trueLabel='Passport'
										falseLabel="Passport yo'q"
									/>
									<StatusBadge
										ok={!!data?.email}
										trueLabel='Email'
										falseLabel="Email yo'q"
									/>
									<span className='inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full border bg-[hsl(43,100%,96%)] dark:bg-[hsl(43,100%,6%)] border-[hsl(43,100%,78%)] dark:border-[hsl(43,100%,16%)] text-[hsl(43,80%,38%)] dark:text-[hsl(43,100%,62%)]'>
										★ Premium
									</span>
								</div>
							</div>
						</div>

						{/* Edit btn */}
						<Button
							onClick={() => setIsDialogOpen(true)}
							className='w-full sm:w-auto gap-2 font-bold rounded-xl h-11 px-6 shadow-lg hover:shadow-xl transition-all bg-[var(--primary)] hover:bg-[hsl(235,100%,54%)] text-[var(--primary-foreground)] border-0'
						>
							<Pencil className='w-4 h-4' />
							Tahrirlash
						</Button>
					</div>

					{/* ── QUICK CHIPS ── */}
					<div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8'>
						<InfoChip
							icon={Briefcase}
							label='Rahbari'
							value={data?.rahbari}
							variant='primary'
						/>
						<InfoChip
							icon={Mail}
							label='Email'
							value={data?.email}
							variant='teal'
						/>
						<InfoChip
							icon={Calendar}
							label="Tug'ilgan sana"
							value={data?.birth_date}
							variant='amber'
						/>
					</div>

					{/* ── DIVIDER ── */}
					<div className='flex items-center gap-3 mb-5'>
						<div className='flex-1 h-px bg-[var(--border)]' />
						<span className='flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[var(--muted-foreground)] px-1'>
							<FileCheck className='w-3 h-3' /> Tafsilotlar
						</span>
						<div className='flex-1 h-px bg-[var(--border)]' />
					</div>

					{/* ── DETAIL GRID ── */}
					<div className='grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8'>
						<DetailCard label='Roli' value={data?.role} icon={User} accent />
						<DetailCard
							label='Tarkibiy tuzilma'
							value={data?.tarkibiy_tuzilma}
						/>
						<DetailCard
							label={data?.bolim_nomi ? "Bo'lim nomi" : 'Bekati'}
							value={data?.bolim_nomi || data?.bekat_nomi}
							icon={MapPin}
						/>
						<DetailCard
							label='Status'
							value={isActive ? '✓ Faol' : '✗ Faol emas'}
						/>
						<DetailCard
							label='Passport'
							value={data?.passport_seriya}
							icon={FileCheck}
						/>
						<DetailCard
							label='Yaratilgan sana'
							value={data?.created_at}
							icon={Calendar}
						/>
					</div>

					{/* ── FOOTER ── */}
					<div className='flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center pt-5 border-t border-[var(--border)]'>
						<div className='flex items-center gap-2.5 text-sm text-[var(--muted-foreground)]'>
							<div className='w-8 h-8 rounded-lg bg-[var(--muted)] flex items-center justify-center flex-shrink-0'>
								<Shield className='w-3.5 h-3.5' />
							</div>
							<span>
								Yaratdi:{' '}
								<span className='font-bold text-[var(--card-foreground)]'>
									{data?.created_by || 'Admin'}
								</span>
							</span>
						</div>
						<span className='text-[11px] font-mono text-[var(--muted-foreground)] bg-[var(--muted)] px-3 py-1.5 rounded-lg'>
							ID: {id}
						</span>
					</div>
				</div>
			</Card>

			<EditUserForm data={data} open={isDialogOpen} setOpen={setIsDialogOpen} />
		</>
	)
}
