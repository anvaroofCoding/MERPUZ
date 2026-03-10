import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import {
	useComing_Application_DetailQuery,
	useDeletePhotoMutation,
	useMEQuery,
} from '@/services/api'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
	IconCalendarWeek,
	IconFileTypography,
	IconMessage,
	IconSection,
	IconUserQuestion,
} from '@tabler/icons-react'
import { Download, DownloadCloud, Image as ImageIcon } from 'lucide-react'
import { memo, useCallback, useState } from 'react'
import { toast } from 'sonner'
import Coming_Application_Details_Work_Pogress from './coming-application-work-prosess'

// ─── Status config ────────────────────────────────────────────────────────────
import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react'

const STATUS_CONFIG = {
	bajarilgan: {
		icon: CheckCircle2,
		color: 'text-emerald-600 dark:text-emerald-400',
		bg: 'bg-emerald-50 dark:bg-emerald-950/40',
		border: 'border-emerald-200 dark:border-emerald-800',
		dot: 'bg-emerald-500',
		label: 'Bajarilgan',
	},
	qaytarildi: {
		icon: XCircle,
		color: 'text-red-600 dark:text-red-400',
		bg: 'bg-red-50 dark:bg-red-950/40',
		border: 'border-red-200 dark:border-red-800',
		dot: 'bg-red-500',
		label: 'Qaytarildi',
	},
	'qabul qilindi': {
		icon: CheckCircle2,
		color: 'text-blue-600 dark:text-blue-400',
		bg: 'bg-blue-50 dark:bg-blue-950/40',
		border: 'border-blue-200 dark:border-blue-800',
		dot: 'bg-blue-500',
		label: 'Qabul qilindi',
	},
	jarayonda: {
		icon: Clock,
		color: 'text-amber-600 dark:text-amber-400',
		bg: 'bg-amber-50 dark:bg-amber-950/40',
		border: 'border-amber-200 dark:border-amber-800',
		dot: 'bg-amber-500',
		label: 'Jarayonda',
	},
}

const getStatus = status =>
	STATUS_CONFIG[status?.toLowerCase()] || {
		icon: AlertCircle,
		color: 'text-slate-500',
		bg: 'bg-slate-50 dark:bg-slate-900',
		border: 'border-slate-200 dark:border-slate-700',
		dot: 'bg-slate-400',
		label: status || "Noma'lum",
	}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
