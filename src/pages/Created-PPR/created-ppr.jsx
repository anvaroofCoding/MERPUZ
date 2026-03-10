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
import { EmptyOutline } from '@/components/Empty/not_found'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
	useCreated_PPR_EditMutation,
	useCreated_PPR_PostMutation,
	useCreated_PPRQuery,
	useOptionAplicationQuery,
	useOptionTuzilmaQuery,
} from '@/services/api'
import {
	CloudDownload,
	FileText,
	MoreVertical,
	Pencil,
	Plus,
	Save,
	Search,
	Upload,
	X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Edit_Useful_Person } from '../Created_Profile/edit_useful_person'

/* ─── reusable form field ─────────────────────────────────── */
const Field = ({ label, children, required }) => (
	<div className='flex flex-col gap-1.5'>
		<Label className='text-sm font-semibold text-foreground flex items-center gap-1'>
			{label}
			{required && <span className='text-destructive text-xs'>*</span>}
		</Label>
		{children}
	</div>
)

/* ─── file upload button ──────────────────────────────────── */
const FileUploadBtn = ({
	file,
	onChange,
	accept = '.pdf,.doc,.docx,.jpg,.png',
}) => (
	<div className='flex flex-col gap-2'>
		<label className='flex items-center gap-3 px-4 py-3 border border-dashed border-primary/40 rounded-xl cursor-pointer hover:bg-primary/5 hover:border-primary/70 transition-all group'>
			<Upload
				size={16}
				className='text-muted-foreground group-hover:text-primary transition-colors shrink-0'
			/>
			<span className='text-sm text-muted-foreground group-hover:text-foreground transition-colors truncate flex-1'>
				{file ? file.name : 'Fayl tanlash'}
			</span>
			{file && (
				<span className='text-[10px] font-semibold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full shrink-0'>
					yuklandi
				</span>
			)}
			<input
				type='file'
				className='hidden'
				accept={accept}
				onChange={onChange}
			/>
		</label>
	</div>
)

