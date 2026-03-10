import { EmptyOutline } from '@/components/Empty/not_found'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { useMEQuery, useRegisterQuery } from '@/services/api'
import { IconCircleCheckFilled, IconLoader } from '@tabler/icons-react'
import { Eye, MoreVertical, Search, UserRoundPen, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CreatedBolumNAme } from './created.Bolum.Name'
import { Edit_Useful_Person } from './edit_useful_person'
import { ForAdmin_Post_Bolum_Useful_Person } from './For.admin_Post_Bolum_useful_person'
import { Post_Bolum_Useful_Person } from './post_bolum_useful_person'
import { Post_Monitoring_Useful_Person } from './post_monitoring_useful_person'
import { Post_Useful_Person } from './post_useful_person'

const roleConfig = {
	admin: {
		label: 'Admin',
		color: 'bg-violet-100 text-violet-700 border-violet-200',
	},
	monitoring: {
		label: 'Monitoring',
		color: 'bg-blue-100 text-blue-700 border-blue-200',
	},
	tarkibiy: {
		label: 'Tarkibiy Rahbar',
		color: 'bg-amber-100 text-amber-700 border-amber-200',
	},
	bekat: {
		label: 'Bekat Rahbari',
		color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
	},
	bolim: {
		label: 'Xodim',
		color: 'bg-secondary text-secondary-foreground border-border',
	},
}

