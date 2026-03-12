import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from '@/components/ui/command'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogOverlay,
	DialogPortal,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Textarea } from '@/components/ui/textarea'
import {
	useAddPPRJadvalMutation,
	useCreated_PPRQuery,
	useMEQuery,
	useObyektOptionQuery,
	useObyektQuery,
	usePprTuriOptionQuery,
} from '@/services/api'
import {
	Building2,
	CalendarCheck2,
	Check,
	ChevronsUpDown,
	ClipboardList,
	Loader2,
	MessageSquare,
	Plus,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function AddPPRMonth({ startDate }) {
	const [openPpr, setOpenPpr] = useState(false)
	const [openObyekt, setOpenObyekt] = useState(false)
	const [open, setOpen] = useState(false)

	const { data } = useObyektQuery({ search: '' })
	const { data: pprs } = useCreated_PPRQuery()
	const [addPprJadval, { isLoading }] = useAddPPRJadvalMutation()

	const [edit, setEdit] = useState({
		status: 'jarayonda',
		obyektlar_ids: [],
		ppr_turi: '',
		comment: '',
		sana: startDate,
	})

	useEffect(() => {
		if (startDate) {
			setEdit(prev => ({ ...prev, sana: startDate }))
		}
	}, [startDate])

	const { data: obyektOption } = useObyektOptionQuery()
	const { data: pprTuriOption } = usePprTuriOptionQuery()
	const { data: me, isLoading: meLoading } = useMEQuery()

	const handleSubmit = async () => {
		try {
			await addPprJadval({ body: edit }).unwrap()
			toast.success('Muvaffaqiyatli saqlandi')
			setEdit({
				obyektlar_ids: [],
				ppr_turi: '',
				comment: '',
				sana: startDate,
				status: 'jarayonda',
			})
			setOpen(false)
		} catch (error) {
			toast.error('Nimadir xato ketdi')
		}
	}

	const toggleObyekt = id => {
		setEdit(prev => ({
			...prev,
			obyektlar_ids: prev.obyektlar_ids.includes(id)
				? prev.obyektlar_ids.filter(o => o !== id)
				: [...prev.obyektlar_ids, id],
		}))
	}

	const selectedLabels =
		edit.obyektlar_ids.length > 0
			? obyektOption?.results
					?.filter(o => edit.obyektlar_ids.includes(o.id))
					.map(o => o.obyekt_nomi)
					.join(', ')
			: ''

	const selectedPPR = pprTuriOption?.find(p => p.id === edit.ppr_turi)

	// Format date nicely
	const formattedDate = (() => {
		if (!startDate) return ''
		const d = new Date(startDate)
		if (isNaN(d)) return startDate
		return d.toLocaleDateString('uz-UZ', {
			weekday: 'long',
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		})
	})()

	if (me?.role !== 'bolim') return null

	return (
		<>
			{/* ➕ Trigger Button */}
			<button
				onClick={e => {
					e.stopPropagation()
					setOpen(true)
				}}
				disabled={isLoading || meLoading}
				className='absolute bottom-1 right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md hover:scale-110 hover:shadow-lg transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed z-10'
				title="PPR qo'shish"
			>
				<Plus size={11} strokeWidth={3} />
			</button>

			{/* 🪟 Modal */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogPortal>
					<DialogOverlay className='fixed inset-0 bg-black/60 backdrop-blur-sm' />

					<DialogContent className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-0 border-0 shadow-2xl rounded-2xl overflow-hidden bg-background focus:outline-none'>
						{/* ── Top color bar ── */}
						<div className='h-1 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/30' />

						{/* ── Header ── */}
						<div className='px-6 pt-5 pb-4 '>
							<div className='flex items-start justify-between gap-3'>
								<div className='flex items-center gap-3'>
									<div className='w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0'>
										<CalendarCheck2 size={18} className='text-primary' />
									</div>
									<div>
										<h2 className='text-sm font-bold text-foreground leading-tight'>
											Yangi PPR qo'shish
										</h2>
										<p className='text-xs text-muted-foreground mt-0.5 capitalize'>
											{formattedDate}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* ── Body ── */}
						<div className='px-6 py-5 flex flex-col gap-5'>
							{/* Obyekt */}
							<div className='flex flex-col gap-2'>
								<Label className='text-xs font-semibold text-foreground flex items-center gap-1.5'>
									<Building2 size={12} className='text-primary' />
									Obyekt
								</Label>
								<Popover open={openObyekt} onOpenChange={setOpenObyekt}>
									<PopoverTrigger asChild>
										<button className='w-full flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-primary/50 hover:bg-muted/30 transition-all duration-150 group'>
											<span
												className={`truncate text-left ${selectedLabels ? 'text-foreground' : 'text-muted-foreground'}`}
											>
												{selectedLabels || 'Obyektni tanlang'}
											</span>
											<div className='flex items-center gap-2 flex-shrink-0 ml-2'>
												{edit.obyektlar_ids.length > 0 && (
													<span className='inline-flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold'>
														{edit.obyektlar_ids.length}
													</span>
												)}
												<ChevronsUpDown
													size={14}
													className='text-muted-foreground group-hover:text-foreground transition-colors'
												/>
											</div>
										</button>
									</PopoverTrigger>
									<PopoverContent
										className='w-[420px] p-0 rounded-xl border border-border shadow-xl'
										align='start'
									>
										<Command>
											<div className='px-3 pt-3 pb-2 border-b border-border'>
												<CommandInput
													placeholder='Qidirish...'
													className='text-sm'
												/>
											</div>
											<CommandEmpty className='py-8 text-center text-sm text-muted-foreground'>
												Hech narsa topilmadi
											</CommandEmpty>
											<CommandGroup className='max-h-52 overflow-y-auto p-2'>
												{obyektOption?.results?.map(option => {
													const checked = edit.obyektlar_ids.includes(option.id)
													return (
														<CommandItem
															key={option.id}
															onSelect={() => toggleObyekt(option.id)}
															className={`flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer transition-colors ${checked ? 'bg-primary/8' : 'hover:bg-muted'}`}
														>
															<Checkbox
																checked={checked}
																className='pointer-events-none'
															/>
															<span className='text-sm flex-1'>
																{option.obyekt_nomi}
															</span>
															{checked && (
																<Check size={13} className='text-primary' />
															)}
														</CommandItem>
													)
												})}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
							</div>

							{/* PPR turi */}
							<div className='flex flex-col gap-2'>
								<Label className='text-xs font-semibold text-foreground flex items-center gap-1.5'>
									<ClipboardList size={12} className='text-primary' />
									PPR turi
								</Label>
								<Popover open={openPpr} onOpenChange={setOpenPpr}>
									<PopoverTrigger asChild>
										<button className='w-full flex items-center justify-between rounded-xl border border-border bg-background px-3 py-2.5 text-sm hover:border-primary/50 hover:bg-muted/30 transition-all duration-150 group'>
											<span
												className={
													selectedPPR
														? 'text-foreground'
														: 'text-muted-foreground'
												}
											>
												{selectedPPR?.qisqachanomi || 'PPR turini tanlang'}
											</span>
											<ChevronsUpDown
												size={14}
												className='text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0 ml-2'
											/>
										</button>
									</PopoverTrigger>
									<PopoverContent
										className='w-[420px] p-0 rounded-xl border border-border shadow-xl'
										align='start'
									>
										<Command>
											<div className='px-3 pt-3 pb-2 border-b border-border'>
												<CommandInput
													placeholder='Qidirish...'
													className='text-sm'
												/>
											</div>
											<CommandEmpty className='py-8 text-center text-sm text-muted-foreground'>
												Topilmadi
											</CommandEmpty>
											<CommandGroup className='max-h-52 overflow-y-auto p-2'>
												{pprTuriOption?.map(p => (
													<CommandItem
														key={p.id}
														value={p.qisqachanomi}
														onSelect={() => {
															setEdit(prev => ({ ...prev, ppr_turi: p.id }))
															setOpenPpr(false)
														}}
														className={`flex items-center gap-2.5 rounded-lg px-3 py-2 cursor-pointer transition-colors ${edit.ppr_turi === p.id ? 'bg-primary/8' : 'hover:bg-muted'}`}
													>
														<div
															className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${edit.ppr_turi === p.id ? 'border-primary bg-primary' : 'border-muted-foreground/40'}`}
														>
															{edit.ppr_turi === p.id && (
																<Check
																	size={9}
																	className='text-primary-foreground'
																	strokeWidth={3}
																/>
															)}
														</div>
														<span className='text-sm'>{p.qisqachanomi}</span>
													</CommandItem>
												))}
											</CommandGroup>
										</Command>
									</PopoverContent>
								</Popover>
							</div>

							{/* Comment */}
							<div className='flex flex-col gap-2'>
								<Label className='text-xs font-semibold text-foreground flex items-center gap-1.5'>
									<MessageSquare size={12} className='text-primary' />
									Izoh
									<span className='text-muted-foreground font-normal'>
										(ixtiyoriy)
									</span>
								</Label>
								<Textarea
									placeholder='Izoh yozing...'
									value={edit.comment}
									onChange={e =>
										setEdit(prev => ({ ...prev, comment: e.target.value }))
									}
									rows={3}
									className='resize-none rounded-xl border-border bg-background text-sm placeholder:text-muted-foreground/60 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all'
								/>
							</div>
						</div>

						{/* ── Footer ── */}
						<div className='px-6 pb-5 flex items-center gap-3'>
							<DialogClose asChild>
								<Button
									variant='outline'
									className='flex-1 rounded-xl font-medium h-10'
									disabled={isLoading}
								>
									Bekor qilish
								</Button>
							</DialogClose>
							<Button
								onClick={handleSubmit}
								disabled={isLoading || !edit.ppr_turi}
								className='flex-1 rounded-xl font-semibold h-10 gap-2'
							>
								{isLoading ? (
									<>
										<Loader2 size={14} className='animate-spin' />
										Saqlanmoqda...
									</>
								) : (
									<>
										<Check size={14} />
										Saqlash
									</>
								)}
							</Button>
						</div>
					</DialogContent>
				</DialogPortal>
			</Dialog>
		</>
	)
}