const PageSkeleton = memo(() => (
	<ScrollArea className='h-[calc(100vh-110px)] no-scrollbar'>
		<div className='space-y-4 p-1'>
			<Card className='w-full overflow-hidden'>
				<CardContent className='space-y-5 pt-5'>
					<div className='flex items-start justify-between gap-3'>
						<div className='space-y-2 flex-1'>
							<Skeleton className='h-5 w-36 rounded-full' />
							<Skeleton className='h-6 w-24 rounded-full' />
						</div>
						<Skeleton className='h-8 w-28 rounded-lg' />
					</div>
					<div className='border-t pt-4 grid grid-cols-2 gap-4'>
						{[...Array(4)].map((_, i) => (
							<div key={i} className='flex gap-3 items-start'>
								<Skeleton className='h-4 w-4 rounded mt-0.5 flex-shrink-0' />
								<div className='space-y-1.5 flex-1'>
									<Skeleton className='h-3 w-14 rounded-full' />
									<Skeleton className='h-4 w-full rounded' />
								</div>
							</div>
						))}
					</div>
					<div className='border-t pt-4 space-y-2'>
						<Skeleton className='h-3 w-20 rounded-full' />
						<Skeleton className='h-4 w-full rounded' />
						<Skeleton className='h-4 w-3/4 rounded' />
					</div>
				</CardContent>
			</Card>
			<Card className='w-full'>
				<CardContent className='pt-5 space-y-3'>
					<Skeleton className='h-4 w-20 rounded-full' />
					<div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
						{[...Array(6)].map((_, i) => (
							<Skeleton key={i} className='h-24 w-full rounded-lg' />
						))}
					</div>
				</CardContent>
			</Card>
			<Card className='w-full'>
				<CardContent className='pt-5 space-y-3'>
					<Skeleton className='h-4 w-32 rounded-full' />
					{[...Array(3)].map((_, i) => (
						<div key={i} className='flex gap-3 items-center'>
							<Skeleton className='h-8 w-8 rounded-full flex-shrink-0' />
							<div className='flex-1 space-y-1'>
								<Skeleton className='h-3.5 w-1/2 rounded' />
								<Skeleton className='h-3 w-3/4 rounded' />
							</div>
						</div>
					))}
				</CardContent>
			</Card>
		</div>
	</ScrollArea>
))

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = memo(({ status }) => {
	const cfg = getStatus(status)
	const Icon = cfg.icon
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${cfg.bg} ${cfg.border} ${cfg.color}`}
		>
			<span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
			<Icon className='h-3 w-3' />
			{cfg.label}
		</span>
	)
})

// ─── Info Row ─────────────────────────────────────────────────────────────────
const InfoRow = memo(({ icon: Icon, label, children, isTabler = false }) => (
	<div className='flex items-start gap-3'>
		<div className='mt-0.5 flex-shrink-0 p-1.5 rounded-md bg-blue-50 dark:bg-blue-950/40'>
			<Icon
				stroke={isTabler ? 2 : undefined}
				className='h-3.5 w-3.5 text-blue-600 dark:text-blue-400'
			/>
		</div>
		<div className='min-w-0'>
			<p className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-0.5'>
				{label}
			</p>
			<div className='text-sm font-medium text-foreground'>{children}</div>
		</div>
	</div>
))

// ─── Comment Block ────────────────────────────────────────────────────────────
const CommentBlock = memo(
	({ label, text, iconColor = 'text-orange-500 dark:text-orange-400' }) => (
		<div className='flex gap-3'>
			<div className={`mt-0.5 flex-shrink-0 ${iconColor}`}>
				<IconMessage stroke={2} className='h-4 w-4' />
			</div>
			<div className='flex-1 min-w-0'>
				<p className='text-[11px] font-medium text-muted-foreground uppercase tracking-wide mb-1'>
					{label}
				</p>
				<p className='text-sm text-foreground/80 leading-relaxed break-words'>
					{text}
				</p>
			</div>
		</div>
	),
)

// ─── Image Grid ───────────────────────────────────────────────────────────────
const ImageGrid = memo(
	({ rasmlar, onImageClick, selectedImages, onToggle, onDownload }) => {
		if (!rasmlar?.length) {
			return (
				<div className='flex flex-col items-center justify-center py-8 gap-2 text-muted-foreground'>
					<ImageIcon className='h-8 w-8 opacity-30' />
					<p className='text-xs'>Rasm topilmadi</p>
				</div>
			)
		}

		return (
			<div className='space-y-3'>
				<div className='grid grid-cols-3 sm:grid-cols-4 gap-2'>
					{rasmlar.map(r => {
						const isSelected = selectedImages.includes(r.rasm)
						return (
							<div key={r.id} className='relative group'>
								<div
									className={`absolute inset-0 rounded-lg border-2 z-10 pointer-events-none transition-all ${
										isSelected
											? 'border-blue-500 dark:border-blue-400'
											: 'border-transparent group-hover:border-slate-300 dark:group-hover:border-slate-600'
									}`}
								/>
								<img
									src={r.rasm || '/placeholder.svg'}
									alt='ariza rasm'
									className='w-full h-24 object-cover rounded-lg cursor-pointer transition-all duration-200 hover:brightness-90'
									loading='lazy'
									onClick={() => onImageClick(r)}
								/>
								<input
									type='checkbox'
									className='absolute top-1.5 right-1.5 cursor-pointer z-20 w-3.5 h-3.5 accent-blue-500'
									checked={isSelected}
									onChange={() => onToggle(r.rasm)}
									aria-label='Select image'
									onClick={e => e.stopPropagation()}
								/>
							</div>
						)
					})}
				</div>
				{selectedImages.length > 0 && (
					<Button onClick={onDownload} className='w-full gap-2' size='sm'>
						<Download className='h-4 w-4' />
						Tanlanganlarni yuklab olish ({selectedImages.length})
					</Button>
				)}
			</div>
		)
	},
)

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Application_details_Main({ id }) {
	const { data, isLoading } = useComing_Application_DetailQuery(id)
	const [DeletePhotos, { isLoading: DeleteLoadingPhoto }] =
		useDeletePhotoMutation()
	const { data: me } = useMEQuery()

	const [selectedImages, setSelectedImages] = useState([])
	const [showImageModal, setShowImageModal] = useState(false)
	const [currentImage, setCurrentImage] = useState(null)
	const [currentImageId, setCurrentImageId] = useState(null)
	const [showFileModal, setShowFileModal] = useState(false)

	const toggleSelectImage = useCallback(img => {
		setSelectedImages(prev =>
			prev.includes(img) ? prev.filter(i => i !== img) : [...prev, img],
		)
	}, [])

	const handleDownloadFile = useCallback(async (url, filename = 'file') => {
		try {
			const res = await fetch(url)
			const blob = await res.blob()
			const blobUrl = URL.createObjectURL(blob)
			const link = document.createElement('a')
			link.href = blobUrl
			link.download = filename
			document.body.appendChild(link)
			link.click()
			link.remove()
			URL.revokeObjectURL(blobUrl)
		} catch {
			toast.error('Faylni yuklab olishda xatolik!')
		}
	}, [])

	const downloadImages = useCallback(async () => {
		try {
			for (let i = 0; i < selectedImages.length; i++) {
				await handleDownloadFile(selectedImages[i], `rasm-${i + 1}.jpg`)
			}
		} catch {
			toast.error('Rasmlarni yuklab olishda xatolik!')
		}
	}, [selectedImages, handleDownloadFile])

	const handleImageClick = useCallback(r => {
		setCurrentImage(r.rasm)
		setCurrentImageId(r.id)
		setShowImageModal(true)
	}, [])

	if (isLoading || !data) return <PageSkeleton />

	const statusCfg = getStatus(data?.status)

	return (
		<ScrollArea className='no-scrollbar h-screen pb-10'>
			<div className='space-y-3 p-0.5'>
				{/* ── Main Info Card ─────────────────────────────────────────── */}
				<Card className='w-full shadow-sm border-border/50 dark:border-border/30 overflow-hidden'>
					<div className={`h-1 w-full ${statusCfg.dot}`} />

					<CardContent className='space-y-5 pt-4'>
						{/* Header */}
						<div className='flex items-start justify-between gap-3'>
							<div className='flex-1 min-w-0 space-y-1.5'>
								<p className='text-xs font-medium text-muted-foreground'>
									Ariza raqami
								</p>
								<p className='text-lg font-bold tracking-tight text-foreground leading-none'>
									#{data?.id}
								</p>
								<StatusBadge status={data?.status} />
							</div>

							<Button
								size='sm'
								variant='outline'
								className='text-xs gap-1.5 h-8 flex-shrink-0'
								onClick={() => setShowFileModal(true)}
							>
								<DownloadCloud className='h-3.5 w-3.5' />
								<span className='hidden sm:inline'>Bildirgi</span>
							</Button>
						</div>

						{/* Info grid */}
						<div className='border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4'>
							<InfoRow icon={IconCalendarWeek} label='Ariza sanasi' isTabler>
								{data?.sana || (
									<span className='text-muted-foreground italic text-xs'>
										Mavjud emas
									</span>
								)}
							</InfoRow>

							<InfoRow icon={IconFileTypography} label='Turi' isTabler>
								<span>
									{data?.turi || '—'}
									{data?.ijro_muddati && (
										<span className='ml-1.5 text-xs text-muted-foreground font-normal'>
											({data.ijro_muddati})
										</span>
									)}
								</span>
							</InfoRow>

							<InfoRow icon={IconUserQuestion} label='Yaratuvchi' isTabler>
								<div className='flex items-center gap-2'>
									{data?.kim_tomonidan?.photo ? (
										<Dialog>
											<DialogTrigger asChild>
												<img
													src={data.kim_tomonidan.photo}
													alt='Yaratuvchi'
													className='w-5 h-5 rounded-full cursor-pointer ring-1 ring-border hover:ring-blue-400 transition-all object-cover'
												/>
											</DialogTrigger>
											<DialogContent className='max-w-xs p-2'>
												<VisuallyHidden>
													<DialogTitle>Yaratuvchi rasmi</DialogTitle>
												</VisuallyHidden>
												<img
													src={data.kim_tomonidan.photo}
													alt='Yaratuvchi rasmi'
													className='w-full h-auto rounded-lg'
												/>
											</DialogContent>
										</Dialog>
									) : null}
									<span>{data?.created_by || '—'}</span>
								</div>
							</InfoRow>

							<InfoRow
								icon={IconSection}
								label='Ariza beruvchi tuzilma'
								isTabler
							>
								{data?.kim_tomonidan?.name ? (
									<Badge
										variant='secondary'
										className='text-[11px] px-2 py-0.5 h-auto mt-0.5'
									>
										{data.kim_tomonidan.name}
									</Badge>
								) : (
									<span className='text-muted-foreground italic text-xs'>
										Mavjud emas
									</span>
								)}
							</InfoRow>
						</div>

						{/* Comments */}
						{(data?.comment || data?.extra_comment) && (
							<div className='space-y-3 border-t pt-4'>
								{data.comment && (
									<CommentBlock label='Muhokama' text={data.comment} />
								)}
								{data.extra_comment && data.extra_comment !== data.comment && (
									<CommentBlock
										label='Tezkor xabar'
										text={data.extra_comment}
										iconColor='text-violet-500 dark:text-violet-400'
									/>
								)}
							</div>
						)}
					</CardContent>
				</Card>

				{/* ── Images Card ────────────────────────────────────────────── */}
				<Card className='w-full shadow-sm border-border/50 dark:border-border/30'>
					<CardContent className='pt-5 space-y-3'>
						<div className='flex items-center gap-1.5'>
							<ImageIcon className='h-4 w-4 text-muted-foreground' />
							<p className='text-sm font-semibold'>
								Rasmlar
								{data?.rasmlar?.length > 0 && (
									<span className='ml-1 text-xs text-muted-foreground font-normal'>
										({data.rasmlar.length})
									</span>
								)}
							</p>
						</div>
						<ImageGrid
							rasmlar={data?.rasmlar}
							selectedImages={selectedImages}
							onToggle={toggleSelectImage}
							onImageClick={handleImageClick}
							onDownload={downloadImages}
						/>
					</CardContent>
				</Card>

				{/* ── Work Progress ──────────────────────────────────────────── */}
				<Coming_Application_Details_Work_Pogress data={data} />
			</div>

			{/* ── Image Modal ──────────────────────────────────────────────── */}
			<Dialog open={showImageModal} onOpenChange={setShowImageModal}>
				<DialogContent className='sm:max-w-lg w-full p-4 gap-3'>
					<DialogHeader>
						<DialogTitle className='text-base'>Rasm ko'rinishi</DialogTitle>
					</DialogHeader>
					{currentImage && (
						<>
							<div className='rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900'>
								<img
									src={currentImage || '/placeholder.svg'}
									alt='modal rasm'
									className='w-full h-auto max-h-[60vh] object-contain'
								/>
							</div>
							<Button
								variant='outline'
								onClick={() => handleDownloadFile(currentImage, 'image.jpg')}
								className='w-full gap-2'
								size='sm'
							>
								<Download className='h-4 w-4' />
								Yuklab olish
							</Button>
						</>
					)}
				</DialogContent>
			</Dialog>

			{/* ── File Modal ───────────────────────────────────────────────── */}
			<Dialog open={showFileModal} onOpenChange={setShowFileModal}>
				<DialogContent className='sm:max-w-md w-full gap-3'>
					<DialogHeader>
						<DialogTitle>Bildirgi fayli</DialogTitle>
					</DialogHeader>
					<div className='space-y-3'>
						{data?.comment && (
							<div className='rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground'>
								{data.comment}
							</div>
						)}
						{data?.extra_comment && (
							<div className='rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground'>
								{data.extra_comment}
							</div>
						)}
						{data?.bildirgi ? (
							<Button
								onClick={() => handleDownloadFile(data.bildirgi, 'bildirgi')}
								className='w-full gap-2'
							>
								<Download className='h-4 w-4' />
								Faylni yuklash
							</Button>
						) : (
							<p className='text-center text-sm text-muted-foreground py-2'>
								Fayl mavjud emas
							</p>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</ScrollArea>
	)
}