export default function Useful_Person() {
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState('')
	const [page, setPage] = useState(1)
	const pageSize = 10
	const [editModal, setEditModal] = useState(false)
	const [editData, setEditData] = useState(null)

	const { data, isLoading } = useRegisterQuery({
		page,
		limit: pageSize,
		search: searchTerm,
	})
	const { data: me, isLoading: MeLoading } = useMEQuery()
	const totalPages = Math.ceil((data?.count || 0) / pageSize)

	useEffect(() => {
		setPage(1)
	}, [searchTerm])

	const renderRole = role => roleConfig[role]?.label || "Noma'lum"
	const getRoleColor = role =>
		roleConfig[role]?.color ||
		'bg-secondary text-secondary-foreground border-border'

	return (
		<div className='w-full space-y-5 p-1'>
			{/* ── PAGE HEADER ── */}
			<div className='flex flex-col gap-1 pb-1'>
				<div className='flex items-center gap-2'>
					<div className='flex items-center justify-center w-8 h-8 rounded-lg bg-primary'>
						<Users className='w-4 h-4 text-primary-foreground' />
					</div>
					<h1 className='text-xl font-semibold tracking-tight text-foreground'>
						Foydalanuvchilar
					</h1>
					{data?.count != null && (
						<span className='ml-1 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20'>
							{data.count}
						</span>
					)}
				</div>
				<p className='text-sm text-muted-foreground pl-10'>
					Tizim foydalanuvchilari ro'yxati va ularni boshqarish
				</p>
			</div>

			{/* ── TOOLBAR ── */}
			<div className='flex flex-col sm:flex-row gap-3'>
				{/* Search */}
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground' />
					<Input
						className='pl-9 h-9 rounded-lg text-sm focus-visible:ring-primary'
						placeholder='Foydalanuvchi qidirish...'
						value={searchTerm}
						onChange={e => setSearchTerm(e.target.value)}
						autoComplete='off'
					/>
				</div>

				{/* Action buttons */}
				<div className='flex gap-2 flex-wrap'>
					{me?.role === 'admin' && <Post_Useful_Person />}
					{me?.role === 'tarkibiy' && (
						<Post_Bolum_Useful_Person id={me?.tarkibiy_tuzilma_id} />
					)}
					{me?.role === 'admin' && (
						<ForAdmin_Post_Bolum_Useful_Person id={me?.tarkibiy_tuzilma_id} />
					)}
					{me?.role === 'admin' && (
						<Post_Monitoring_Useful_Person id={me?.tarkibiy_tuzilma_id} />
					)}
					<CreatedBolumNAme />
				</div>
			</div>

			{/* ── TABLE ── */}
			<div className='rounded-xl border bg-card overflow-hidden shadow-sm'>
				{/* Mobile card view (hidden on md+) */}
				<div className='block md:hidden divide-y'>
					{isLoading || MeLoading ? (
						[...Array(6)].map((_, i) => (
							<div key={i} className='flex items-center gap-3 p-4'>
								<Skeleton className='w-10 h-10 rounded-full shrink-0' />
								<div className='flex-1 space-y-2'>
									<Skeleton className='h-4 w-32' />
									<Skeleton className='h-3 w-24' />
								</div>
								<Skeleton className='h-6 w-16 rounded-full' />
							</div>
						))
					) : data?.results?.length ? (
						data.results.map(item => (
							<div
								key={item.id}
								className='flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors'
							>
								<Avatar className='w-10 h-10 shrink-0 ring-2 ring-border'>
									<AvatarImage src={item.photo} />
									<AvatarFallback className='bg-primary/10 text-primary font-semibold text-sm'>
										{item.username?.[0]?.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className='flex-1 min-w-0'>
									<p className='text-sm font-medium text-foreground truncate'>
										{item.username}
									</p>
									<p className='text-xs text-muted-foreground truncate'>
										{item.rahbari || '—'}
									</p>
									<div className='flex items-center gap-2 mt-1.5'>
										<span
											className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(item.role)}`}
										>
											{renderRole(item.role)}
										</span>
										<span
											className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${
												item.status
													? 'bg-emerald-100 text-emerald-700 border-emerald-200'
													: 'bg-secondary text-secondary-foreground border-border'
											}`}
										>
											{item.status ? (
												<IconCircleCheckFilled size={11} />
											) : (
												<IconLoader size={11} />
											)}
											{item.status ? 'Faol' : 'Faol emas'}
										</span>
									</div>
								</div>
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button
											variant='ghost'
											size='icon'
											className='w-8 h-8 shrink-0'
										>
											<MoreVertical className='w-4 h-4' />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align='end' className='w-44'>
										<DropdownMenuItem
											onClick={() => navigate(`${item.username}/${item.id}`)}
											className='gap-2 text-sm cursor-pointer'
										>
											<Eye className='w-4 h-4' /> Ko'rish
										</DropdownMenuItem>
										<DropdownMenuItem
											onClick={() => {
												setEditData(item)
												setEditModal(true)
											}}
											className='gap-2 text-sm cursor-pointer'
										>
											<UserRoundPen className='w-4 h-4' /> Tahrirlash
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						))
					) : (
						<div className='py-16 flex flex-col items-center justify-center text-center'>
							<EmptyOutline />
							<p className='mt-3 text-sm text-slate-400 dark:text-slate-500'>
								Foydalanuvchilar topilmadi
							</p>
						</div>
					)}
				</div>

				{/* Desktop table (hidden on mobile) */}
				<div className='hidden md:block'>
					<Table>
						<TableHeader>
							<TableRow className='bg-muted/50 border-b hover:bg-muted/50'>
								<TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 pl-5'>
									Foydalanuvchi
								</TableHead>
								<TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3'>
									FIO
								</TableHead>
								<TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3'>
									Roli
								</TableHead>
								<TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3'>
									Status
								</TableHead>
								<TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3'>
									Faoliyati
								</TableHead>
								<TableHead className='text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 pr-5 text-right'>
									Amallar
								</TableHead>
							</TableRow>
						</TableHeader>

						<TableBody>
							{isLoading || MeLoading ? (
								[...Array(10)].map((_, i) => (
									<TableRow
										key={i}
										className='border-b border-slate-100 dark:border-slate-800'
									>
										<TableCell className='pl-5'>
											<div className='flex items-center gap-3'>
												<Skeleton className='w-9 h-9 rounded-full' />
												<Skeleton className='h-4 w-28' />
											</div>
										</TableCell>
										{[...Array(4)].map((_, j) => (
											<TableCell key={j}>
												<Skeleton className='h-4 w-full max-w-[120px]' />
											</TableCell>
										))}
										<TableCell className='pr-5'>
											<Skeleton className='h-8 w-8 rounded-md ml-auto' />
										</TableCell>
									</TableRow>
								))
							) : data?.results?.length ? (
								data.results.map((item, idx) => (
									<TableRow
										key={item.id}
										className='border-b hover:bg-muted/40 transition-colors group'
									>
										{/* Username + Avatar */}
										<TableCell className='pl-5 py-3'>
											<div className='flex items-center gap-3'>
												<Avatar className='w-9 h-9 ring-2 ring-border shrink-0'>
													<AvatarImage src={item.photo} />
													<AvatarFallback className='bg-primary/10 text-primary font-semibold text-sm'>
														{item.username?.[0]?.toUpperCase()}
													</AvatarFallback>
												</Avatar>
												<span className='text-sm font-medium text-foreground'>
													{item.username}
												</span>
											</div>
										</TableCell>

										{/* FIO */}
										<TableCell className='py-3 text-sm text-muted-foreground'>
											{item.rahbari || '—'}
										</TableCell>

										{/* Role badge */}
										<TableCell className='py-3'>
											<span
												className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getRoleColor(item.role)}`}
											>
												{renderRole(item.role)}
											</span>
										</TableCell>

										{/* Status */}
										<TableCell className='py-3'>
											<span
												className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
													item.status
														? 'bg-emerald-100 text-emerald-700 border-emerald-200'
														: 'bg-secondary text-secondary-foreground border-border'
												}`}
											>
												{item.status ? (
													<IconCircleCheckFilled size={12} />
												) : (
													<IconLoader size={12} className='animate-spin' />
												)}
												{item.status ? 'Faol' : 'Faol emas'}
											</span>
										</TableCell>

										{/* Faoliyati */}
										<TableCell className='py-3 text-sm text-muted-foreground'>
											{item.faoliyati || '—'}
										</TableCell>

										{/* Actions */}
										<TableCell className='py-3 pr-5 text-right'>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant='ghost'
														size='icon'
														className='w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity'
													>
														<MoreVertical className='w-4 h-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='w-44'>
													<DropdownMenuItem
														onClick={() =>
															navigate(`${item.username}/${item.id}`)
														}
														className='gap-2 text-sm cursor-pointer'
													>
														<Eye className='w-4 h-4' /> Ko'rish
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => {
															setEditData(item)
															setEditModal(true)
														}}
														className='gap-2 text-sm cursor-pointer'
													>
														<UserRoundPen className='w-4 h-4' /> Tahrirlash
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell colSpan={6} className='text-center py-16'>
										<EmptyOutline />
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* ── PAGINATION ── */}
			{totalPages > 1 && (
				<div className='flex items-center justify-between px-1'>
					<p className='text-xs text-muted-foreground'>
						{(page - 1) * pageSize + 1}–
						{Math.min(page * pageSize, data?.count || 0)} / {data?.count || 0}{' '}
						ta
					</p>
					<Pagination className='w-auto mx-0'>
						<PaginationContent className='gap-1'>
							<PaginationItem>
								<PaginationPrevious
									onClick={() => setPage(p => Math.max(p - 1, 1))}
									disabled={page === 1}
									className='h-8 px-3 text-xs rounded-lg disabled:opacity-40 disabled:cursor-not-allowed'
								/>
							</PaginationItem>

							{Array.from({ length: totalPages })
								.map((_, i) => i + 1)
								.filter(
									p =>
										p === 1 ||
										p === totalPages ||
										(p >= page - 1 && p <= page + 1),
								)
								.reduce((acc, p, idx, arr) => {
									if (idx > 0 && p - arr[idx - 1] > 1) {
										acc.push('ellipsis-' + p)
									}
									acc.push(p)
									return acc
								}, [])
								.map(p =>
									typeof p === 'string' ? (
										<PaginationItem key={p}>
											<span className='px-2 text-muted-foreground text-sm'>
												…
											</span>
										</PaginationItem>
									) : (
										<PaginationItem key={p}>
											<PaginationLink
												isActive={page === p}
												onClick={() => setPage(p)}
												className='h-8 w-8 text-xs rounded-lg'
											>
												{p}
											</PaginationLink>
										</PaginationItem>
									),
								)}

							<PaginationItem>
								<PaginationNext
									onClick={() => setPage(p => Math.min(p + 1, totalPages))}
									disabled={page === totalPages}
									className='h-8 px-3 text-xs rounded-lg disabled:opacity-40 disabled:cursor-not-allowed'
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</div>
			)}

			<Edit_Useful_Person
				open={editModal}
				setOpen={setEditModal}
				data={editData}
			/>
		</div>
	)
}
