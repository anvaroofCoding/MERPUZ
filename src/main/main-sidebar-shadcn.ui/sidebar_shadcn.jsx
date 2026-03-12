import { AppSidebar } from '@/components/app-sidebar'
import Example from '@/components/banner'
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'
import Notification from '@/pages/notification/notification'
import { useBolimNameQuery, useMEQuery, usePprMonthQuery } from '@/services/api'
import { setBolim } from '@/store/bolimSlice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useNavigate, useParams } from 'react-router-dom'

export default function Sidebar_Shadcn() {
	const navigate = useNavigate()
	const access = localStorage.getItem('access')
	const notiv = localStorage.getItem('notiv')
	const params = useParams()
	const [font, setFont] = useState('roboto')

	const { data: bolimCategory, isLoading } = useBolimNameQuery()
	const { data: me } = useMEQuery()
	const dispatch = useDispatch()
	const bolim = useSelector(state => state.bolim.bolim)
	const { data: PPR_DATA, refetch } = usePprMonthQuery({
		bolim_category: bolim,
	})

	// Font init
	useEffect(() => {
		const fonts = localStorage.getItem('font')
		setFont(fonts)
	}, [])

	// Default localStorage values
	if (!notiv) localStorage.setItem('notiv', 'rangli')
	if (!font) localStorage.setItem('font', 'roboto')

	// Auth guard
	if (!access) {
		window.location.href = '/no-token-and-go-login'
		return null
	}

	// 0-indeksli elementni avtomatik tanlash
	useEffect(() => {
		if (!bolim && bolimCategory?.length > 0) {
			dispatch(setBolim(bolimCategory[0].nomi))
		}
	}, [bolimCategory, bolim, dispatch])

	const breadcrumbItems = [
		params.MainTitle && { label: params.MainTitle, isLink: true },
		(params.SubTitle || params.MainTitle) && {
			label: params.SubTitle ?? params.MainTitle,
			onClick: () => navigate(-1),
		},
		params.than_title && { label: params.than_title },
	].filter(Boolean)

	return (
		<div className={font}>
			<SidebarProvider>
				<AppSidebar />
				<SidebarInset>
					{/* ── Header ── */}
					<header
						className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'
						style={{
							borderBottom: '1px solid var(--border)',
							background: 'var(--card)',
						}}
					>
						<div className='flex items-center justify-between gap-2 px-4 w-full'>
							{/* Left: trigger + breadcrumb */}
							<div className='flex items-center gap-2 min-w-0'>
								<SidebarTrigger className='-ml-1' />
								<Separator
									orientation='vertical'
									className='mr-2 data-[orientation=vertical]:h-4'
								/>
								<Breadcrumb>
									<BreadcrumbList>
										{breadcrumbItems.map((item, idx) => (
											<>
												{idx > 0 && (
													<BreadcrumbSeparator
														key={`sep-${idx}`}
														className='hidden md:block'
													/>
												)}
												<BreadcrumbItem
													key={`item-${idx}`}
													className={idx === 0 ? 'hidden md:block' : ''}
												>
													{item.isLink ? (
														<BreadcrumbLink
															className='text-sm font-medium transition-colors'
															style={{ color: 'var(--muted-foreground)' }}
														>
															{item.label}
														</BreadcrumbLink>
													) : (
														<BreadcrumbPage
															onClick={item.onClick}
															className='text-sm font-medium transition-colors'
															style={{
																color: item.onClick
																	? 'var(--muted-foreground)'
																	: 'var(--foreground)',
																cursor: item.onClick ? 'pointer' : 'default',
															}}
														>
															{item.label}
														</BreadcrumbPage>
													)}
												</BreadcrumbItem>
											</>
										))}
									</BreadcrumbList>
								</Breadcrumb>
							</div>

							{/* Right: select + notification */}
							<div className='flex gap-3 items-center shrink-0'>
								{me?.role !== 'bolim' && (
									<>
										{isLoading ? (
											<Skeleton className='w-32 h-8 rounded-lg' />
										) : (
											<Select
												value={bolim || bolimCategory?.[0]?.nomi || ''}
												onValueChange={value => {
													dispatch(setBolim(value))
													refetch()
												}}
											>
												<SelectTrigger
													className='h-8 text-sm rounded-lg min-w-[120px] max-w-[180px]'
													style={{
														background: 'var(--muted)',
														border: '1px solid var(--border)',
														color: 'var(--foreground)',
													}}
												>
													<SelectValue placeholder={bolimCategory?.[0]?.nomi} />
												</SelectTrigger>
												<SelectContent position='popper'>
													<SelectGroup>
														{bolimCategory?.map(item => (
															<SelectItem key={item.id} value={item.nomi}>
																{item.nomi}
															</SelectItem>
														))}
													</SelectGroup>
												</SelectContent>
											</Select>
										)}
									</>
								)}
								<Notification />
							</div>
						</div>
						<Example />
					</header>

					{/* ── Page content ── */}
					<div className='w-full h-full px-5 py-5'>
						<Outlet />
					</div>
				</SidebarInset>
			</SidebarProvider>
		</div>
	)
}
