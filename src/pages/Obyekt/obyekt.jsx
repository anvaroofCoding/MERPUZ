import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
} from '@/components/animate-ui/primitives/radix/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useObyekt_postMutation, useObyektQuery } from '@/services/api'
import {
	Edit,
	FilePlusCorner,
	MapPin,
	MoreVertical,
	Plus,
	Search,
	X,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

function ObyektSkeleton() {
	return (
		<Card className='border-border'>
			<CardContent className='p-4 flex items-start justify-between gap-3'>
				<div className='space-y-2 flex-1'>
					<Skeleton className='h-4 w-28' />
					<Skeleton className='h-3 w-44' />
				</div>
				<Skeleton className='h-8 w-8 rounded-md shrink-0' />
			</CardContent>
		</Card>
	)
}

export default function Obyekt() {
	const navigate = useNavigate()
	const [form, setForm] = useState({ obyekt_nomi: '', toliq_nomi: '' })
	const [searchTerm, setSearchTerm] = useState('')
	const [open, setOpen] = useState(false)

	const { data: response, isLoading } = useObyektQuery({ search: searchTerm })
	const [Obyekt_post, { isLoading: Load }] = useObyekt_postMutation()

	const handleChanges = (name, value) =>
		setForm(prev => ({ ...prev, [name]: value }))

	const handleEditSubmit = async () => {
		try {
			await Obyekt_post({
				body: {
					obyekt_nomi: form.obyekt_nomi,
					toliq_nomi: form.toliq_nomi,
				},
			}).unwrap()
			toast.success("Obyekt muvaffaqiyatli qo'shildi")
			setOpen(false)
			setForm({ obyekt_nomi: '', toliq_nomi: '' })
		} catch (error) {
			if (error?.data?.obyekt_nomi) {
				toast.error('Obyektning nomini yozishingiz kerak')
			}
			if (error?.data?.toliq_nomi) {
				toast.error(error?.data?.toliq_nomi[0])
			}
		}
	}

	const results = response?.results ?? []

	/* ── SKELETON ── */
	if (isLoading) {
		return (
			<div>
				<div className='flex flex-col sm:flex-row w-full gap-3 mb-5'>
					<Skeleton className='h-10 w-full rounded-md' />
					<Skeleton className='h-10 w-32 rounded-md shrink-0' />
				</div>
				<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<ObyektSkeleton key={i} />
					))}
				</div>
			</div>
		)
	}

	return (
		<div>
			{/* ── TOOLBAR ── */}
			<div className='flex flex-col sm:flex-row w-full gap-3 mb-5'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none' />
					<Input
						placeholder="Obyekt nomi bo'yicha qidiring..."
						className='pl-9 bg-card border-border'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</div>
				<Button onClick={() => setOpen(true)} className='shrink-0 gap-1.5'>
					Qo'shish
					<FilePlusCorner size={16} />
				</Button>
			</div>

			{/* ── EMPTY STATE ── */}
			{results.length === 0 && (
				<div className='flex flex-col items-center justify-center py-20 text-muted-foreground gap-3'>
					<MapPin className='w-10 h-10 opacity-30' />
					<p className='text-sm'>Obyektlar topilmadi</p>
				</div>
			)}

			{/* ── GRID ── */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3'>
				{results.map(item => (
					<Card
						key={item.id}
						className='border-border hover:shadow-md transition-shadow duration-200 bg-card'
					>
						<CardContent className='p-4 flex items-start justify-between gap-3'>
							{/* Info */}
							<div className='space-y-1 min-w-0 flex-1'>
								<p className='font-semibold text-sm leading-tight truncate'>
									{item.obyekt_nomi}
								</p>
								<p className='text-xs text-muted-foreground leading-tight break-all line-clamp-2'>
									{item.toliq_nomi}
								</p>
								{/* Location badge */}
								<span
									className={`inline-flex items-center gap-1 text-[11px] font-medium px-1.5 py-0.5 rounded-sm mt-1 ${
										item?.location
											? 'bg-primary/10 text-primary'
											: 'bg-muted text-muted-foreground'
									}`}
								>
									<MapPin className='w-2.5 h-2.5' />
									{item?.location ? 'Lokatsiya bor' : "Lokatsiya yo'q"}
								</span>
							</div>

							{/* 3-dot menu */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant='ghost'
										size='icon'
										className='h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground'
									>
										<MoreVertical className='h-4 w-4' />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end' className='w-48'>
									<DropdownMenuItem
										onClick={() =>
											navigate(
												`${encodeURIComponent(item.toliq_nomi)}/${item?.location?.lat}/${item?.location?.lng}`,
											)
										}
									>
										<MapPin className='mr-2 h-4 w-4' />
										Lokatsiyani ko'rish
									</DropdownMenuItem>

									{item?.location ? (
										<DropdownMenuItem
											onClick={() =>
												navigate(
													`${encodeURIComponent(item.toliq_nomi)}/${item?.location?.id}/tahrirlash/${item.id}`,
												)
											}
										>
											<Edit className='mr-2 h-4 w-4' />
											Tahrirlash
										</DropdownMenuItem>
									) : (
										<DropdownMenuItem
											onClick={() =>
												navigate(
													`${encodeURIComponent(item.toliq_nomi)}/${item.id}`,
												)
											}
										>
											<Plus className='mr-2 h-4 w-4' />
											Lokatsiya qo'shish
										</DropdownMenuItem>
									)}
								</DropdownMenuContent>
							</DropdownMenu>
						</CardContent>
					</Card>
				))}
			</div>

			{/* ── DIALOG ── */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogPortal>
					<DialogOverlay className='fixed inset-0 z-50 bg-black/70' />
					<DialogContent className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-background border border-border rounded-xl p-6 shadow-xl'>
						<DialogClose className='absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors'>
							<X className='size-4' />
							<span className='sr-only'>Close</span>
						</DialogClose>

						<DialogHeader className='mb-5'>
							<DialogTitle className='text-base font-semibold'>
								Obyekt qo'shish
							</DialogTitle>
							<DialogDescription className='text-sm text-muted-foreground'>
								Iltimos, obyekt ma'lumotlarini kiriting
							</DialogDescription>
						</DialogHeader>

						<div className='flex flex-col gap-4'>
							<div className='grid sm:grid-cols-2 grid-cols-1 gap-4'>
								<div className='flex flex-col gap-1.5'>
									<Label className='text-xs font-medium'>Qisqa nomi</Label>
									<Input
										placeholder='Masalan: NIB-IKT'
										value={form.obyekt_nomi}
										onChange={e => handleChanges('obyekt_nomi', e.target.value)}
									/>
								</div>
								<div className='flex flex-col gap-1.5'>
									<Label className='text-xs font-medium'>To'liq nomi</Label>
									<Input
										placeholder="To'liq nomini kiriting"
										value={form.toliq_nomi}
										onChange={e => handleChanges('toliq_nomi', e.target.value)}
									/>
								</div>
							</div>

							<div className='flex gap-2 pt-1'>
								<Button
									variant='outline'
									className='flex-1'
									onClick={() => setOpen(false)}
									disabled={Load}
								>
									Bekor qilish
								</Button>
								<Button
									disabled={Load}
									onClick={handleEditSubmit}
									className='flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold'
								>
									{Load ? 'Saqlanmoqda...' : 'Saqlash'}
								</Button>
							</div>
						</div>
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</div>
	)
}