/* ─── PPR form ────────────────────────────────────────────── */
const PPRForm = ({
	form,
	onChange,
	onFileChange,
	onSubmit,
	loading,
	title,
}) => (
	<div className='flex flex-col gap-5'>
		<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
			<Field label='Nomi' required>
				<Input
					placeholder='PPRning asl nomini kiriting'
					value={form.nomi}
					onChange={e => onChange('nomi', e.target.value)}
					className='rounded-xl bg-background border-border focus:border-primary/50 h-10'
				/>
			</Field>

			<Field label='Qisqacha nomi' required>
				<Select
					value={form.qisqachanomi}
					onValueChange={v => onChange('qisqachanomi', v)}
				>
					<SelectTrigger className='rounded-xl bg-background border-border h-10'>
						<SelectValue placeholder='Tanlang...' />
					</SelectTrigger>
					<SelectContent>
						{['PPR-1', 'PPR-2', 'PPR-3', 'PPR-4', 'PPR-5'].map(v => (
							<SelectItem key={v} value={v}>
								{v}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</Field>
		</div>

		<div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
			<Field label='Davriyligi (raqam)'>
				<Input
					type='number'
					placeholder='Masalan: 10'
					value={form.davriyligi}
					onChange={e => onChange('davriyligi', e.target.value)}
					className='rounded-xl bg-background border-border focus:border-primary/50 h-10'
				/>
			</Field>

			<Field label='Vaqt birligi'>
				<Select value={form.vaqti} onValueChange={v => onChange('vaqti', v)}>
					<SelectTrigger className='rounded-xl bg-background border-border h-10'>
						<SelectValue placeholder='Tanlang...' />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='soat'>Soat</SelectItem>
						<SelectItem value='kun'>Kun</SelectItem>
						<SelectItem value='oy'>Oy</SelectItem>
					</SelectContent>
				</Select>
			</Field>
		</div>

		<Field label='Qatnashuvchilar'>
			<Input
				placeholder="Masalan: Texnik bo'lim"
				value={form.kimlar_qiladi}
				onChange={e => onChange('kimlar_qiladi', e.target.value)}
				className='rounded-xl bg-background border-border focus:border-primary/50 h-10'
			/>
		</Field>

		<Field label="Batafsil ma'lumot">
			<Textarea
				placeholder='PPR turi haqida izoh yozing...'
				value={form.comment}
				onChange={e => onChange('comment', e.target.value)}
				className='rounded-xl bg-background border-border resize-none min-h-[90px] text-sm'
			/>
		</Field>

		<Field label='Fayl biriktirish'>
			<FileUploadBtn file={form.file} onChange={onFileChange} />
		</Field>

		<Button
			onClick={onSubmit}
			disabled={loading}
			className='w-full h-11 rounded-xl font-semibold flex items-center gap-2'
		>
			{loading ? (
				<span className='w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin' />
			) : (
				<Save size={15} />
			)}
			{loading ? 'Saqlanmoqda...' : 'Saqlash'}
		</Button>
	</div>
)

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════════ */
export default function Created_PPR() {
	const [open, setOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [page, setPage] = useState(1)
	const limit = 50
	const [editModal, setEditModal] = useState(false)
	const [editData, setEditData] = useState(null)
	const [show, setShow] = useState(false)

	const emptyForm = {
		nomi: '',
		qisqachanomi: '',
		davriyligi: '',
		vaqti: '',
		comment: '',
		kimlar_qiladi: '',
		file: null,
	}

	const [form, setForm] = useState(emptyForm)
	const [formEdit, setFormEdit] = useState(emptyForm)

	useEffect(() => {
		if (editData) {
			setFormEdit({
				nomi: editData.nomi || '',
				qisqachanomi: editData.qisqachanomi || '',
				davriyligi: editData.davriyligi || '',
				vaqti: editData.vaqti || '',
				comment: editData.comment || '',
				kimlar_qiladi: editData.kimlar_qiladi || '',
				file: null,
			})
		}
	}, [editData])

	const { data, isLoading } = useCreated_PPRQuery()
	const { isLoading: OptionAplicationLoading } = useOptionAplicationQuery()
	const { isLoading: OptionTuzilmaLoader } = useOptionTuzilmaQuery()
	const [AddPPRTuri, { isError, error, isLoading: load }] =
		useCreated_PPR_PostMutation()
	const [EditPPRTuri] = useCreated_PPR_EditMutation()

	const handleSubmit = async () => {
		try {
			const fd = new FormData()
			fd.append('nomi', form.nomi)
			fd.append('qisqachanomi', form.qisqachanomi)
			fd.append('davriyligi', Number(form.davriyligi))
			fd.append('vaqti', form.vaqti)
			fd.append('comment', form.comment)
			fd.append('kimlar_qiladi', form.kimlar_qiladi)
			if (form.file) fd.append('file', form.file)

			toast.promise(AddPPRTuri({ body: fd }).unwrap(), {
				loading: "Ma'lumotlar yuborilmoqda...",
				success: 'Muvaffaqiyatli yuborildi!',
			})
			setForm(emptyForm)
			setShow(false)
		} catch (err) {
			console.error(err)
		}
	}

	const handleEditSubmit = async () => {
		try {
			const fd = new FormData()
			fd.append('nomi', formEdit.nomi)
			fd.append('qisqachanomi', formEdit.qisqachanomi)
			fd.append('davriyligi', Number(formEdit.davriyligi))
			fd.append('vaqti', formEdit.vaqti)
			fd.append('comment', formEdit.comment)
			fd.append('kimlar_qiladi', formEdit.kimlar_qiladi)
			if (formEdit.file) fd.append('file', formEdit.file)

			toast.promise(EditPPRTuri({ body: fd, id: editData.id }).unwrap(), {
				loading: "Ma'lumotlar tahrirlanmoqda...",
				success: 'Muvaffaqiyatli tahrirlandi!',
			})
			setOpen(false)
		} catch (err) {
			console.error(err)
		}
	}

	useEffect(() => {
		if (isError && error?.data?.file) {
			toast.error('Fayl yuborishingiz shart!')
			setForm(emptyForm)
		}
	}, [isError, error])

	const totalPages = Math.ceil((data?.count || 0) / limit)
	const tableLoading =
		isLoading || OptionTuzilmaLoader || OptionAplicationLoading

	return (
		<div className='w-full space-y-4'>
			{/* ── Edit Dialog ── */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogPortal>
					<DialogOverlay className='fixed inset-0 z-50 bg-black/70 backdrop-blur-sm' />
					<DialogContent className='fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100vw-24px)] sm:max-w-lg bg-card border border-border rounded-3xl p-0 shadow-2xl overflow-hidden'>
						{/* header */}
						<div className='flex items-start justify-between px-6 pt-6 pb-4 border-b border-border bg-muted/20'>
							<DialogHeader className='gap-1'>
								<DialogTitle className='text-lg font-bold text-foreground'>
									PPR turini tahrirlash
								</DialogTitle>
								<DialogDescription className='text-sm text-muted-foreground'>
									Eski ma'lumotlar yangilari bilan almashtiriladi.
								</DialogDescription>
							</DialogHeader>
							<DialogClose className='w-8 h-8 flex items-center justify-center rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shrink-0'>
								<X size={16} />
							</DialogClose>
						</div>

						{/* body */}
						<div className='px-6 py-5 max-h-[75vh] overflow-y-auto'>
							<PPRForm
								form={formEdit}
								onChange={(k, v) => setFormEdit(p => ({ ...p, [k]: v }))}
								onFileChange={e => {
									const file = e.target.files[0]
									if (file) setFormEdit(p => ({ ...p, file }))
								}}
								onSubmit={handleEditSubmit}
								title='Tahrirlash'
							/>
						</div>
					</DialogContent>
				</DialogPortal>
			</Dialog>

			{/* ── Top controls ── */}
			<div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3'>
				{/* search */}
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
					<Input
						placeholder='Qidirish...'
						className='pl-10 rounded-xl bg-card border-border h-10'
						value={searchTerm}
						disabled
						onChange={e => setSearchTerm(e.target.value)}
					/>
				</div>

				{/* add toggle */}
				<Button
					variant={show ? 'destructive' : 'default'}
					onClick={() => setShow(p => !p)}
					className='rounded-xl h-10 flex items-center gap-2 shrink-0'
				>
					{show ? (
						<>
							<X size={15} />
							Yopish
						</>
					) : (
						<>
							<Plus size={15} />
							Qo'shish
						</>
					)}
				</Button>
			</div>

			{/* ── Add form (collapsible) ── */}
			{show && (
				<div className='rounded-2xl border border-border bg-card shadow-sm overflow-hidden'>
					{/* form header */}
					<div className='flex items-center justify-between px-5 sm:px-6 py-4 border-b border-border bg-muted/20'>
						<div>
							<h3 className='text-sm font-bold text-foreground'>
								Yangi PPR turi qo'shish
							</h3>
							<p className='text-xs text-muted-foreground mt-0.5'>
								Barcha majburiy maydonlarni to'ldiring
							</p>
						</div>
						<div className='w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center'>
							<FileText size={15} className='text-primary' />
						</div>
					</div>

					<div className='px-5 sm:px-6 py-5'>
						<PPRForm
							form={form}
							onChange={(k, v) => setForm(p => ({ ...p, [k]: v }))}
							onFileChange={e => {
								const file = e.target.files[0]
								if (file) setForm(p => ({ ...p, file }))
							}}
							onSubmit={handleSubmit}
							loading={load}
						/>
					</div>
				</div>
			)}

			{/* ── Table ── */}
			<div className='rounded-2xl border border-border bg-card overflow-hidden shadow-sm'>
				{/* mobile: card list | desktop: table */}

				{/* DESKTOP TABLE */}
				<div className='hidden sm:block overflow-x-auto'>
					<Table>
						<TableHeader>
							<TableRow className='hover:bg-transparent border-b border-border bg-muted/30'>
								<TableHead className='font-semibold text-foreground text-xs uppercase tracking-wider w-[130px]'>
									Qisqa nomi
								</TableHead>
								<TableHead className='font-semibold text-foreground text-xs uppercase tracking-wider'>
									Nomi
								</TableHead>
								<TableHead className='font-semibold text-foreground text-xs uppercase tracking-wider w-[130px]'>
									Davriyligi
								</TableHead>
								<TableHead className='font-semibold text-foreground text-xs uppercase tracking-wider w-[160px]'>
									Qatnashuvchilar
								</TableHead>
								<TableHead className='font-semibold text-foreground text-xs uppercase tracking-wider'>
									Izoh
								</TableHead>
								<TableHead className='w-[60px]' />
							</TableRow>
						</TableHeader>
						<TableBody>
							{tableLoading ? (
								[...Array(8)].map((_, i) => (
									<TableRow key={i} className='border-b border-border/50'>
										{[...Array(6)].map((_, j) => (
											<TableCell key={j}>
												<Skeleton className='h-5 w-full rounded-lg' />
											</TableCell>
										))}
									</TableRow>
								))
							) : data?.length > 0 ? (
								data.map((item, index) => (
									<TableRow
										key={item.id}
										className={`border-b border-border/40 hover:bg-muted/40 transition-colors ${
											index % 2 === 0 ? '' : 'bg-muted/10'
										}`}
									>
										<TableCell>
											<span className='text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-lg'>
												{item.qisqachanomi || '—'}
											</span>
										</TableCell>
										<TableCell className='font-medium text-foreground text-sm'>
											{item.nomi || 'Mavjud emas'}
										</TableCell>
										<TableCell>
											{item.davriyligi ? (
												<Badge
													variant='outline'
													className='rounded-lg text-xs font-semibold'
												>
													{item.davriyligi} {item.vaqti}
												</Badge>
											) : (
												<span className='text-muted-foreground text-xs'>—</span>
											)}
										</TableCell>
										<TableCell>
											{item.kimlar_qiladi ? (
												<Badge className='rounded-lg text-xs'>
													{item.kimlar_qiladi}
												</Badge>
											) : (
												<span className='text-muted-foreground text-xs'>—</span>
											)}
										</TableCell>
										<TableCell className='text-sm text-muted-foreground max-w-[280px]'>
											<p className='truncate'>{item.comment || '—'}</p>
										</TableCell>
										<TableCell>
											<RowActions
												item={item}
												onEdit={() => {
													setEditData(item)
													setOpen(true)
												}}
											/>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={6} className='py-16 text-center'>
										<EmptyOutline />
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>

				{/* MOBILE: card list */}
				<div className='sm:hidden divide-y divide-border'>
					{tableLoading ? (
						[...Array(5)].map((_, i) => (
							<div key={i} className='p-4 space-y-2'>
								<Skeleton className='h-4 w-1/3 rounded-lg' />
								<Skeleton className='h-4 w-2/3 rounded-lg' />
								<Skeleton className='h-4 w-1/2 rounded-lg' />
							</div>
						))
					) : data?.length > 0 ? (
						data.map(item => (
							<div
								key={item.id}
								className='p-4 space-y-3 hover:bg-muted/30 transition-colors'
							>
								<div className='flex items-start justify-between gap-2'>
									<div className='space-y-1'>
										<div className='flex items-center gap-2 flex-wrap'>
											<span className='text-xs font-bold text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-md'>
												{item.qisqachanomi || '—'}
											</span>
											{item.davriyligi && (
												<Badge variant='outline' className='text-xs rounded-md'>
													{item.davriyligi} {item.vaqti}
												</Badge>
											)}
										</div>
										<p className='text-sm font-semibold text-foreground'>
											{item.nomi || 'Mavjud emas'}
										</p>
									</div>
									<RowActions
										item={item}
										onEdit={() => {
											setEditData(item)
											setOpen(true)
										}}
									/>
								</div>

								{item.kimlar_qiladi && (
									<div className='flex items-center gap-1.5'>
										<span className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
											Qatnashuvchilar:
										</span>
										<Badge className='text-xs rounded-md'>
											{item.kimlar_qiladi}
										</Badge>
									</div>
								)}

								{item.comment && (
									<p className='text-xs text-muted-foreground bg-muted/50 rounded-xl px-3 py-2 leading-relaxed line-clamp-2'>
										{item.comment}
									</p>
								)}
							</div>
						))
					) : (
						<div className='py-16 flex justify-center'>
							<EmptyOutline />
						</div>
					)}
				</div>
			</div>

			{/* Edit_Useful_Person */}
			<Edit_Useful_Person
				data={editData}
				open={editModal}
				setOpen={setEditModal}
			/>

			{/* ── Pagination ── */}
			{data?.results?.length > 0 && (
				<div className='pt-2'>
					<Pagination>
						<PaginationContent>
							<PaginationItem>
								<PaginationPrevious
									href='#'
									onClick={() => page > 1 && setPage(page - 1)}
									className='rounded-xl'
								/>
							</PaginationItem>
							{[...Array(totalPages)].map((_, i) => {
								const p = i + 1
								return (
									<PaginationItem key={p}>
										<PaginationLink
											href='#'
											isActive={page === p}
											onClick={() => setPage(p)}
											className='rounded-xl'
										>
											{p}
										</PaginationLink>
									</PaginationItem>
								)
							})}
							<PaginationItem>
								<PaginationNext
									href='#'
									onClick={() => page < totalPages && setPage(page + 1)}
									className='rounded-xl'
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}
		</div>
	)
}

/* ─── Row actions dropdown ────────────────────────────────── */
const RowActions = ({ item, onEdit }) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button
				variant='ghost'
				size='sm'
				className='h-8 w-8 p-0 rounded-xl hover:bg-muted shrink-0'
			>
				<MoreVertical className='w-4 h-4' />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent
			align='end'
			className='rounded-2xl border-border w-48 shadow-lg'
		>
			<DropdownMenuItem
				onClick={onEdit}
				className='rounded-xl gap-2 cursor-pointer'
			>
				<Pencil size={14} />
				Tahrirlash
			</DropdownMenuItem>
			<DropdownMenuItem
				onClick={() => {
					if (item.file) window.location.href = item.file
				}}
				className='rounded-xl gap-2 cursor-pointer'
				disabled={!item.file}
			>
				<CloudDownload size={14} />
				Faylni yuklab olish
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
)
