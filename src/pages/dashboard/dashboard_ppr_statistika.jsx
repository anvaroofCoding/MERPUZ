import { usePpr_dashboard_statistikasiQuery } from '@/services/api'
import { useEffect, useState } from 'react'
import {
	Area,
	AreaChart,
	Bar,
	CartesianGrid,
	Cell,
	ComposedChart,
	Legend,
	Line,
	Pie,
	PieChart,
	RadialBar,
	RadialBarChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

const MONTHS = [
	'Yanvar',
	'Fevral',
	'Mart',
	'Aprel',
	'May',
	'Iyun',
	'Iyul',
	'Avgust',
	'Sentabr',
	'Oktabr',
	'Noyabr',
	'Dekabr',
]
const YEARS = Array.from({ length: 5 }, (_, i) => 2022 + i)

const PALETTE = [
	'oklch(0.809 0.105 251.813)',
	'oklch(0.623 0.214 259.815)',
	'oklch(0.546 0.245 262.881)',
	'oklch(0.488 0.243 264.376)',
	'oklch(0.424 0.199 265.638)',
	'oklch(66.2% 0.225 25.9)',
	'oklch(60.4% 0.26 302)',
	'oklch(69.6% 0.165 251)',
	'oklch(80.2% 0.134 225)',
	'oklch(90.7% 0.231 133)',
]

const CustomTooltip = ({ active, payload, label }) => {
	if (!active || !payload?.length) return null
	return (
		<div
			style={{
				background: 'var(--card)',
				border: '1px solid var(--border)',
				borderRadius: 'var(--radius-md)',
				padding: '10px 14px',
				fontSize: 12,
				color: 'var(--foreground)',
				boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
				backdropFilter: 'blur(8px)',
			}}
		>
			<p style={{ fontWeight: 700, marginBottom: 6, color: 'var(--primary)' }}>
				{label}
			</p>
			{payload.map((p, i) => (
				<p key={i} style={{ color: p.color, margin: '2px 0' }}>
					{p.name}:{' '}
					<b>{typeof p.value === 'number' ? p.value.toFixed(1) : p.value}</b>
				</p>
			))}
		</div>
	)
}

// Animated counter
function AnimatedNumber({ value, suffix = '' }) {
	const [display, setDisplay] = useState(0)
	useEffect(() => {
		let start = 0
		const end = parseFloat(value)
		if (isNaN(end)) return
		const duration = 900
		const step = 16
		const increment = (end / duration) * step
		const timer = setInterval(() => {
			start += increment
			if (start >= end) {
				setDisplay(end)
				clearInterval(timer)
			} else setDisplay(start)
		}, step)
		return () => clearInterval(timer)
	}, [value])
	return (
		<span>
			{typeof value === 'number' && !Number.isInteger(value)
				? display.toFixed(1)
				: Math.round(display)}
			{suffix}
		</span>
	)
}

export default function Dashboard_ppr_statistika() {
	const now = new Date()
	const [month, setMonth] = useState(now.getMonth() + 1)
	const [year, setYear] = useState(now.getFullYear())

	const { data, isLoading } = usePpr_dashboard_statistikasiQuery({
		year,
		month,
	})

	const allData = data?.data || []
	const filtered = allData.filter(d => d.umumiy_ppr > 0 || d.bajarilgan_ppr > 0)

	const totalUmumiy = filtered.reduce((s, d) => s + d.umumiy_ppr, 0)
	const totalBajarilgan = filtered.reduce((s, d) => s + d.bajarilgan_ppr, 0)
	const totalQolgan = totalUmumiy - totalBajarilgan
	const avgFoiz = filtered.length
		? filtered.reduce((s, d) => s + d.bajarilish_foizi, 0) / filtered.length
		: 0

	const sortedByFoiz = [...filtered].sort(
		(a, b) => b.bajarilish_foizi - a.bajarilish_foizi,
	)
	const radialData = sortedByFoiz.map((d, i) => ({
		...d,
		fill: PALETTE[i % PALETTE.length],
	}))

	const pieData = [
		{ name: 'Bajarilgan', value: totalBajarilgan, fill: 'var(--primary)' },
		{ name: 'Qolgan', value: totalQolgan, fill: 'var(--border)' },
	]

	const sel = {
		background: 'var(--card)',
		border: '1px solid var(--border)',
		borderRadius: 'var(--radius-sm)',
		color: 'var(--foreground)',
		padding: '7px 12px',
		fontSize: 13,
		cursor: 'pointer',
		outline: 'none',
		appearance: 'none',
		WebkitAppearance: 'none',
	}

	return (
		<div
			style={{
				minHeight: '100vh',
				background: 'var(--background)',
				color: 'var(--foreground)',
				fontFamily: "var(--hu-font-geist, 'Geist', 'Inter', sans-serif)",
				margin: '0 auto',
			}}
		>
			{/* ─── HEADER ─── */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					alignItems: 'center',
					justifyContent: 'space-between',
					gap: 12,
					marginBottom: 24,
				}}
			>
				<div>
					<h1
						style={{
							fontSize: 'clamp(18px, 4vw, 26px)',
							fontWeight: 900,
							margin: 0,
							letterSpacing: '-0.5px',
							background:
								'linear-gradient(100deg, var(--primary) 30%, var(--chart-1))',
							WebkitBackgroundClip: 'text',
							WebkitTextFillColor: 'transparent',
						}}
					>
						PPR Statistikasi
					</h1>
					<p
						style={{
							color: 'var(--muted-foreground)',
							fontSize: 12,
							margin: '3px 0 0',
						}}
					>
						{MONTHS[month - 1]} {year} — Profilaktik ta'mirlash hisoboti
					</p>
				</div>
				{/* Filters inline */}
				<div
					style={{
						display: 'flex',
						gap: 8,
						flexWrap: 'wrap',
						alignItems: 'center',
					}}
				>
					<div style={{ position: 'relative' }}>
						<select
							style={sel}
							value={month}
							onChange={e => setMonth(Number(e.target.value))}
						>
							{MONTHS.map((m, i) => (
								<option key={i} value={i + 1}>
									{m}
								</option>
							))}
						</select>
					</div>
					<div style={{ position: 'relative' }}>
						<select
							style={sel}
							value={year}
							onChange={e => setYear(Number(e.target.value))}
						>
							{YEARS.map(y => (
								<option key={y} value={y}>
									{y}
								</option>
							))}
						</select>
					</div>
				</div>
			</div>

			{/* ─── SUMMARY STRIP (replaces cards) ─── */}
			<div
				style={{
					background: 'var(--card)',
					border: '1px solid var(--border)',
					borderRadius: 'var(--radius-xl)',
					padding: '0',
					marginBottom: 20,
					overflow: 'hidden',
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
				}}
			>
				{[
					{
						label: 'Jami PPR',
						value: totalUmumiy,
						color: 'var(--chart-3)',
						suffix: '',
					},
					{
						label: 'Bajarilgan',
						value: totalBajarilgan,
						color: 'var(--primary)',
						suffix: '',
					},
					{
						label: 'Qolgan',
						value: totalQolgan,
						color: 'oklch(66.2% 0.225 25.9)',
						suffix: '',
					},
					{
						label: "O'rtacha %",
						value: avgFoiz,
						color: 'oklch(90.7% 0.231 133)',
						suffix: '%',
					},
					{
						label: 'Tuzilmalar',
						value: filtered.length,
						color: 'oklch(80.2% 0.134 225)',
						suffix: '',
					},
				].map((kpi, i, arr) => (
					<div
						key={kpi.label}
						style={{
							padding: '18px 16px',
							borderRight:
								i < arr.length - 1 ? '1px solid var(--border)' : 'none',
							borderBottom: '3px solid transparent',
							borderImage: `linear-gradient(90deg, ${kpi.color}, transparent) 1`,
							display: 'flex',
							flexDirection: 'column',
							gap: 4,
						}}
					>
						<span
							style={{
								fontSize: 11,
								color: 'var(--muted-foreground)',
								textTransform: 'uppercase',
								letterSpacing: '0.08em',
								fontWeight: 600,
							}}
						>
							{kpi.label}
						</span>
						<span
							style={{
								fontSize: 'clamp(20px, 3vw, 28px)',
								fontWeight: 900,
								color: kpi.color,
								lineHeight: 1,
							}}
						>
							{isLoading ? (
								'—'
							) : (
								<AnimatedNumber value={kpi.value} suffix={kpi.suffix} />
							)}
						</span>
					</div>
				))}
			</div>

			{/* ─── CHARTS GRID ─── */}
			<div
				style={{
					display: 'grid',
					gridTemplateColumns:
						'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
					gap: 16,
					marginBottom: 16,
				}}
			>
				{/* 1. Composed Bar + Line */}
				<div
					style={{
						background: 'var(--card)',
						border: '1px solid var(--border)',
						borderRadius: 'var(--radius-xl)',
						padding: '18px 16px',
						gridColumn: '1 / -1',
					}}
				>
					<p
						style={{
							fontSize: 12,
							fontWeight: 700,
							color: 'var(--muted-foreground)',
							marginBottom: 14,
							textTransform: 'uppercase',
							letterSpacing: '0.07em',
						}}
					>
						Jami va bajarilgan PPR · Foiz chizig'i
					</p>
					<ResponsiveContainer width='100%' height={260}>
						<ComposedChart
							data={filtered}
							margin={{ top: 4, right: 24, left: -10, bottom: 0 }}
						>
							<defs>
								<linearGradient id='barGrad1' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='0%'
										stopColor='var(--chart-3)'
										stopOpacity={0.9}
									/>
									<stop
										offset='100%'
										stopColor='var(--chart-3)'
										stopOpacity={0.4}
									/>
								</linearGradient>
								<linearGradient id='barGrad2' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='0%'
										stopColor='var(--primary)'
										stopOpacity={0.9}
									/>
									<stop
										offset='100%'
										stopColor='var(--primary)'
										stopOpacity={0.4}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='var(--border)'
								vertical={false}
							/>
							<XAxis
								dataKey='tuzilma_nomi'
								tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								yAxisId='left'
								tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								yAxisId='right'
								orientation='right'
								domain={[0, 100]}
								unit='%'
								tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Bar
								yAxisId='left'
								dataKey='umumiy_ppr'
								name='Jami PPR'
								fill='url(#barGrad1)'
								radius={[6, 6, 0, 0]}
								maxBarSize={40}
							/>
							<Bar
								yAxisId='left'
								dataKey='bajarilgan_ppr'
								name='Bajarilgan'
								fill='url(#barGrad2)'
								radius={[6, 6, 0, 0]}
								maxBarSize={40}
							/>
							<Line
								yAxisId='right'
								type='monotone'
								dataKey='bajarilish_foizi'
								name='Foiz %'
								stroke='oklch(90.7% 0.231 133)'
								strokeWidth={2.5}
								dot={{ fill: 'oklch(90.7% 0.231 133)', r: 4 }}
							/>
							<ReferenceLine
								yAxisId='right'
								y={50}
								stroke='var(--border)'
								strokeDasharray='4 4'
							/>
						</ComposedChart>
					</ResponsiveContainer>
				</div>

				{/* 2. Radial Bar */}
				<div
					style={{
						background: 'var(--card)',
						border: '1px solid var(--border)',
						borderRadius: 'var(--radius-xl)',
						padding: '18px 16px',
					}}
				>
					<p
						style={{
							fontSize: 12,
							fontWeight: 700,
							color: 'var(--muted-foreground)',
							marginBottom: 14,
							textTransform: 'uppercase',
							letterSpacing: '0.07em',
						}}
					>
						Bajarilish foizi · Radial
					</p>
					<ResponsiveContainer width='100%' height={240}>
						<RadialBarChart
							cx='50%'
							cy='50%'
							innerRadius='15%'
							outerRadius='85%'
							data={radialData}
							startAngle={90}
							endAngle={-270}
						>
							<RadialBar
								dataKey='bajarilish_foizi'
								nameKey='tuzilma_nomi'
								background={{ fill: 'var(--border)' }}
								cornerRadius={6}
								label={false}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Legend
								iconSize={8}
								wrapperStyle={{
									fontSize: 11,
									color: 'var(--muted-foreground)',
								}}
							/>
						</RadialBarChart>
					</ResponsiveContainer>
				</div>

				{/* 3. Donut */}
				<div
					style={{
						background: 'var(--card)',
						border: '1px solid var(--border)',
						borderRadius: 'var(--radius-xl)',
						padding: '18px 16px',
					}}
				>
					<p
						style={{
							fontSize: 12,
							fontWeight: 700,
							color: 'var(--muted-foreground)',
							marginBottom: 14,
							textTransform: 'uppercase',
							letterSpacing: '0.07em',
						}}
					>
						Bajarilish ulushi · Donut
					</p>
					<ResponsiveContainer width='100%' height={240}>
						<PieChart>
							<Pie
								data={pieData}
								cx='50%'
								cy='50%'
								innerRadius='50%'
								outerRadius='80%'
								dataKey='value'
								paddingAngle={3}
								cornerRadius={6}
							>
								{pieData.map((entry, i) => (
									<Cell key={i} fill={entry.fill} />
								))}
							</Pie>
							<Tooltip content={<CustomTooltip />} />
							<text
								x='50%'
								y='50%'
								textAnchor='middle'
								dominantBaseline='middle'
								style={{
									fill: 'var(--foreground)',
									fontSize: 22,
									fontWeight: 900,
								}}
							>
								{avgFoiz.toFixed(0)}%
							</text>
							<Legend
								iconSize={8}
								wrapperStyle={{
									fontSize: 11,
									color: 'var(--muted-foreground)',
								}}
							/>
						</PieChart>
					</ResponsiveContainer>
				</div>

				{/* 4. Area Chart */}
				<div
					style={{
						background: 'var(--card)',
						border: '1px solid var(--border)',
						borderRadius: 'var(--radius-xl)',
						padding: '18px 16px',
						gridColumn: '1 / -1',
					}}
				>
					<p
						style={{
							fontSize: 12,
							fontWeight: 700,
							color: 'var(--muted-foreground)',
							marginBottom: 14,
							textTransform: 'uppercase',
							letterSpacing: '0.07em',
						}}
					>
						Bajarilish foizi · Area ko'rinishi
					</p>
					<ResponsiveContainer width='100%' height={200}>
						<AreaChart
							data={sortedByFoiz}
							margin={{ top: 4, right: 16, left: -10, bottom: 0 }}
						>
							<defs>
								<linearGradient id='areaGrad' x1='0' y1='0' x2='0' y2='1'>
									<stop
										offset='5%'
										stopColor='var(--primary)'
										stopOpacity={0.4}
									/>
									<stop
										offset='95%'
										stopColor='var(--primary)'
										stopOpacity={0.02}
									/>
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray='3 3'
								stroke='var(--border)'
								vertical={false}
							/>
							<XAxis
								dataKey='tuzilma_nomi'
								tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								domain={[0, 100]}
								unit='%'
								tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Area
								type='monotone'
								dataKey='bajarilish_foizi'
								name='Foiz %'
								stroke='var(--primary)'
								strokeWidth={2.5}
								fill='url(#areaGrad)'
								dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 0 }}
							/>
							<ReferenceLine
								y={50}
								stroke='oklch(66.2% 0.225 25.9)'
								strokeDasharray='4 4'
								label={{
									value: '50%',
									fill: 'var(--muted-foreground)',
									fontSize: 10,
								}}
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>

				{/* 5. Horizontal Bar — top performers */}
				<div
					style={{
						background: 'var(--card)',
						border: '1px solid var(--border)',
						borderRadius: 'var(--radius-xl)',
						padding: '18px 16px',
						gridColumn: '1 / -1',
					}}
				>
					<p
						style={{
							fontSize: 12,
							fontWeight: 700,
							color: 'var(--muted-foreground)',
							marginBottom: 14,
							textTransform: 'uppercase',
							letterSpacing: '0.07em',
						}}
					>
						Foiz bo'yicha reyting
					</p>
					<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
						{sortedByFoiz.map((d, i) => (
							<div
								key={d.tuzilma_id}
								style={{ display: 'flex', alignItems: 'center', gap: 10 }}
							>
								<span
									style={{
										fontSize: 11,
										fontWeight: 700,
										color: 'var(--muted-foreground)',
										width: 20,
										textAlign: 'right',
										flexShrink: 0,
									}}
								>
									{i + 1}
								</span>
								<span
									style={{
										fontSize: 12,
										fontWeight: 600,
										width: 80,
										flexShrink: 0,
										overflow: 'hidden',
										textOverflow: 'ellipsis',
										whiteSpace: 'nowrap',
									}}
								>
									{d.tuzilma_nomi}
								</span>
								<div
									style={{
										flex: 1,
										background: 'var(--border)',
										borderRadius: 999,
										height: 10,
										overflow: 'hidden',
									}}
								>
									<div
										style={{
											width: `${Math.min(d.bajarilish_foizi, 100)}%`,
											height: '100%',
											background: `linear-gradient(90deg, ${PALETTE[i % PALETTE.length]}, ${PALETTE[(i + 2) % PALETTE.length]})`,
											borderRadius: 999,
											transition: 'width 0.8s cubic-bezier(0.34,1.56,0.64,1)',
											boxShadow: `0 0 8px ${PALETTE[i % PALETTE.length]}66`,
										}}
									/>
								</div>
								<span
									style={{
										fontSize: 12,
										fontWeight: 800,
										width: 42,
										textAlign: 'right',
										flexShrink: 0,
										color:
											d.bajarilish_foizi >= 75
												? 'oklch(90.7% 0.231 133)'
												: d.bajarilish_foizi >= 40
													? 'var(--primary)'
													: 'oklch(66.2% 0.225 25.9)',
									}}
								>
									{d.bajarilish_foizi.toFixed(1)}%
								</span>
							</div>
						))}
						{!filtered.length && !isLoading && (
							<p
								style={{
									color: 'var(--muted-foreground)',
									fontSize: 13,
									textAlign: 'center',
									padding: '20px 0',
								}}
							>
								Bu oy uchun ma'lumot yo'q
							</p>
						)}
					</div>
				</div>
			</div>

			{/* ─── TABLE ─── */}
			<div
				style={{
					background: 'var(--card)',
					border: '1px solid var(--border)',
					borderRadius: 'var(--radius-xl)',
					overflow: 'hidden',
				}}
			>
				<div
					style={{
						padding: '16px 20px',
						borderBottom: '1px solid var(--border)',
					}}
				>
					<p
						style={{
							fontSize: 12,
							fontWeight: 700,
							color: 'var(--muted-foreground)',
							margin: 0,
							textTransform: 'uppercase',
							letterSpacing: '0.07em',
						}}
					>
						Batafsil jadval
					</p>
				</div>
				<div style={{ overflowX: 'auto' }}>
					<table
						style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}
					>
						<thead>
							<tr
								style={{ background: 'oklch(from var(--muted) l c h / 0.5)' }}
							>
								{[
									'#',
									'Tuzilma',
									'Jami PPR',
									'Bajarilgan',
									'Qolgan',
									'Foiz',
									'Progress',
								].map(h => (
									<th
										key={h}
										style={{
											textAlign: 'left',
											padding: '10px 14px',
											color: 'var(--muted-foreground)',
											fontWeight: 600,
											fontSize: 11,
											textTransform: 'uppercase',
											letterSpacing: '0.06em',
											whiteSpace: 'nowrap',
										}}
									>
										{h}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{isLoading ? (
								<tr>
									<td
										colSpan={7}
										style={{
											padding: 32,
											textAlign: 'center',
											color: 'var(--muted-foreground)',
										}}
									>
										Yuklanmoqda...
									</td>
								</tr>
							) : (
								allData.map((row, i) => {
									const foizColor =
										row.bajarilish_foizi >= 75
											? 'oklch(90.7% 0.231 133)'
											: row.bajarilish_foizi >= 40
												? 'var(--primary)'
												: row.bajarilish_foizi > 0
													? 'oklch(66.2% 0.225 25.9)'
													: 'var(--muted-foreground)'
									return (
										<tr
											key={row.tuzilma_id}
											style={{
												borderBottom: '1px solid var(--border)',
												transition: 'background 0.15s',
											}}
											onMouseEnter={e =>
												(e.currentTarget.style.background =
													'oklch(from var(--muted) l c h / 0.4)')
											}
											onMouseLeave={e =>
												(e.currentTarget.style.background = 'transparent')
											}
										>
											<td
												style={{
													padding: '10px 14px',
													color: 'var(--muted-foreground)',
													fontSize: 11,
													fontWeight: 600,
												}}
											>
												{i + 1}
											</td>
											<td
												style={{
													padding: '10px 14px',
													fontWeight: 700,
													whiteSpace: 'nowrap',
												}}
											>
												{row.tuzilma_nomi}
											</td>
											<td style={{ padding: '10px 14px' }}>{row.umumiy_ppr}</td>
											<td
												style={{
													padding: '10px 14px',
													color: 'var(--primary)',
													fontWeight: 600,
												}}
											>
												{row.bajarilgan_ppr}
											</td>
											<td
												style={{
													padding: '10px 14px',
													color: 'oklch(66.2% 0.225 25.9)',
												}}
											>
												{row.umumiy_ppr - row.bajarilgan_ppr}
											</td>
											<td
												style={{
													padding: '10px 14px',
													color: foizColor,
													fontWeight: 800,
												}}
											>
												{row.bajarilish_foizi.toFixed(1)}%
											</td>
											<td style={{ padding: '10px 14px', minWidth: 100 }}>
												<div
													style={{
														background: 'var(--border)',
														borderRadius: 999,
														height: 6,
														overflow: 'hidden',
													}}
												>
													<div
														style={{
															width: `${Math.min(row.bajarilish_foizi, 100)}%`,
															height: '100%',
															background: foizColor,
															borderRadius: 999,
															boxShadow: `0 0 6px ${foizColor}88`,
															transition: 'width 0.6s ease',
														}}
													/>
												</div>
											</td>
										</tr>
									)
								})
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	)
}
